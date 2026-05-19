import type { SourceReviewItem } from "../schemas";

export type ManualIngestionChecklistItem = {
  id: string;
  label: string;
  done: boolean;
};

export type ManualIngestionReadiness = {
  itemId: string;
  readyForVerifiedStatus: boolean;
  checklist: ManualIngestionChecklistItem[];
  nextAction: string;
};

export const manualIngestionWorkflow = [
  "Enregistrer l'URL candidate dans le registre local",
  "Confirmer l'autorité et le type de source",
  "Lire manuellement la page ou le document",
  "Extraire uniquement les affirmations explicitement présentes",
  "Rattacher chaque affirmation à une SourceReference",
  "Ajouter ou ajuster les tests avant de marquer la source vérifiée",
] as const;

export const getManualIngestionReadiness = (item: SourceReviewItem): ManualIngestionReadiness => {
  const hasCandidateUrl = item.candidateUrl.trim().length > 0;
  const hasConfirmedAuthority = item.authority !== "Institution officielle à confirmer";
  const hasHumanReview = Boolean(item.lastReviewedAt);
  const isVerified = item.status === "verified";

  const checklist: ManualIngestionChecklistItem[] = [
    {
      id: `${item.id}-url`,
      label: "URL candidate enregistrée",
      done: hasCandidateUrl,
    },
    {
      id: `${item.id}-authority`,
      label: "Autorité identifiée",
      done: hasConfirmedAuthority,
    },
    {
      id: `${item.id}-review`,
      label: "Revue humaine datée",
      done: hasHumanReview,
    },
    {
      id: `${item.id}-references`,
      label: "Citations rattachées dans les fiches liées",
      done: isVerified,
    },
  ];

  const readyForVerifiedStatus = checklist.every((step) => step.done);
  const nextAction = readyForVerifiedStatus
    ? "Conserver la source en statut vérifié et surveiller les changements."
    : (checklist.find((step) => !step.done)?.label ?? "Poursuivre la revue humaine.");

  return {
    itemId: item.id,
    readyForVerifiedStatus,
    checklist,
    nextAction,
  };
};
