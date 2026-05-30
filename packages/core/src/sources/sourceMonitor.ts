export type ServicePublicWatchItem = {
  serviceId: string;
  title: string;
  url: string;
  expectedStatus: string;
  expectedFeeIncludes: string[];
  expectedDelayIncludes: string[];
  expectedDocumentTerms: string[];
};

export type SourceMonitorChange = {
  serviceId: string;
  title: string;
  field: "status" | "fee" | "delay" | "documents" | "network";
  expected: string;
  received: string;
};

export type SourceMonitorResult = {
  checkedAt: string;
  total: number;
  ok: number;
  changes: SourceMonitorChange[];
};

type FetchLike = typeof fetch;

type ServicePublicDetail = {
  overview?: {
    status?: string;
  };
  eService?: {
    delayTime?: string;
    eApplicationFee?: string;
    eRequiredDocuments?: string;
  };
  mService?: {
    delayTime?: string;
    fee?: string;
    mDocuments?: string;
  };
};

const servicePublicApiUrl = (serviceId: string) =>
  `https://service-public.bj/api/portal/publicservices/${serviceId}`;

const normalize = (value: string | undefined) =>
  (value ?? "")
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/gu, "")
    .replace(/\s+/gu, " ")
    .trim()
    .toLowerCase();

const includesAll = (received: string, expected: string[]) => {
  const normalizedReceived = normalize(received);

  return expected.every((term) => normalizedReceived.includes(normalize(term)));
};

export const servicePublicWatchlist: ServicePublicWatchItem[] = [
  {
    serviceId: "PS00373",
    title: "Casier judiciaire",
    url: "https://service-public.bj/public/services/service/PS00373",
    expectedStatus: "Actif",
    expectedFeeIncludes: ["1 900 FCFA"],
    expectedDelayIncludes: ["72h"],
    expectedDocumentTerms: ["Extrait d'acte de naissance", "Passeport", "Preuve de séjour"],
  },
  {
    serviceId: "PS00024",
    title: "Extrait RCCM",
    url: "https://service-public.bj/public/services/service/PS00024",
    expectedStatus: "Actif",
    expectedFeeIncludes: ["5 000 FCFA"],
    expectedDelayIncludes: ["Instantané", "48 heures"],
    expectedDocumentTerms: ["Aucune pièce", "Copie", "Quittance"],
  },
  {
    serviceId: "PS00392",
    title: "Certificat d'identification personnelle",
    url: "https://service-public.bj/public/services/service/PS00392",
    expectedStatus: "Actif",
    expectedFeeIncludes: ["1800 FCFA"],
    expectedDelayIncludes: ["48h"],
    expectedDocumentTerms: ["RAVIP", "acte de naissance", "attestation de résidence"],
  },
  {
    serviceId: "PS01512",
    title: "Attestation de régularité fiscale foncière",
    url: "https://service-public.bj/public/services/service/PS01512",
    expectedStatus: "Actif",
    expectedFeeIncludes: ["Gratuit"],
    expectedDelayIncludes: ["72 heures"],
    expectedDocumentTerms: ["IFU", "Situation fiscale foncière", "titre foncier"],
  },
];

export const evaluateServicePublicDetail = (
  item: ServicePublicWatchItem,
  detail: ServicePublicDetail,
): SourceMonitorChange[] => {
  const status = detail.overview?.status ?? "";
  const fee = [detail.eService?.eApplicationFee, detail.mService?.fee].filter(Boolean).join(" | ");
  const delay = [detail.eService?.delayTime, detail.mService?.delayTime]
    .filter(Boolean)
    .join(" | ");
  const documents = [detail.eService?.eRequiredDocuments, detail.mService?.mDocuments]
    .filter(Boolean)
    .join(" | ");
  const changes: SourceMonitorChange[] = [];

  if (normalize(status) !== normalize(item.expectedStatus)) {
    changes.push({
      serviceId: item.serviceId,
      title: item.title,
      field: "status",
      expected: item.expectedStatus,
      received: status || "non renseigné",
    });
  }

  if (!includesAll(fee, item.expectedFeeIncludes)) {
    changes.push({
      serviceId: item.serviceId,
      title: item.title,
      field: "fee",
      expected: item.expectedFeeIncludes.join(", "),
      received: fee || "non renseigné",
    });
  }

  if (!includesAll(delay, item.expectedDelayIncludes)) {
    changes.push({
      serviceId: item.serviceId,
      title: item.title,
      field: "delay",
      expected: item.expectedDelayIncludes.join(", "),
      received: delay || "non renseigné",
    });
  }

  if (!includesAll(documents, item.expectedDocumentTerms)) {
    changes.push({
      serviceId: item.serviceId,
      title: item.title,
      field: "documents",
      expected: item.expectedDocumentTerms.join(", "),
      received: documents ? documents.slice(0, 280) : "non renseigné",
    });
  }

  return changes;
};

export const runServicePublicMonitor = async ({
  fetchImpl = fetch,
  watchlist = servicePublicWatchlist,
}: {
  fetchImpl?: FetchLike;
  watchlist?: ServicePublicWatchItem[];
} = {}): Promise<SourceMonitorResult> => {
  const changes: SourceMonitorChange[] = [];

  for (const item of watchlist) {
    try {
      const response = await fetchImpl(servicePublicApiUrl(item.serviceId));

      if (!response.ok) {
        changes.push({
          serviceId: item.serviceId,
          title: item.title,
          field: "network",
          expected: "HTTP 200",
          received: `HTTP ${response.status}`,
        });
        continue;
      }

      const detail = (await response.json()) as ServicePublicDetail;
      changes.push(...evaluateServicePublicDetail(item, detail));
    } catch (error) {
      changes.push({
        serviceId: item.serviceId,
        title: item.title,
        field: "network",
        expected: "réponse API service-public.bj",
        received: error instanceof Error ? error.message : "erreur inconnue",
      });
    }
  }

  return {
    checkedAt: new Date().toISOString(),
    total: watchlist.length,
    ok: watchlist.length - new Set(changes.map((change) => change.serviceId)).size,
    changes,
  };
};
