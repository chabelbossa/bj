import { createProcedureClaims } from "../procedures/claims";
import { demoProcedures, demoSourceReviewItems } from "../seed";
import type { Procedure, ProcedureClaim, SourceReference, SourceReviewItem } from "../schemas";

export type SourceValidationIssue = {
  id: string;
  severity: "error" | "warning";
  targetType: "procedure" | "source_review";
  targetId: string;
  message: string;
};

const hasSourceRefs = (refs: SourceReference[]) => refs.length > 0;

const isSensitiveProcedure = (procedure: Procedure) =>
  procedure.verificationStatus === "verified" ||
  procedure.verificationStatus === "partially_verified";

export const validateSourceIntegrity = ({
  procedures = demoProcedures,
  reviewItems = demoSourceReviewItems,
  claims = createProcedureClaims(procedures),
}: {
  procedures?: Procedure[];
  reviewItems?: SourceReviewItem[];
  claims?: ProcedureClaim[];
} = {}): SourceValidationIssue[] => {
  const issues: SourceValidationIssue[] = [];

  for (const procedure of procedures) {
    if (!isSensitiveProcedure(procedure)) {
      continue;
    }

    const procedureClaims = claims.filter((claim) => claim.procedureId === procedure.id);

    if (procedureClaims.length === 0) {
      issues.push({
        id: `${procedure.id}-missing-claims`,
        severity: "error",
        targetType: "procedure",
        targetId: procedure.id,
        message: `La fiche ${procedure.title} est partiellement/vérifiée sans ProcedureClaim explicite.`,
      });
    }

    if (!hasSourceRefs(procedure.sources)) {
      issues.push({
        id: `${procedure.id}-missing-procedure-sources`,
        severity: "error",
        targetType: "procedure",
        targetId: procedure.id,
        message: `La fiche ${procedure.title} est partiellement/vérifiée sans source principale.`,
      });
    }

    for (const fact of procedure.verifiedFacts) {
      if (!hasSourceRefs(fact.sourceRefs)) {
        issues.push({
          id: `${fact.id}-missing-fact-sources`,
          severity: "error",
          targetType: "procedure",
          targetId: procedure.id,
          message: `L'affirmation "${fact.label}" n'a pas de SourceReference.`,
        });
      }
    }

    for (const document of procedure.requiredDocuments) {
      if (!hasSourceRefs(document.sourceRefs)) {
        issues.push({
          id: `${document.id}-missing-document-sources`,
          severity: "error",
          targetType: "procedure",
          targetId: procedure.id,
          message: `La pièce "${document.name}" n'a pas de SourceReference.`,
        });
      }
    }

    for (const step of procedure.steps) {
      if (!hasSourceRefs(step.sourceRefs)) {
        issues.push({
          id: `${step.id}-missing-step-sources`,
          severity: "error",
          targetType: "procedure",
          targetId: procedure.id,
          message: `L'étape "${step.title}" n'a pas de SourceReference.`,
        });
      }
    }

    for (const claim of procedureClaims) {
      if (
        (claim.status === "verified" || claim.status === "partially_verified") &&
        !hasSourceRefs(claim.sourceRefs)
      ) {
        issues.push({
          id: `${claim.id}-missing-claim-sources`,
          severity: "error",
          targetType: "procedure",
          targetId: procedure.id,
          message: `Le claim "${claim.label}" n'a pas de SourceReference.`,
        });
      }
    }
  }

  for (const item of reviewItems) {
    if (item.status === "verified" && item.candidateUrl.includes("example.org")) {
      issues.push({
        id: `${item.id}-verified-demo-url`,
        severity: "error",
        targetType: "source_review",
        targetId: item.id,
        message: `La source "${item.title}" est vérifiée mais pointe vers une URL demo.`,
      });
    }

    if (
      (item.status === "verified" || item.status === "needs_human_review") &&
      !item.lastReviewedAt
    ) {
      issues.push({
        id: `${item.id}-missing-review-date`,
        severity: "warning",
        targetType: "source_review",
        targetId: item.id,
        message: `La source "${item.title}" devrait avoir une date de revue humaine.`,
      });
    }
  }

  return issues;
};

export const getSourceValidationSummary = (issues: SourceValidationIssue[]) => ({
  total: issues.length,
  errors: issues.filter((issue) => issue.severity === "error").length,
  warnings: issues.filter((issue) => issue.severity === "warning").length,
});
