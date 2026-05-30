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
      "business-fact-duration",
      "Délai visible",
      "La page connectée indique un délai de traitement de 3 heures ouvrables après paiement.",
      "verified",
      [monEntrepriseCostsRef],
      "Toujours revérifier le délai au moment du dépôt.",
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
    "Fiche partiellement vérifiée à partir du Portail du Numérique et de la fiche service-public.bj du casier judiciaire. Elle couvre le canal, le coût, le délai annoncé, la validité et les pièces principales visibles dans la source officielle.",
  userNeed:
    "Identifier le bon canal public, le coût annoncé, le délai et les documents à préparer avant de demander un extrait B3.",
  expectedOutcome:
    "Une préparation prudente : vérifier la page officielle, préparer le bon justificatif selon son profil et contrôler les informations personnelles avant paiement.",
  officialUrl: servicePublicCasierRef.url,
  estimatedDuration:
    "72h annoncées sur service-public.bj ; le délai peut être plus long en cas de forte demande.",
  officialCost: "1 900 FCFA selon service-public.bj.",
  requiredDocuments: [
    {
      id: "casier-doc-benin-born-in-benin",
      name: "Extrait d'acte de naissance sécurisé ou légalisé",
      description:
        "Pièce indiquée pour les Béninois nés au Bénin. La fiche officielle demande aussi de préciser l'adresse du domicile, la profession, le nombre d'enfants à charge et la situation matrimoniale.",
      required: true,
      condition: "Profil : Béninois nés au Bénin.",
      sourceRefs: [servicePublicCasierRef],
    },
    {
      id: "casier-doc-benin-born-abroad",
      name: "Certificat de nationalité béninoise",
      description:
        "Pièce indiquée en plus de l'extrait d'acte de naissance sécurisé ou légalisé pour les Béninois nés à l'étranger.",
      required: true,
      condition: "Profil : Béninois nés à l'étranger.",
      sourceRefs: [servicePublicCasierRef],
    },
    {
      id: "casier-doc-foreigners-recent-entry",
      name: "Passeport et visa d'entrée",
      description:
        "Pour les étrangers avec date d'entrée inférieure à 3 mois, service-public.bj indique le passeport avec page identité et page tamponnée, plus le visa d'entrée. L'acte de naissance est indiqué comme optionnel.",
      required: true,
      condition: "Profil : étrangers, date d'entrée inférieure à 3 mois.",
      sourceRefs: [servicePublicCasierRef],
    },
    {
      id: "casier-doc-foreigners-residence-proof",
      name: "Passeport et preuve de séjour",
      description:
        "Pour les étrangers avec date d'entrée supérieure à 3 mois, service-public.bj indique le passeport avec page identité et page tamponnée, plus une carte de résident ou CIPR. L'acte de naissance ou le certificat de nationalité est indiqué comme optionnel.",
      required: true,
      condition: "Profil : étrangers, date d'entrée supérieure à 3 mois.",
      sourceRefs: [servicePublicCasierRef],
    },
    {
      id: "casier-doc-email",
      name: "Adresse e-mail valide",
      description:
        "L'article du Portail du Numérique insiste sur le bon renseignement de l'adresse e-mail pour recevoir le casier judiciaire.",
      required: true,
      condition: "Point de saisie et de réception, pas une pièce justificative.",
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
      title: "Préparer la pièce selon le profil",
      description:
        "Choisir la catégorie applicable : Béninois né au Bénin, Béninois né à l'étranger, étranger entré récemment ou étranger résident.",
      sourceRefs: [servicePublicCasierRef],
    },
    {
      id: "casier-step-check-identity",
      order: 3,
      title: "Vérifier les informations saisies",
      description:
        "Contrôler soigneusement nom, prénom, profil et adresse e-mail avant soumission.",
      sourceRefs: [numeriqueCasierArticleRef, servicePublicCasierRef],
    },
    {
      id: "casier-step-pay-and-follow",
      order: 4,
      title: "Payer et suivre le délai annoncé",
      description:
        "Le service-public.bj affiche 1 900 FCFA et 72h annoncées, avec une réserve en cas de forte demande.",
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
    "Changement éventuel du tarif avant paiement",
    "Délai réel si la demande est forte",
    "Cas particuliers non couverts par les profils listés",
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
      "La fiche service-public.bj indique 1 900 FCFA.",
      "verified",
      [servicePublicCasierRef],
      "Revérifier le tarif juste avant paiement.",
    ),
    createFact(
      "casier-fact-duration",
      "Délai annoncé",
      "La fiche service-public.bj indique 72h et précise que le délai peut être plus long en cas de forte demande.",
      "verified",
      [servicePublicCasierRef],
    ),
    createFact(
      "casier-fact-required-documents",
      "Pièces selon profil",
      "La fiche officielle distingue Béninois nés au Bénin, Béninois nés à l'étranger et étrangers selon la date d'entrée.",
      "verified",
      [servicePublicCasierRef],
    ),
  ],
  warnings: [
    "DossierBJ est indépendant et ne remplace pas service-public.bj.",
    "Les frais, délais et pièces doivent être revérifiés sur la page officielle avant paiement.",
    "Ne saisissez pas de numéro d'identité ou document personnel dans DossierBJ.",
  ],
  sources: [numeriqueCasierServiceRef, numeriqueCasierArticleRef, servicePublicCasierRef],
  sourceStatusNote:
    "Service, coût, délai annoncé et pièces principales extraits depuis la fiche service-public.bj le 2026-05-30. La fiche reste prudente car les valeurs peuvent changer.",
  lastVerifiedAt: "2026-05-30",
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
    "Fiche partiellement vérifiée : service-public.bj détaille le service d'extrait RCCM, et MonEntreprise.bj confirme que l'extrait RCCM fait partie des documents liés à la création d'entreprise.",
  userNeed:
    "Comprendre où demander un extrait RCCM, combien coûte la demande, le délai attendu et les pièces affichées selon le canal.",
  expectedOutcome:
    "Une checklist prudente pour identifier l'entreprise concernée, vérifier le statut non radié, payer le bon tarif et récupérer l'extrait depuis le canal officiel.",
  officialUrl: servicePublicRccmRef.url,
  estimatedDuration: "Instantané en ligne selon service-public.bj ; 48 heures en présentiel.",
  officialCost: "5 000 FCFA selon service-public.bj.",
  requiredDocuments: [
    {
      id: "rccm-doc-online-none",
      name: "Aucune pièce pour le service en ligne",
      description:
        "La fiche service-public.bj indique qu'aucune pièce n'est nécessaire pour le service en ligne.",
      required: true,
      condition: "Canal : service en ligne.",
      sourceRefs: [servicePublicRccmRef],
    },
    {
      id: "rccm-doc-in-person-copy",
      name: "Copie de l'extrait RCCM",
      description:
        "Pour le service en présentiel, service-public.bj indique une copie de l'extrait RCCM.",
      required: true,
      condition: "Canal : présentiel.",
      sourceRefs: [servicePublicRccmRef],
    },
    {
      id: "rccm-doc-in-person-receipt",
      name: "Quittance de paiement des frais",
      description:
        "Pour le service en présentiel, service-public.bj indique la quittance de paiement des frais.",
      required: true,
      condition: "Canal : présentiel.",
      sourceRefs: [servicePublicRccmRef],
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
      id: "rccm-step-online-search",
      order: 3,
      title: "Rechercher le nom de l'entreprise",
      description:
        "Le processus en ligne de service-public.bj commence par la recherche du nom de l'entreprise.",
      sourceRefs: [servicePublicRccmRef],
    },
    {
      id: "rccm-step-payment-download",
      order: 4,
      title: "Payer et télécharger l'extrait",
      description:
        "La fiche service-public.bj indique 5 000 FCFA, disponibilité instantanée en ligne et envoi du lien de téléchargement par e-mail.",
      sourceRefs: [servicePublicRccmRef],
    },
  ],
  preparationHints: [
    "Préparer le nom de l'entreprise et les références connues avant d'ouvrir le service.",
    "Vérifier que l'entreprise n'est pas radiée si cette condition est affichée sur le service officiel.",
    "Prévoir une adresse e-mail accessible pour recevoir le lien de téléchargement.",
    "Revérifier le montant sur le portail officiel juste avant paiement.",
  ],
  pointsToVerify: [
    "Changement éventuel du tarif avant paiement",
    "Disponibilité instantanée du service en ligne",
    "Critères exacts d'entreprise non radiée",
    "Support officiel si le lien e-mail n'arrive pas",
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
      "La fiche service-public.bj indique 5 000 FCFA, instantané en ligne et 48 heures en présentiel.",
      "verified",
      [servicePublicRccmRef],
    ),
    createFact(
      "rccm-fact-online-documents",
      "Pièces en ligne",
      "La fiche service-public.bj indique qu'aucune pièce n'est nécessaire pour le service en ligne.",
      "verified",
      [servicePublicRccmRef],
    ),
  ],
  warnings: [
    "DossierBJ est indépendant et ne remplace pas service-public.bj ni MonEntreprise.bj.",
    "Les frais, délais et pièces doivent être revérifiés sur service-public.bj avant paiement.",
    "Ne transmettez aucun document d'entreprise sensible dans DossierBJ.",
  ],
  sources: [numeriqueRccmServiceRef, servicePublicRccmRef, monEntrepriseCertificatesRef],
  sourceStatusNote:
    "Service, coût, délai et pièces extraits depuis la fiche service-public.bj le 2026-05-30. La fiche reste prudente car les valeurs peuvent changer.",
  lastVerifiedAt: "2026-05-30",
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
