import { demoProcedures } from "../seed";
import type {
  ClaimStatus,
  ClaimType,
  Procedure,
  ProcedureClaim,
  SourceReference,
} from "../schemas";

const UNCONFIRMED_PATTERN =
  /information non (encore )?confirmée|information non (encore )?vérifiée|à vérifier|à confirmer|doit être confirmée|pas liste officielle|donnée demo|placeholder prudent/i;

const inferClaimType = (label: string, value = ""): ClaimType => {
  const text = `${label} ${value}`.toLowerCase();

  if (/(frais|coût|cout|tarif|payer|paiement)/u.test(text)) {
    return "cost";
  }

  if (/(délai|delai|temps|heure|jour|validité)/u.test(text)) {
    return "duration";
  }

  if (/(pièce|piece|document|justificatif|fichier)/u.test(text)) {
    return "required_document";
  }

  if (/(canal|url|service|plateforme|guichet)/u.test(text)) {
    return "official_channel";
  }

  if (/(public|éligible|eligible|condition|critère|critere)/u.test(text)) {
    return "eligibility";
  }

  return "general";
};

const statusFromProcedure = (procedure: Procedure): ClaimStatus => {
  if (procedure.verificationStatus === "verified") {
    return "verified";
  }

  if (procedure.verificationStatus === "partially_verified") {
    return "partially_verified";
  }

  return "unverified";
};

const statusFromValue = (procedure: Procedure, value: string, sourceRefs: SourceReference[]) => {
  if (UNCONFIRMED_PATTERN.test(value)) {
    return "unverified" as const;
  }

  if (sourceRefs.length === 0) {
    return "unverified" as const;
  }

  return statusFromProcedure(procedure);
};

const findFactSources = (
  procedure: Procedure,
  pattern: RegExp,
): { sourceRefs: SourceReference[]; status?: ClaimStatus; note?: string } | undefined => {
  const fact = procedure.verifiedFacts.find(
    (item) => pattern.test(item.label) || pattern.test(item.value),
  );

  if (!fact) {
    return undefined;
  }

  return {
    sourceRefs: fact.sourceRefs,
    status: fact.status,
    note: fact.note,
  };
};

const maybeAddFieldClaim = (
  claims: ProcedureClaim[],
  procedure: Procedure,
  field: "officialCost" | "estimatedDuration",
  label: string,
  type: ClaimType,
  sourceHint: RegExp,
) => {
  const value = procedure[field];

  if (!value) {
    return;
  }

  const factHint = findFactSources(procedure, sourceHint);
  const sourceRefs = factHint?.sourceRefs ?? [];

  claims.push({
    id: `${procedure.id}-claim-${field}`,
    procedureId: procedure.id,
    procedureSlug: procedure.slug,
    type,
    label,
    value,
    status: factHint?.status ?? statusFromValue(procedure, value, sourceRefs),
    sourceRefs,
    note: factHint?.note ?? "Champ de synthèse : revérifier sur la source avant usage critique.",
    sourceField: field,
  });
};

export const createProcedureClaims = (procedures: Procedure[] = demoProcedures): ProcedureClaim[] =>
  procedures.flatMap((procedure) => {
    const procedureStatus = statusFromProcedure(procedure);
    const claims: ProcedureClaim[] = [];

    for (const fact of procedure.verifiedFacts) {
      claims.push({
        id: fact.id,
        procedureId: procedure.id,
        procedureSlug: procedure.slug,
        type: inferClaimType(fact.label, fact.value),
        label: fact.label,
        value: fact.value,
        status: fact.status,
        sourceRefs: fact.sourceRefs,
        note: fact.note,
        sourceField: "verifiedFacts",
      });
    }

    maybeAddFieldClaim(
      claims,
      procedure,
      "officialCost",
      "Frais affichés dans la fiche",
      "cost",
      /(frais|coût|cout|tarif)/iu,
    );

    maybeAddFieldClaim(
      claims,
      procedure,
      "estimatedDuration",
      "Délai affiché dans la fiche",
      "duration",
      /(délai|delai|temps|heure|jour)/iu,
    );

    for (const document of procedure.requiredDocuments) {
      claims.push({
        id: `${document.id}-claim`,
        procedureId: procedure.id,
        procedureSlug: procedure.slug,
        type: "required_document",
        label: document.name,
        value: document.description,
        status: statusFromValue(
          procedure,
          `${document.description} ${document.condition ?? ""}`,
          document.sourceRefs,
        ),
        sourceRefs: document.sourceRefs,
        note: document.condition,
        sourceField: "requiredDocuments",
      });
    }

    for (const step of procedure.steps) {
      claims.push({
        id: `${step.id}-claim`,
        procedureId: procedure.id,
        procedureSlug: procedure.slug,
        type: "procedure_step",
        label: step.title,
        value: step.description,
        status: statusFromValue(procedure, step.description, step.sourceRefs),
        sourceRefs: step.sourceRefs,
        sourceField: "steps",
      });
    }

    for (const warning of procedure.warnings) {
      claims.push({
        id: `${procedure.id}-claim-warning-${claims.length + 1}`,
        procedureId: procedure.id,
        procedureSlug: procedure.slug,
        type: "warning",
        label: "Avertissement",
        value: warning,
        status: procedureStatus === "unverified" ? "unverified" : "not_applicable",
        sourceRefs: procedure.sources,
        sourceField: "warnings",
      });
    }

    return claims;
  });

export const getProcedureClaimsBySlug = (slug: string, procedures: Procedure[] = demoProcedures) =>
  createProcedureClaims(procedures).filter((claim) => claim.procedureSlug === slug);

const criticalClaimTypes = new Set<ClaimType>([
  "cost",
  "duration",
  "required_document",
  "procedure_step",
]);

const createStatusCounts = () =>
  ({
    verified: 0,
    partially_verified: 0,
    unverified: 0,
    not_applicable: 0,
  }) satisfies Record<ClaimStatus, number>;

const createTypeCounts = () =>
  ({
    general: 0,
    official_channel: 0,
    cost: 0,
    duration: 0,
    required_document: 0,
    procedure_step: 0,
    eligibility: 0,
    warning: 0,
  }) satisfies Record<ClaimType, number>;

export type ProcedureClaimCoverage = {
  procedureSlug: string;
  total: number;
  sourced: number;
  verifiedOrPartial: number;
  unverifiedCritical: number;
  sourceCoveragePercent: number;
  statusCounts: Record<ClaimStatus, number>;
};

export type ClaimCoverageSummary = {
  total: number;
  sourced: number;
  verifiedOrPartial: number;
  unverifiedCritical: number;
  sourceCoveragePercent: number;
  statusCounts: Record<ClaimStatus, number>;
  typeCounts: Record<ClaimType, number>;
  byProcedure: ProcedureClaimCoverage[];
};

const calculatePercent = (part: number, total: number) =>
  total === 0 ? 0 : Math.round((part / total) * 100);

const summarizeProcedureClaimCoverage = (
  procedureSlug: string,
  claims: ProcedureClaim[],
): ProcedureClaimCoverage => {
  const statusCounts = createStatusCounts();
  let sourced = 0;
  let verifiedOrPartial = 0;
  let unverifiedCritical = 0;

  for (const claim of claims) {
    statusCounts[claim.status] += 1;

    if (claim.sourceRefs.length > 0) {
      sourced += 1;
    }

    if (claim.status === "verified" || claim.status === "partially_verified") {
      verifiedOrPartial += 1;
    }

    if (claim.status === "unverified" && criticalClaimTypes.has(claim.type)) {
      unverifiedCritical += 1;
    }
  }

  return {
    procedureSlug,
    total: claims.length,
    sourced,
    verifiedOrPartial,
    unverifiedCritical,
    sourceCoveragePercent: calculatePercent(sourced, claims.length),
    statusCounts,
  };
};

export const summarizeClaimCoverage = (claims: ProcedureClaim[]): ClaimCoverageSummary => {
  const statusCounts = createStatusCounts();
  const typeCounts = createTypeCounts();
  const claimsByProcedure = new Map<string, ProcedureClaim[]>();
  let sourced = 0;
  let verifiedOrPartial = 0;
  let unverifiedCritical = 0;

  for (const claim of claims) {
    statusCounts[claim.status] += 1;
    typeCounts[claim.type] += 1;

    if (claim.sourceRefs.length > 0) {
      sourced += 1;
    }

    if (claim.status === "verified" || claim.status === "partially_verified") {
      verifiedOrPartial += 1;
    }

    if (claim.status === "unverified" && criticalClaimTypes.has(claim.type)) {
      unverifiedCritical += 1;
    }

    claimsByProcedure.set(claim.procedureSlug, [
      ...(claimsByProcedure.get(claim.procedureSlug) ?? []),
      claim,
    ]);
  }

  return {
    total: claims.length,
    sourced,
    verifiedOrPartial,
    unverifiedCritical,
    sourceCoveragePercent: calculatePercent(sourced, claims.length),
    statusCounts,
    typeCounts,
    byProcedure: Array.from(claimsByProcedure.entries())
      .map(([procedureSlug, procedureClaims]) =>
        summarizeProcedureClaimCoverage(procedureSlug, procedureClaims),
      )
      .sort((a, b) => a.procedureSlug.localeCompare(b.procedureSlug)),
  };
};
