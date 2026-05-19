import type { Checklist, ChecklistItem, Procedure, SourceReference } from "../schemas";

export type ChecklistProfile = {
  userType?: string;
  urgency?: "normal" | "soon" | "unknown";
  alreadyHasDocuments?: boolean;
  needsOfficialVerification?: boolean;
};

const createChecklistItem = (
  id: string,
  label: string,
  sourceRefs: SourceReference[],
  relatedDocumentId?: string,
): ChecklistItem => ({
  id,
  label,
  status: "todo",
  relatedDocumentId,
  sourceRefs,
});

export const generateProcedureChecklist = (
  procedure: Procedure,
  profile: ChecklistProfile = {},
): Checklist => {
  const items: ChecklistItem[] = [
    createChecklistItem(
      `${procedure.id}-check-source`,
      "Vérifier la source officielle ou contacter l'institution compétente",
      procedure.sources,
    ),
    ...procedure.requiredDocuments.map((document) =>
      createChecklistItem(
        `${procedure.id}-document-${document.id}`,
        `Confirmer la pièce : ${document.name}`,
        document.sourceRefs,
        document.id,
      ),
    ),
    ...procedure.steps.map((step) =>
      createChecklistItem(
        `${procedure.id}-step-${step.id}`,
        `Préparer l'étape : ${step.title}`,
        step.sourceRefs,
      ),
    ),
  ];

  if (profile.userType) {
    items.push(
      createChecklistItem(
        `${procedure.id}-profile-${profile.userType}`,
        `Vérifier les exigences spécifiques au profil : ${profile.userType}`,
        procedure.sources,
      ),
    );
  }

  if (profile.urgency === "soon") {
    items.push(
      createChecklistItem(
        `${procedure.id}-urgency`,
        "Confirmer les délais avant de prendre un engagement",
        procedure.sources,
      ),
    );
  }

  if (profile.alreadyHasDocuments === false) {
    items.push(
      createChecklistItem(
        `${procedure.id}-collect-documents`,
        "Lister les documents manquants après vérification officielle",
        procedure.sources,
      ),
    );
  }

  if (profile.needsOfficialVerification ?? true) {
    items.push(
      createChecklistItem(
        `${procedure.id}-final-verification`,
        "Relire la checklist avec une source officielle récente avant dépôt",
        procedure.sources,
      ),
    );
  }

  return {
    id: `checklist-${procedure.slug}`,
    procedureId: procedure.id,
    items,
    createdAt: "2026-05-19",
  };
};

export const getChecklistProgress = (items: ChecklistItem[]) => {
  if (items.length === 0) {
    return 0;
  }

  const completed = items.filter((item) => item.status === "done").length;

  return Math.round((completed / items.length) * 100);
};
