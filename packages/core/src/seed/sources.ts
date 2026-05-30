import type { OfficialSource, SourceDocument, SourceReference } from "../schemas";

export const DEMO_RETRIEVED_AT = "2026-05-19";
export const SERVICE_PUBLIC_RETRIEVED_AT = "2026-05-30";

export const demoOfficialSource: OfficialSource = {
  id: "demo-official-source-to-connect",
  name: "Donnée demo - source officielle à connecter",
  country: "BJ",
  institution: "Institution officielle à vérifier",
  url: "https://example.org/dossierbj-demo/source-a-connecter",
  sourceType: "demo",
  reliabilityLevel: "unknown",
  lastCheckedAt: DEMO_RETRIEVED_AT,
  status: "demo_unverified",
};

export const demoSourceDocument: SourceDocument = {
  id: "demo-source-document-to-connect",
  sourceId: demoOfficialSource.id,
  title: "Document officiel à connecter",
  url: demoOfficialSource.url,
  contentType: "text/html",
  retrievedAt: DEMO_RETRIEVED_AT,
  version: "demo",
  status: "demo_unverified",
};

export const demoSourceReference: SourceReference = {
  sourceId: demoOfficialSource.id,
  documentId: demoSourceDocument.id,
  url: demoSourceDocument.url,
  title: "Donnée demo - source officielle à connecter",
  excerpt: "Donnée de démonstration non officielle. À vérifier sur la plateforme officielle.",
  retrievedAt: DEMO_RETRIEVED_AT,
};

export const monEntrepriseOfficialSource: OfficialSource = {
  id: "official-source-monentreprise-bj",
  name: "MonEntreprise.bj - Guichet électronique APIEx",
  country: "BJ",
  institution: "APIEx, République du Bénin",
  url: "https://monentreprise.bj",
  sourceType: "official",
  reliabilityLevel: "high",
  lastCheckedAt: DEMO_RETRIEVED_AT,
  status: "active",
};

export const numeriqueOfficialSource: OfficialSource = {
  id: "official-source-numerique-gouv-bj",
  name: "Portail du Numérique - Bénin",
  country: "BJ",
  institution: "Ministère du Numérique et de la Digitalisation",
  url: "https://numerique.gouv.bj",
  sourceType: "official",
  reliabilityLevel: "high",
  lastCheckedAt: DEMO_RETRIEVED_AT,
  status: "active",
};

export const servicePublicOfficialSource: OfficialSource = {
  id: "official-source-service-public-bj",
  name: "Portail National des Services Publics",
  country: "BJ",
  institution: "République du Bénin",
  url: "https://service-public.bj",
  sourceType: "official",
  reliabilityLevel: "high",
  lastCheckedAt: SERVICE_PUBLIC_RETRIEVED_AT,
  status: "active",
};

export const monEntrepriseGuideDocument: SourceDocument = {
  id: "source-document-monentreprise-guide-creation",
  sourceId: monEntrepriseOfficialSource.id,
  title: "Guide de création d'entreprise",
  url: "https://monentreprise.bj/informer/guide-creation",
  contentType: "text/html",
  retrievedAt: DEMO_RETRIEVED_AT,
  version: "2026-05-19-manual-review",
  status: "active",
};

export const monEntrepriseProcessDocument: SourceDocument = {
  id: "source-document-monentreprise-processus",
  sourceId: monEntrepriseOfficialSource.id,
  title: "Processus de formalisation",
  url: "https://monentreprise.bj/informer/processus",
  contentType: "text/html",
  retrievedAt: DEMO_RETRIEVED_AT,
  version: "2026-05-19-manual-review",
  status: "active",
};

export const monEntrepriseCostsDocument: SourceDocument = {
  id: "source-document-monentreprise-couts-delais",
  sourceId: monEntrepriseOfficialSource.id,
  title: "Coûts et délais",
  url: "https://monentreprise.bj/informer/couts-delais",
  contentType: "text/html",
  retrievedAt: DEMO_RETRIEVED_AT,
  version: "2026-05-19-manual-review",
  status: "active",
};

export const monEntreprisePiecesDocument: SourceDocument = {
  id: "source-document-monentreprise-pieces-requises",
  sourceId: monEntrepriseOfficialSource.id,
  title: "Pièces requises",
  url: "https://monentreprise.bj/informer/pieces-requises",
  contentType: "text/html",
  retrievedAt: DEMO_RETRIEVED_AT,
  version: "2026-05-19-manual-review",
  status: "active",
};

export const monEntrepriseCertificatesDocument: SourceDocument = {
  id: "source-document-monentreprise-certificats",
  sourceId: monEntrepriseOfficialSource.id,
  title: "Certificats délivrés",
  url: "https://monentreprise.bj/informer/certificats",
  contentType: "text/html",
  retrievedAt: DEMO_RETRIEVED_AT,
  version: "2026-05-19-manual-review",
  status: "active",
};

export const numeriqueHomeDocument: SourceDocument = {
  id: "source-document-numerique-home-eservices",
  sourceId: numeriqueOfficialSource.id,
  title: "E-services populaires",
  url: "https://numerique.gouv.bj/",
  contentType: "text/html",
  retrievedAt: DEMO_RETRIEVED_AT,
  version: "2026-05-19-manual-review",
  status: "active",
};

export const numeriqueCasierArticleDocument: SourceDocument = {
  id: "source-document-numerique-article-ecasier",
  sourceId: numeriqueOfficialSource.id,
  title: "E-casier judiciaire via service-public.bj",
  url: "https://www.numerique.gouv.bj/publications/actualites/e-casier-judiciaire-plus-de-100-000-casiers-judiciaires-delivres-en-un-an-via-service-publicbj",
  contentType: "text/html",
  retrievedAt: DEMO_RETRIEVED_AT,
  version: "2026-05-19-manual-review",
  status: "active",
};

export const servicePublicCasierDocument: SourceDocument = {
  id: "source-document-service-public-casier",
  sourceId: servicePublicOfficialSource.id,
  title: "Demande d'extrait B3 du casier judiciaire",
  url: "https://service-public.bj/public/services/service/PS00373",
  contentType: "text/html",
  retrievedAt: SERVICE_PUBLIC_RETRIEVED_AT,
  version: "2026-05-30-service-public-api",
  status: "active",
};

export const servicePublicRccmDocument: SourceDocument = {
  id: "source-document-service-public-rccm-extrait",
  sourceId: servicePublicOfficialSource.id,
  title: "Extrait du Registre de Commerce et de Crédit Mobilier",
  url: "https://service-public.bj/public/services/service/PS00024",
  contentType: "text/html",
  retrievedAt: SERVICE_PUBLIC_RETRIEVED_AT,
  version: "2026-05-30-service-public-api",
  status: "active",
};

export const monEntrepriseGuideRef: SourceReference = {
  sourceId: monEntrepriseOfficialSource.id,
  documentId: monEntrepriseGuideDocument.id,
  url: monEntrepriseGuideDocument.url,
  title: monEntrepriseGuideDocument.title,
  excerpt:
    "MonEntreprise.bj présente le guichet unique APIEx comme canal en ligne de création d'entreprise.",
  retrievedAt: DEMO_RETRIEVED_AT,
};

export const monEntrepriseProcessRef: SourceReference = {
  sourceId: monEntrepriseOfficialSource.id,
  documentId: monEntrepriseProcessDocument.id,
  url: monEntrepriseProcessDocument.url,
  title: monEntrepriseProcessDocument.title,
  excerpt:
    "Le processus public décrit les vérifications préalables, la constitution du dossier, le formulaire en ligne, le paiement, le traitement et la réception des documents.",
  retrievedAt: DEMO_RETRIEVED_AT,
};

export const monEntrepriseCostsRef: SourceReference = {
  sourceId: monEntrepriseOfficialSource.id,
  documentId: monEntrepriseCostsDocument.id,
  url: monEntrepriseCostsDocument.url,
  title: monEntrepriseCostsDocument.title,
  excerpt:
    "La page coûts et délais indique des tarifs de création selon la forme juridique et un délai de traitement de 3 heures ouvrables après paiement.",
  retrievedAt: DEMO_RETRIEVED_AT,
};

export const monEntreprisePiecesRef: SourceReference = {
  sourceId: monEntrepriseOfficialSource.id,
  documentId: monEntreprisePiecesDocument.id,
  url: monEntreprisePiecesDocument.url,
  title: monEntreprisePiecesDocument.title,
  excerpt:
    "La page pièces requises liste des documents pour l'enregistrement d'un établissement et précise les formats de fichiers acceptés.",
  retrievedAt: DEMO_RETRIEVED_AT,
};

export const monEntrepriseCertificatesRef: SourceReference = {
  sourceId: monEntrepriseOfficialSource.id,
  documentId: monEntrepriseCertificatesDocument.id,
  url: monEntrepriseCertificatesDocument.url,
  title: monEntrepriseCertificatesDocument.title,
  excerpt:
    "La page certificats délivrés cite notamment l'extrait RCCM, l'attestation IFU, la notification CNSS et d'autres documents liés à la création.",
  retrievedAt: DEMO_RETRIEVED_AT,
};

export const numeriqueCasierServiceRef: SourceReference = {
  sourceId: numeriqueOfficialSource.id,
  documentId: numeriqueHomeDocument.id,
  url: numeriqueHomeDocument.url,
  title: "Portail du Numérique - service casier judiciaire",
  excerpt:
    "Le portail du numérique indique que le service permet aux citoyens béninois et aux étrangers résidant ou ayant résidé au Bénin de demander un extrait B3.",
  retrievedAt: DEMO_RETRIEVED_AT,
};

export const numeriqueRccmServiceRef: SourceReference = {
  sourceId: numeriqueOfficialSource.id,
  documentId: numeriqueHomeDocument.id,
  url: numeriqueHomeDocument.url,
  title: "Portail du Numérique - service extrait RCCM",
  excerpt:
    "Le portail du numérique présente un service pour obtenir un extrait RCCM d'une entreprise non radiée.",
  retrievedAt: DEMO_RETRIEVED_AT,
};

export const numeriqueCasierArticleRef: SourceReference = {
  sourceId: numeriqueOfficialSource.id,
  documentId: numeriqueCasierArticleDocument.id,
  url: numeriqueCasierArticleDocument.url,
  title: numeriqueCasierArticleDocument.title,
  excerpt:
    "L'article rappelle l'usage de service-public.bj pour demander un casier judiciaire et recommande de renseigner correctement nom, prénom et adresse e-mail.",
  retrievedAt: DEMO_RETRIEVED_AT,
};

export const servicePublicCasierRef: SourceReference = {
  sourceId: servicePublicOfficialSource.id,
  documentId: servicePublicCasierDocument.id,
  url: servicePublicCasierDocument.url,
  title: servicePublicCasierDocument.title,
  excerpt:
    "Le service-public.bj indique un extrait B3 actif, 1 900 FCFA, 72h annoncées, validité de 3 mois et des pièces variant selon le profil du demandeur.",
  retrievedAt: SERVICE_PUBLIC_RETRIEVED_AT,
};

export const servicePublicRccmRef: SourceReference = {
  sourceId: servicePublicOfficialSource.id,
  documentId: servicePublicRccmDocument.id,
  url: servicePublicRccmDocument.url,
  title: servicePublicRccmDocument.title,
  excerpt:
    "Le service-public.bj indique un service RCCM actif, 5 000 FCFA, un parcours en ligne instantané, et aucune pièce requise pour le service en ligne.",
  retrievedAt: SERVICE_PUBLIC_RETRIEVED_AT,
};

export const officialSources: OfficialSource[] = [
  monEntrepriseOfficialSource,
  numeriqueOfficialSource,
  servicePublicOfficialSource,
  demoOfficialSource,
];

export const sourceDocuments: SourceDocument[] = [
  monEntrepriseGuideDocument,
  monEntrepriseProcessDocument,
  monEntrepriseCostsDocument,
  monEntreprisePiecesDocument,
  monEntrepriseCertificatesDocument,
  numeriqueHomeDocument,
  numeriqueCasierArticleDocument,
  servicePublicCasierDocument,
  servicePublicRccmDocument,
  demoSourceDocument,
];
