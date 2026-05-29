import {
  sourceCandidateDraftSchema,
  type SourceCandidateDraft,
  type SourceReviewEvent,
  type SourceReviewItem,
} from "../schemas";

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

export type SourceCandidateDraftInput = {
  title: string;
  module: string;
  country: string;
  authority: string;
  candidateUrl: string;
  priority: SourceCandidateDraft["priority"];
  relatedProcedureSlugs: string[];
  notes: string[];
  createdAt?: string;
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

export const createSourceReviewEvents = (items: SourceReviewItem[]): SourceReviewEvent[] =>
  items.map((item) => ({
    id: `${item.id}-event-${item.lastReviewedAt ?? "pending"}`,
    reviewItemId: item.id,
    status: item.status,
    note: item.notes[0] ?? "Revue locale initiale.",
    reviewedAt: item.lastReviewedAt ?? "2026-05-19",
    actor: "local-operator",
  }));

const normalizeIdSegment = (value: string) =>
  value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/gu, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/gu, "-")
    .replace(/^-|-$/gu, "")
    .slice(0, 56);

export const createSourceCandidateDraft = (
  input: SourceCandidateDraftInput,
): SourceCandidateDraft => {
  const createdAt = input.createdAt ?? new Date().toISOString().slice(0, 10);
  const idSegment = normalizeIdSegment(`${input.title}-${input.authority}`) || "source";

  return sourceCandidateDraftSchema.parse({
    ...input,
    id: `source-candidate-${idSegment}-${createdAt}`,
    title: input.title.trim(),
    module: input.module.trim(),
    country: input.country.trim().toUpperCase(),
    authority: input.authority.trim(),
    candidateUrl: input.candidateUrl.trim(),
    relatedProcedureSlugs: input.relatedProcedureSlugs.map((slug) => slug.trim()).filter(Boolean),
    notes: input.notes.map((note) => note.trim()).filter(Boolean),
    createdAt,
  });
};

export const formatSourceCandidateSeedSnippet = (draft: SourceCandidateDraft) =>
  JSON.stringify(
    {
      id: draft.id.replace("source-candidate-", "source-review-"),
      title: draft.title,
      module: draft.module,
      country: draft.country,
      authority: draft.authority,
      candidateUrl: draft.candidateUrl,
      status: "to_connect",
      priority: draft.priority,
      relatedProcedureSlugs: draft.relatedProcedureSlugs,
      notes: [
        ...draft.notes,
        `Source proposée localement le ${draft.createdAt}. Revue humaine requise avant validation.`,
      ],
    } satisfies SourceReviewItem,
    null,
    2,
  );
