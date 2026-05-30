import type { Procedure, ProcedureFact } from "../schemas";

import {
  DEMO_RETRIEVED_AT,
  monEntrepriseCertificatesRef,
  monEntrepriseCostsRef,
  monEntrepriseGuideRef,
  monEntreprisePiecesRef,
  monEntrepriseProcessRef,
  numeriqueCasierArticleRef,
  numeriqueCasierServiceRef,
  numeriqueRccmServiceRef,
  servicePublicCasierRef,
  servicePublicCipRef,
  servicePublicRccmRef,
  servicePublicTaxClearanceRef,
} from "./sources";

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
      id: "casier-step-verify-inputs",
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

const taxClearanceProcedure: Procedure = {
  id: "procedure-core-tax-clearance-land",
  title: "Attestation de régularité fiscale foncière",
  slug: "attestation-regularite-fiscale-fonciere",
  country: "BJ",
  category: "Fiscalité",
  aliases: [
    "attestation fiscale",
    "foncier",
    "impôts",
    "regularite fiscale",
    "proprietaire terrien",
    "dgi",
  ],
  targetUsers: ["Propriétaires", "Citoyens", "Entreprises"],
  summary:
    "Fiche partiellement vérifiée à partir de service-public.bj. Elle couvre le public visé, le canal officiel, le coût annoncé, le délai et les prérequis visibles pour l'attestation de régularité fiscale foncière.",
  userNeed:
    "Savoir si ce service correspond à une preuve de régularité fiscale foncière et préparer les pièces citées avant de faire la demande.",
  expectedOutcome:
    "Une checklist prudente pour vérifier son IFU, sa situation fiscale foncière, les documents fonciers et le canal officiel avant soumission.",
  officialUrl: servicePublicTaxClearanceRef.url,
  estimatedDuration: "72 heures annoncées sur service-public.bj.",
  officialCost: "Gratuit selon service-public.bj.",
  requiredDocuments: [
    {
      id: "tax-clearance-doc-ifu",
      name: "Numéro IFU",
      description: "La fiche service-public.bj indique qu'il faut avoir un numéro IFU.",
      required: true,
      condition: "Pré-requis annoncé pour le propriétaire demandeur.",
      sourceRefs: [servicePublicTaxClearanceRef],
    },
    {
      id: "tax-clearance-doc-fiscal-status",
      name: "Situation fiscale foncière à jour",
      description:
        "La fiche officielle indique une situation fiscale foncière à jour avant délivrance.",
      required: true,
      condition: "À revérifier auprès de la DGI si un paiement récent n'est pas encore visible.",
      sourceRefs: [servicePublicTaxClearanceRef],
    },
    {
      id: "tax-clearance-doc-payment-receipt",
      name: "Quittance de paiement",
      description: "La fiche officielle cite une quittance de paiement parmi les pièces.",
      required: true,
      condition:
        "La fiche indique le service gratuit ; la quittance concerne la situation fiscale.",
      sourceRefs: [servicePublicTaxClearanceRef],
    },
    {
      id: "tax-clearance-doc-land-title",
      name: "Convention de vente ou titre foncier",
      description: "La fiche service-public.bj cite la convention de vente ou le titre foncier.",
      required: true,
      condition: "Selon le document disponible pour le bien foncier concerné.",
      sourceRefs: [servicePublicTaxClearanceRef],
    },
    {
      id: "tax-clearance-doc-recovery-or-survey",
      name: "Fiche de compulsion, avis de mise en recouvrement ou levée topographique",
      description:
        "La fiche officielle cite aussi la fiche de compulsion ou l'avis de mise en recouvrement, ainsi que la levée topographique.",
      required: true,
      condition: "Préparer les documents explicitement demandés sur le formulaire officiel.",
      sourceRefs: [servicePublicTaxClearanceRef],
    },
  ],
  steps: [
    {
      id: "tax-clearance-step-open-service",
      order: 1,
      title: "Ouvrir le service officiel",
      description:
        "Utiliser la fiche service-public.bj de l'attestation de régularité fiscale foncière.",
      sourceRefs: [servicePublicTaxClearanceRef],
    },
    {
      id: "tax-clearance-step-check-eligibility",
      order: 2,
      title: "Confirmer le profil propriétaire",
      description:
        "Le service cible les propriétaires terriens qui doivent prouver leur régularité fiscale foncière.",
      sourceRefs: [servicePublicTaxClearanceRef],
    },
    {
      id: "tax-clearance-step-prepare-files",
      order: 3,
      title: "Préparer les justificatifs fiscaux et fonciers",
      description:
        "Réunir IFU, situation fiscale foncière à jour, quittance, document de propriété et éléments topographiques cités.",
      sourceRefs: [servicePublicTaxClearanceRef],
    },
    {
      id: "tax-clearance-step-submit-follow",
      order: 4,
      title: "Soumettre et suivre le délai",
      description:
        "La fiche annonce un service gratuit et un délai de 72 heures, avec réception du document par mail.",
      sourceRefs: [servicePublicTaxClearanceRef],
    },
  ],
  preparationHints: [
    "Vérifier que l'IFU et la situation fiscale foncière sont à jour avant de lancer la demande.",
    "Préparer les justificatifs du bien foncier concerné dans les formats demandés par le service officiel.",
    "Utiliser une adresse e-mail accessible pour recevoir l'attestation.",
    "Revérifier la fiche service-public.bj avant soumission, surtout si un paiement fiscal récent vient d'être effectué.",
  ],
  pointsToVerify: [
    "Statut de mise à jour fiscale réellement visible côté DGI",
    "Pièce exacte demandée selon le type de propriété",
    "Canal de support si l'attestation n'arrive pas par mail",
    "Éventuelle évolution du délai de 72 heures",
  ],
  verifiedFacts: [
    createFact(
      "tax-clearance-fact-channel",
      "Canal officiel",
      "La fiche service-public.bj décrit un service de demande et de réception de l'attestation par mail.",
      "verified",
      [servicePublicTaxClearanceRef],
    ),
    createFact(
      "tax-clearance-fact-public",
      "Public visé",
      "Le service cible tout propriétaire terrien.",
      "verified",
      [servicePublicTaxClearanceRef],
    ),
    createFact(
      "tax-clearance-fact-cost",
      "Frais",
      "La fiche service-public.bj indique un service gratuit.",
      "verified",
      [servicePublicTaxClearanceRef],
      "Revérifier avant soumission si la fiche évolue.",
    ),
    createFact(
      "tax-clearance-fact-duration",
      "Délai annoncé",
      "La fiche service-public.bj indique 72 heures.",
      "verified",
      [servicePublicTaxClearanceRef],
    ),
    createFact(
      "tax-clearance-fact-documents",
      "Pièces et prérequis",
      "La fiche cite IFU, situation fiscale foncière à jour, quittance de paiement, document de propriété, fiche de compulsion ou avis de mise en recouvrement, et levée topographique.",
      "verified",
      [servicePublicTaxClearanceRef],
    ),
  ],
  warnings: [
    "DossierBJ est indépendant et ne remplace pas service-public.bj ni la DGI.",
    "Ne transmettez aucun titre foncier, IFU ou document fiscal dans DossierBJ.",
    "Revérifiez la gratuité, le délai et les pièces sur la fiche officielle avant soumission.",
  ],
  sources: [servicePublicTaxClearanceRef],
  sourceStatusNote:
    "Service, coût, délai, public et pièces extraits depuis la fiche service-public.bj le 2026-05-30. La fiche reste prudente car les valeurs peuvent changer.",
  lastVerifiedAt: "2026-05-30",
  verificationStatus: "partially_verified",
};

const cipProcedure: Procedure = {
  id: "procedure-core-personal-identification-certificate",
  title: "Certificat d'identification personnelle (CIP)",
  slug: "certificat-identification-personnelle",
  country: "BJ",
  category: "État civil et citoyenneté",
  aliases: [
    "cip",
    "cipr",
    "identification",
    "ravip",
    "certificat identification",
    "document etat civil",
  ],
  targetUsers: ["Citoyens", "Résidents", "Diaspora"],
  summary:
    "Fiche partiellement vérifiée à partir de service-public.bj. Elle couvre le certificat d'identification personnelle pour nationaux et résidents, le coût annoncé, le délai et les pièces visibles.",
  userNeed:
    "Comprendre quelles pièces préparer pour demander un CIP ou CIPR sans stocker de données personnelles dans DossierBJ.",
  expectedOutcome:
    "Une checklist prudente pour vérifier récépissé RAVIP, acte de naissance, justificatif de résidence et quittance avant d'utiliser le service officiel.",
  officialUrl: servicePublicCipRef.url,
  estimatedDuration: "48h annoncées sur service-public.bj.",
  officialCost: "1 800 FCFA selon service-public.bj.",
  requiredDocuments: [
    {
      id: "cip-doc-ravip-receipt",
      name: "Copie du récépissé RAVIP",
      description: "La fiche service-public.bj cite la copie du récépissé RAVIP.",
      required: true,
      condition: "Pour CIP national et CIPR résident selon la fiche officielle.",
      sourceRefs: [servicePublicCipRef],
    },
    {
      id: "cip-doc-birth-certificate",
      name: "Copie de l'acte de naissance",
      description: "La fiche officielle cite la copie de l'acte de naissance.",
      required: true,
      condition: "Pour nationaux et étrangers résidents selon le service affiché.",
      sourceRefs: [servicePublicCipRef],
    },
    {
      id: "cip-doc-residence-proof",
      name: "Attestation de résidence ou facture SBEE/SONEB",
      description:
        "La fiche service-public.bj cite l'attestation de résidence ou une facture SBEE/SONEB.",
      required: true,
      condition: "Justificatif de résidence indiqué pour CIP et CIPR.",
      sourceRefs: [servicePublicCipRef],
    },
    {
      id: "cip-doc-payment-receipt",
      name: "Quittance de paiement des frais",
      description: "La fiche officielle cite la quittance de paiement des frais.",
      required: true,
      condition: "À préparer après avoir vérifié le montant officiel au moment de la demande.",
      sourceRefs: [servicePublicCipRef],
    },
  ],
  steps: [
    {
      id: "cip-step-open-service",
      order: 1,
      title: "Ouvrir le service officiel",
      description:
        "Utiliser la fiche service-public.bj du certificat d'identification personnelle.",
      sourceRefs: [servicePublicCipRef],
    },
    {
      id: "cip-step-choose-profile",
      order: 2,
      title: "Choisir le profil CIP ou CIPR",
      description:
        "La fiche distingue le CIP pour les nationaux et le CIPR pour les étrangers résidents.",
      sourceRefs: [servicePublicCipRef],
    },
    {
      id: "cip-step-prepare-documents",
      order: 3,
      title: "Préparer les justificatifs",
      description:
        "Préparer récépissé RAVIP, acte de naissance, justificatif de résidence et quittance de paiement.",
      sourceRefs: [servicePublicCipRef],
    },
    {
      id: "cip-step-submit-follow",
      order: 4,
      title: "Soumettre et suivre le délai",
      description: "La fiche service-public.bj indique 1 800 FCFA et un délai de 48h.",
      sourceRefs: [servicePublicCipRef],
    },
  ],
  preparationHints: [
    "Vérifier que les informations RAVIP et acte de naissance correspondent exactement.",
    "Préparer le justificatif de résidence le plus récent disponible.",
    "Revérifier le montant sur la fiche officielle avant paiement.",
    "Ne pas déposer de copies de documents personnels dans DossierBJ.",
  ],
  pointsToVerify: [
    "Validité attendue des justificatifs de résidence",
    "Canal exact de paiement et de retrait",
    "Éventuelles règles spécifiques diaspora ou résident étranger",
    "Évolution du tarif ou du délai annoncé",
  ],
  verifiedFacts: [
    createFact(
      "cip-fact-service",
      "Objet du service",
      "La fiche service-public.bj décrit le CIP comme un document sécurisé qui certifie l'identité de la personne.",
      "verified",
      [servicePublicCipRef],
    ),
    createFact(
      "cip-fact-public",
      "Public indiqué",
      "La fiche service-public.bj indique tout citoyen et distingue CIP national et CIPR résident.",
      "verified",
      [servicePublicCipRef],
    ),
    createFact(
      "cip-fact-cost",
      "Frais",
      "La fiche service-public.bj indique 1 800 FCFA.",
      "verified",
      [servicePublicCipRef],
      "Revérifier le tarif avant paiement.",
    ),
    createFact(
      "cip-fact-duration",
      "Délai annoncé",
      "La fiche service-public.bj indique 48h.",
      "verified",
      [servicePublicCipRef],
    ),
    createFact(
      "cip-fact-documents",
      "Pièces",
      "La fiche cite récépissé RAVIP, acte de naissance, attestation de résidence ou facture SBEE/SONEB, et quittance de paiement.",
      "verified",
      [servicePublicCipRef],
    ),
  ],
  warnings: [
    "DossierBJ est indépendant et ne remplace pas service-public.bj ni l'ANIP.",
    "Ne téléversez aucun document d'identité ou justificatif de résidence dans DossierBJ.",
    "Revérifiez les frais, délais et pièces sur la fiche officielle avant paiement.",
  ],
  sources: [servicePublicCipRef],
  sourceStatusNote:
    "Service, coût, délai et pièces extraits depuis la fiche service-public.bj le 2026-05-30. La fiche reste prudente car les valeurs peuvent changer.",
  lastVerifiedAt: "2026-05-30",
  verificationStatus: "partially_verified",
};

export const demoProcedures: Procedure[] = [
  businessCreationProcedure,
  criminalRecordProcedure,
  rccmProcedure,
  taxClearanceProcedure,
  cipProcedure,
];
