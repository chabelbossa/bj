import type { Procedure, ProcedureFact, RequiredDocument } from "../schemas";

import {
  DEMO_RETRIEVED_AT,
  demoSourceReference,
  monEntrepriseCertificatesRef,
  monEntrepriseCostsRef,
  monEntrepriseGuideRef,
  monEntreprisePiecesRef,
  monEntrepriseProcessRef,
  numeriqueCasierArticleRef,
  numeriqueCasierServiceRef,
  numeriqueRccmServiceRef,
  servicePublicCasierRef,
  servicePublicRccmRef,
} from "./sources";

const createDemoRequiredDocuments = (procedureId: string): RequiredDocument[] => [
  {
    id: `${procedureId}-doc-official-list`,
    name: "Liste officielle des pièces",
    description: "Information non encore vérifiée. À confirmer sur la plateforme officielle.",
    required: true,
    condition: "Donnée demo : ne pas utiliser comme liste officielle.",
    sourceRefs: [demoSourceReference],
  },
  {
    id: `${procedureId}-doc-identity-context`,
    name: "Informations d'identification ou de contexte",
    description:
      "Placeholder prudent : le type exact d'information à préparer doit être confirmé par une source officielle.",
    required: true,
    condition: "Ne pas téléverser de document personnel dans le MVP.",
    sourceRefs: [demoSourceReference],
  },
];

const createFact = (
  id: string,
  label: string,
  value: string,
  status: ProcedureFact["status"],
  sourceRefs: ProcedureFact["sourceRefs"],
  note?: string,
): ProcedureFact => ({
  id,
  label,
  value,
  status,
  sourceRefs,
  note,
});

const createDemoProcedure = (
  id: string,
  title: string,
  slug: string,
  category: string,
  targetUsers: string[],
  aliases: string[],
  userNeed: string,
  expectedOutcome: string,
): Procedure => ({
  id,
  title,
  slug,
  country: "BJ",
  category,
  aliases,
  targetUsers,
  summary:
    "Donnée de démonstration non officielle. Cette fiche sert à tester le parcours et doit être remplacée par des sources officielles vérifiées.",
  userNeed,
  expectedOutcome,
  estimatedDuration: "Information non encore vérifiée",
  officialCost: "À vérifier sur la plateforme officielle",
  requiredDocuments: createDemoRequiredDocuments(id),
  steps: [
    {
      id: `${id}-step-source-check`,
      order: 1,
      title: "Vérifier la source officielle",
      description:
        "Consulter la plateforme officielle ou l'institution compétente avant de préparer le dossier.",
      sourceRefs: [demoSourceReference],
    },
    {
      id: `${id}-step-prepare`,
      order: 2,
      title: "Préparer les informations",
      description:
        "Rassembler uniquement les éléments confirmés par une source officielle ou par l'institution concernée.",
      sourceRefs: [demoSourceReference],
    },
    {
      id: `${id}-step-questions`,
      order: 3,
      title: "Noter les informations manquantes",
      description:
        "Lister les frais, délais, pièces ou conditions qui ne sont pas encore confirmés.",
      sourceRefs: [demoSourceReference],
    },
  ],
  preparationHints: [
    "Préparer une liste de questions à poser à l'institution compétente.",
    "Séparer les informations vérifiées des suppositions.",
    "Éviter de transmettre des documents personnels tant que le canal officiel n'est pas confirmé.",
  ],
  pointsToVerify: [
    "Pièces réellement obligatoires",
    "Frais officiels",
    "Délais officiels",
    "Canal de dépôt ou plateforme officielle",
  ],
  verifiedFacts: [
    createFact(
      `${id}-fact-demo`,
      "Statut des données",
      "Fiche de démonstration non officielle",
      "unverified",
      [demoSourceReference],
      "Aucune affirmation administrative ne doit être déduite de cette fiche.",
    ),
  ],
  warnings: [
    "Données de démonstration non officielles.",
    "Ne pas utiliser cette fiche comme référence administrative définitive.",
    "Vérifiez toujours les informations critiques auprès des plateformes officielles.",
  ],
  sources: [demoSourceReference],
  sourceStatusNote:
    "Source officielle non connectée. Cette fiche utilise une référence demo réservée à la validation produit.",
  lastVerifiedAt: DEMO_RETRIEVED_AT,
  verificationStatus: "demo_unverified",
});

const businessCreationProcedure: Procedure = {
  id: "procedure-core-business-creation",
  title: "Création d'entreprise",
  slug: "creation-entreprise",
  country: "BJ",
  category: "Entreprise",
  aliases: ["entreprise", "société", "formalisation", "création société", "monentreprise", "APIEx"],
  targetUsers: ["Entrepreneurs", "PME", "Consultants"],
  summary:
    "Fiche partiellement vérifiée à partir de pages publiques MonEntreprise.bj consultées manuellement. Elle couvre les points visibles dans les sources connectées, mais ne remplace pas le guichet officiel.",
  userNeed:
    "Comprendre les étapes, coûts indicatifs officiels visibles et points à préparer avant de commencer une création d'entreprise.",
  expectedOutcome:
    "Une checklist de préparation avec citations, en distinguant les informations vérifiées des points à revérifier avant paiement ou dépôt.",
  officialUrl: "https://monentreprise.bj/creer",
  estimatedDuration:
    "3 heures ouvrables après paiement selon MonEntreprise.bj ; à revérifier avant engagement.",
  officialCost:
    "Selon MonEntreprise.bj : 10 000 FCFA pour un établissement, 22 000 FCFA pour SARL/SUARL, 37 000 FCFA pour plusieurs autres formes. À revérifier avant paiement.",
  requiredDocuments: [
    {
      id: "business-doc-identity-national",
      name: "Carte d'identité biométrique ou Certificat d'Identification Personnel",
      description:
        "Indiqué pour les nationaux dans la page pièces requises de MonEntreprise.bj, pour le cas d'un établissement.",
      required: true,
      condition:
        "Champ d'application à confirmer si la forme juridique choisie n'est pas un établissement.",
      sourceRefs: [monEntreprisePiecesRef],
    },
    {
      id: "business-doc-passport-foreigners",
      name: "Passeport en cours de validité",
      description: "Indiqué pour les étrangers dans la page pièces requises de MonEntreprise.bj.",
      required: true,
      condition: "Uniquement pour les non-nationaux, selon la source consultée.",
      sourceRefs: [monEntreprisePiecesRef],
    },
    {
      id: "business-doc-criminal-record-or-declaration",
      name: "Extrait de casier judiciaire de moins de 3 mois ou déclaration sur l'honneur",
      description: "Indiqué dans la page pièces requises pour l'enregistrement d'un établissement.",
      required: true,
      condition: "À vérifier selon le type de demande et les règles en vigueur au moment du dépôt.",
      sourceRefs: [monEntreprisePiecesRef],
    },
    {
      id: "business-doc-photo",
      name: "Photo d'identité récente",
      description:
        "La source connectée mentionne une photo d'identité récente, en couleur et fond blanc.",
      required: true,
      condition: "Format exact à vérifier sur le formulaire officiel avant téléversement.",
      sourceRefs: [monEntreprisePiecesRef],
    },
    {
      id: "business-doc-residence-foreigners",
      name: "Carte consulaire, titre de séjour, eVisa ou carte de résident",
      description: "Mentionné pour les étrangers dans la source connectée.",
      required: true,
      condition: "Uniquement pour les étrangers, selon la source consultée.",
      sourceRefs: [monEntreprisePiecesRef],
    },
  ],
  steps: [
    {
      id: "business-step-prechecks",
      order: 1,
      title: "Faire les vérifications préalables",
      description:
        "Vérifier le nom commercial, l'adresse du siège social et l'éligibilité de l'activité.",
      sourceRefs: [monEntrepriseProcessRef],
    },
    {
      id: "business-step-file",
      order: 2,
      title: "Constituer le dossier",
      description:
        "Préparer les documents nécessaires selon la forme juridique et le profil du créateur.",
      sourceRefs: [monEntreprisePiecesRef, monEntrepriseProcessRef],
    },
    {
      id: "business-step-form",
      order: 3,
      title: "Remplir le formulaire en ligne",
      description:
        "Utiliser MonEntreprise.bj, choisir le type d'entreprise et suivre le formulaire guidé.",
      sourceRefs: [monEntrepriseGuideRef, monEntrepriseProcessRef],
    },
    {
      id: "business-step-payment",
      order: 4,
      title: "Payer les frais",
      description:
        "Régler les frais d'enregistrement en ligne selon les options proposées par la plateforme.",
      sourceRefs: [monEntrepriseCostsRef, monEntrepriseProcessRef],
    },
    {
      id: "business-step-processing",
      order: 5,
      title: "Suivre le traitement",
      description:
        "L'APIEx traite le dossier et effectue les formalités auprès des administrations concernées.",
      sourceRefs: [monEntrepriseProcessRef],
    },
    {
      id: "business-step-documents",
      order: 6,
      title: "Télécharger et vérifier les documents",
      description:
        "Récupérer les documents délivrés et vérifier leur authenticité quand un QR code est disponible.",
      sourceRefs: [monEntrepriseCertificatesRef, monEntrepriseProcessRef],
    },
  ],
  preparationHints: [
    "Choisir la forme juridique avant d'interpréter les coûts ou pièces à fournir.",
    "Vérifier la disponibilité du nom commercial et la conformité de l'adresse.",
    "Préparer les fichiers dans les formats acceptés par la plateforme officielle.",
    "Conserver les preuves de paiement et les références de demande.",
    "Relire la page officielle juste avant paiement, car tarifs et formulaires peuvent changer.",
  ],
  pointsToVerify: [
    "Forme juridique exacte et tarif applicable",
    "Pièces exigées pour une société, pas seulement pour un établissement",
    "Activités éventuellement réglementées",
    "Canal de support en cas de rejet ou de dossier incomplet",
  ],
  verifiedFacts: [
    createFact(
      "business-fact-official-channel",
      "Canal officiel connecté",
      "MonEntreprise.bj est présenté comme le guichet électronique APIEx pour la création d'entreprise.",
      "verified",
      [monEntrepriseGuideRef],
    ),
    createFact(
      "business-fact-process",
      "Étapes publiques",
      "Le processus connecté décrit des vérifications préalables, dossier, formulaire en ligne, paiement, traitement et réception des documents.",
      "verified",
      [monEntrepriseProcessRef],
    ),
    createFact(
      "business-fact-costs",
      "Coûts visibles",
      "La page connectée indique 10 000, 22 000 ou 37 000 FCFA selon la forme juridique.",
      "verified",
      [monEntrepriseCostsRef],
      "Toujours revérifier le tarif au moment du paiement.",
    ),
    createFact(
      "business-fact-documents",
      "Pièces visibles",
      "La page connectée liste des pièces pour l'enregistrement d'un établissement.",
      "partially_verified",
      [monEntreprisePiecesRef],
      "La liste ne doit pas être généralisée sans vérifier la forme juridique choisie.",
    ),
    createFact(
      "business-fact-certificates",
      "Documents délivrés",
      "La page connectée cite notamment extrait RCCM, attestation IFU, notification CNSS, déclaration DGT et annonce légale.",
      "verified",
      [monEntrepriseCertificatesRef],
    ),
  ],
  warnings: [
    "DossierBJ est indépendant et ne remplace pas MonEntreprise.bj ni l'APIEx.",
    "Les coûts et délais affichés doivent être revérifiés sur la plateforme officielle avant paiement.",
    "Les pièces peuvent varier selon la forme juridique, la nationalité et l'activité.",
    "Ne téléversez aucun document personnel dans DossierBJ.",
  ],
  sources: [
    monEntrepriseGuideRef,
    monEntrepriseProcessRef,
    monEntrepriseCostsRef,
    monEntreprisePiecesRef,
    monEntrepriseCertificatesRef,
  ],
  sourceStatusNote:
    "Sources officielles consultées manuellement le 2026-05-19. Fiche partielle : elle ne couvre pas encore tous les cas de création.",
  lastVerifiedAt: DEMO_RETRIEVED_AT,
  verificationStatus: "partially_verified",
};

const criminalRecordProcedure: Procedure = {
  id: "procedure-core-criminal-record",
  title: "Casier judiciaire",
  slug: "casier-judiciaire",
  country: "BJ",
  category: "Citoyenneté",
  aliases: ["casier", "extrait", "justice", "bulletin", "b3", "service-public"],
  targetUsers: ["Citoyens", "Diaspora"],
  summary:
    "Fiche partiellement vérifiée à partir du Portail du Numérique et d'une URL service-public.bj. Elle confirme l'existence du service et certains points de prudence, pas la liste exhaustive des pièces.",
  userNeed:
    "Identifier le bon canal public et les informations à préparer avant de demander un extrait B3.",
  expectedOutcome:
    "Une préparation prudente : vérifier la page officielle, renseigner correctement les informations personnelles et ne pas conclure sur les frais non sourcés.",
  officialUrl: servicePublicCasierRef.url,
  estimatedDuration:
    "Délai actuel non confirmé dans les sources connectées. À vérifier sur service-public.bj.",
  officialCost: "Information non confirmée dans les sources connectées.",
  requiredDocuments: [
    {
      id: "casier-doc-official-list",
      name: "Liste officielle des champs et pièces",
      description:
        "La liste exhaustive n'est pas encore extraite. Elle doit être vérifiée directement sur le service public avant toute demande.",
      required: true,
      condition: "Ne pas considérer cette fiche comme liste officielle de pièces.",
      sourceRefs: [servicePublicCasierRef, numeriqueCasierServiceRef],
    },
    {
      id: "casier-doc-email",
      name: "Adresse e-mail valide",
      description:
        "L'article du Portail du Numérique insiste sur le bon renseignement de l'adresse e-mail pour recevoir le casier judiciaire.",
      required: true,
      condition: "Point de saisie, pas une pièce justificative.",
      sourceRefs: [numeriqueCasierArticleRef],
    },
  ],
  steps: [
    {
      id: "casier-step-open-service",
      order: 1,
      title: "Ouvrir le service officiel",
      description:
        "Utiliser l'URL service-public.bj liée depuis le Portail du Numérique pour commencer la demande.",
      sourceRefs: [servicePublicCasierRef, numeriqueCasierServiceRef],
    },
    {
      id: "casier-step-check-identity",
      order: 2,
      title: "Vérifier les informations saisies",
      description: "Contrôler soigneusement nom, prénom et adresse e-mail avant soumission.",
      sourceRefs: [numeriqueCasierArticleRef],
    },
    {
      id: "casier-step-verify-fees",
      order: 3,
      title: "Confirmer frais et délai sur la plateforme officielle",
      description:
        "Les frais et le délai actuel ne sont pas confirmés dans les sources connectées au MVP.",
      sourceRefs: [servicePublicCasierRef],
    },
  ],
  preparationHints: [
    "Préparer les informations d'identité avec l'orthographe exacte.",
    "Utiliser une adresse e-mail accessible et correctement saisie.",
    "Consulter service-public.bj avant de payer ou de transmettre un document.",
    "Conserver la référence de demande si la plateforme en fournit une.",
  ],
  pointsToVerify: [
    "Frais actuels",
    "Délai actuel de délivrance",
    "Liste exacte des pièces demandées par le formulaire",
    "Canal de support officiel en cas de problème",
  ],
  verifiedFacts: [
    createFact(
      "casier-fact-eligible-users",
      "Public indiqué",
      "Le Portail du Numérique indique que le service concerne les citoyens béninois et les étrangers résidant ou ayant résidé au Bénin.",
      "verified",
      [numeriqueCasierServiceRef],
    ),
    createFact(
      "casier-fact-validity",
      "Validité indiquée",
      "Le Portail du Numérique indique une validité de 3 mois pour le casier judiciaire.",
      "verified",
      [numeriqueCasierServiceRef],
    ),
    createFact(
      "casier-fact-service-url",
      "URL du service",
      "L'article du Portail du Numérique renvoie vers service-public.bj pour faire une demande.",
      "verified",
      [numeriqueCasierArticleRef, servicePublicCasierRef],
    ),
    createFact(
      "casier-fact-fees",
      "Frais",
      "Non confirmés dans les sources connectées au MVP.",
      "unverified",
      [servicePublicCasierRef],
    ),
  ],
  warnings: [
    "DossierBJ est indépendant et ne remplace pas service-public.bj.",
    "Les frais, délais et pièces exactes doivent être vérifiés sur la page officielle avant demande.",
    "Ne saisissez pas de numéro d'identité ou document personnel dans DossierBJ.",
  ],
  sources: [numeriqueCasierServiceRef, numeriqueCasierArticleRef, servicePublicCasierRef],
  sourceStatusNote:
    "Service et URL confirmés via sources officielles ; détails opérationnels encore à extraire manuellement depuis service-public.bj.",
  lastVerifiedAt: DEMO_RETRIEVED_AT,
  verificationStatus: "partially_verified",
};

const rccmProcedure: Procedure = {
  id: "procedure-core-rccm",
  title: "Extrait RCCM",
  slug: "rccm",
  country: "BJ",
  category: "Entreprise",
  aliases: [
    "registre commerce",
    "immatriculation",
    "commerce",
    "entreprise",
    "rccm",
    "extrait rccm",
  ],
  targetUsers: ["Entrepreneurs", "PME"],
  summary:
    "Fiche partiellement vérifiée : le Portail du Numérique signale un service d'extrait RCCM, et MonEntreprise.bj confirme que l'extrait RCCM fait partie des documents liés à la création d'entreprise.",
  userNeed:
    "Comprendre où vérifier l'existence du service RCCM et quelles informations restent à confirmer avant demande.",
  expectedOutcome:
    "Une checklist prudente pour identifier l'entreprise concernée, vérifier le statut non radié et confirmer frais, pièces et délai sur service-public.bj.",
  officialUrl: servicePublicRccmRef.url,
  estimatedDuration: "Information non confirmée dans les sources connectées.",
  officialCost: "Information non confirmée dans les sources connectées.",
  requiredDocuments: [
    {
      id: "rccm-doc-company-info",
      name: "Informations d'identification de l'entreprise",
      description:
        "À préparer avant la demande, mais la liste officielle des champs et justificatifs doit être confirmée sur service-public.bj.",
      required: true,
      condition: "Donnée de préparation, pas liste officielle exhaustive.",
      sourceRefs: [servicePublicRccmRef, numeriqueRccmServiceRef],
    },
  ],
  steps: [
    {
      id: "rccm-step-check-service",
      order: 1,
      title: "Vérifier le service RCCM officiel",
      description: "Ouvrir le service service-public.bj lié depuis le Portail du Numérique.",
      sourceRefs: [servicePublicRccmRef, numeriqueRccmServiceRef],
    },
    {
      id: "rccm-step-company-status",
      order: 2,
      title: "Confirmer l'entreprise concernée",
      description:
        "Le service décrit par le Portail du Numérique concerne une entreprise non radiée.",
      sourceRefs: [numeriqueRccmServiceRef],
    },
    {
      id: "rccm-step-missing-info",
      order: 3,
      title: "Confirmer frais, délai et pièces",
      description:
        "Ces informations ne sont pas encore confirmées dans le MVP et doivent être vérifiées sur la plateforme officielle.",
      sourceRefs: [servicePublicRccmRef],
    },
  ],
  preparationHints: [
    "Préparer le nom de l'entreprise et les références connues avant d'ouvrir le service.",
    "Vérifier que l'entreprise n'est pas radiée si cette condition est affichée sur le service officiel.",
    "Ne pas supposer les frais ou délais depuis d'autres démarches.",
  ],
  pointsToVerify: [
    "Frais de demande d'extrait RCCM",
    "Délai de délivrance",
    "Critères exacts d'entreprise non radiée",
    "Pièces ou champs demandés par le service-public.bj",
  ],
  verifiedFacts: [
    createFact(
      "rccm-fact-service",
      "Service public repéré",
      "Le Portail du Numérique présente un service permettant d'obtenir un extrait RCCM d'une entreprise non radiée.",
      "verified",
      [numeriqueRccmServiceRef],
    ),
    createFact(
      "rccm-fact-creation-document",
      "Lien avec la création d'entreprise",
      "MonEntreprise.bj cite l'extrait RCCM parmi les documents officiels délivrés après création.",
      "verified",
      [monEntrepriseCertificatesRef],
    ),
    createFact(
      "rccm-fact-fees-delay",
      "Frais et délai",
      "Non confirmés dans les sources connectées au MVP.",
      "unverified",
      [servicePublicRccmRef],
    ),
  ],
  warnings: [
    "DossierBJ est indépendant et ne remplace pas service-public.bj ni MonEntreprise.bj.",
    "Les frais, délais et pièces exactes ne sont pas encore confirmés dans cette fiche.",
    "Ne transmettez aucun document d'entreprise sensible dans DossierBJ.",
  ],
  sources: [numeriqueRccmServiceRef, servicePublicRccmRef, monEntrepriseCertificatesRef],
  sourceStatusNote:
    "Service repéré sur une source officielle ; détails de demande encore à vérifier manuellement.",
  lastVerifiedAt: DEMO_RETRIEVED_AT,
  verificationStatus: "partially_verified",
};

export const demoProcedures: Procedure[] = [
  businessCreationProcedure,
  criminalRecordProcedure,
  rccmProcedure,
  createDemoProcedure(
    "procedure-demo-administrative-certificate",
    "Attestation administrative",
    "attestation-administrative",
    "Administration",
    ["Citoyens", "Organisations"],
    ["attestation", "certificat", "administration"],
    "Comprendre quoi vérifier avant de demander une attestation.",
    "Une vue claire des informations manquantes à confirmer.",
  ),
  createDemoProcedure(
    "procedure-demo-civil-status",
    "Demande de document d'état civil",
    "document-etat-civil",
    "État civil",
    ["Citoyens", "Diaspora"],
    ["état civil", "acte", "naissance", "mariage", "décès"],
    "Préparer une demande de document d'état civil sans stocker de données personnelles.",
    "Une checklist prudente orientée vérification officielle.",
  ),
];
