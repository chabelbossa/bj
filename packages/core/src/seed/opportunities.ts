import type { Opportunity } from "../schemas";

import { gouvBjPublicTendersRef } from "./sources";

const commonTenderDocuments = [
  {
    id: "ao-radar-doc-official-notice",
    name: "Avis officiel ou dossier de consultation",
    description:
      "Télécharger et lire l'avis officiel depuis la page source avant toute préparation de réponse.",
    required: true,
    condition: "Le détail exact dépend de l'opportunité publiée.",
    sourceRefs: [gouvBjPublicTendersRef],
  },
  {
    id: "ao-radar-doc-eligibility-proof",
    name: "Justificatifs d'éligibilité",
    description:
      "Préparer uniquement les justificatifs explicitement demandés par l'avis officiel ou le dossier.",
    required: true,
    condition: "À confirmer dans le dossier de consultation.",
    sourceRefs: [gouvBjPublicTendersRef],
  },
];

export const pilotOpportunities: Opportunity[] = [
  {
    id: "opportunity-gouv-bj-audiovisual-content-2026-06-08",
    title:
      "Appel à projets de coproduction, production ou développement de contenus valorisant le Bénin",
    sourceUrl: gouvBjPublicTendersRef.url,
    authority: "Gouvernement de la République du Bénin",
    country: "BJ",
    sector: "Culture, audiovisuel et numérique",
    deadline: "2026-06-08",
    summary:
      "Opportunité pilote repérée sur la page officielle des marchés publics gouv.bj. DossierBJ ne remplace pas l'avis officiel et sert seulement à préparer la vérification.",
    requiredDocuments: commonTenderDocuments,
    eligibility: [
      "Lire l'avis officiel et confirmer le porteur éligible.",
      "Vérifier la date limite et les modalités de dépôt avant toute réponse.",
      "Préparer une matrice de conformité à partir du dossier officiel.",
    ],
    status: "open",
  },
  {
    id: "opportunity-gouv-bj-mef-report-deadlines-2026-06-01",
    title: "Avis de report de dates limites pour un appel d'offres MEF",
    sourceUrl: gouvBjPublicTendersRef.url,
    authority: "Ministère de l'Économie et des Finances",
    country: "BJ",
    sector: "Administration et fournitures",
    deadline: "2026-06-01",
    summary:
      "Opportunité pilote issue de la page officielle gouv.bj des marchés publics. Le report de délai doit être relu dans l'avis officiel avant décision.",
    requiredDocuments: commonTenderDocuments,
    eligibility: [
      "Confirmer que l'avis de report concerne le dossier visé.",
      "Comparer l'ancienne et la nouvelle date limite dans le document officiel.",
      "Ne pas soumettre sans vérifier la version la plus récente de l'avis.",
    ],
    status: "open",
  },
];
