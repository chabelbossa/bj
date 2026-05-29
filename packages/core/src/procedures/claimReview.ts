import type { ClaimStatus, ClaimType, ProcedureClaim } from "../schemas";

export type ClaimReviewPriority = "critical" | "high" | "medium" | "low";

export type ClaimReviewItem = {
  claim: ProcedureClaim;
  priority: ClaimReviewPriority;
  reason: string;
  nextAction: string;
  needsCitation: boolean;
  needsHumanReview: boolean;
};

export type ClaimReviewSummary = {
  total: number;
  critical: number;
  high: number;
  medium: number;
  low: number;
  needsCitation: number;
  needsHumanReview: number;
};

const criticalClaimTypes = new Set<ClaimType>([
  "cost",
  "duration",
  "required_document",
  "procedure_step",
]);

const priorityRank: Record<ClaimReviewPriority, number> = {
  critical: 0,
  high: 1,
  medium: 2,
  low: 3,
};

const statusRank: Record<ClaimStatus, number> = {
  unverified: 0,
  partially_verified: 1,
  verified: 2,
  not_applicable: 3,
};

export const getClaimReviewItem = (claim: ProcedureClaim): ClaimReviewItem => {
  const hasSources = claim.sourceRefs.length > 0;
  const isCritical = criticalClaimTypes.has(claim.type);
  const needsCitation = !hasSources && claim.status !== "not_applicable";
  const needsHumanReview = claim.status === "unverified" || claim.status === "partially_verified";

  if (claim.status === "unverified" && isCritical && !hasSources) {
    return {
      claim,
      priority: "critical",
      reason: "Affirmation critique non vérifiée et sans citation.",
      nextAction:
        "Trouver une source officielle, rattacher une SourceReference ou masquer l'affirmation.",
      needsCitation,
      needsHumanReview,
    };
  }

  if (claim.status === "unverified" && isCritical) {
    return {
      claim,
      priority: "high",
      reason: "Affirmation critique encore non vérifiée.",
      nextAction: "Relire la source liée et confirmer explicitement le statut du claim.",
      needsCitation,
      needsHumanReview,
    };
  }

  if (claim.status === "partially_verified" && isCritical) {
    return {
      claim,
      priority: "medium",
      reason: "Affirmation critique partiellement vérifiée.",
      nextAction: "Compléter la revue humaine avant de présenter ce point comme stabilisé.",
      needsCitation,
      needsHumanReview,
    };
  }

  if (needsCitation) {
    return {
      claim,
      priority: "medium",
      reason: "Citation manquante.",
      nextAction: "Ajouter une SourceReference ou garder le point en information à vérifier.",
      needsCitation,
      needsHumanReview,
    };
  }

  return {
    claim,
    priority: "low",
    reason:
      claim.status === "verified"
        ? "Claim vérifié avec citation."
        : "Claim non applicable ou uniquement informatif.",
    nextAction: "Surveiller les changements de source lors des prochaines revues.",
    needsCitation,
    needsHumanReview,
  };
};

export const createClaimReviewBacklog = (claims: ProcedureClaim[]): ClaimReviewItem[] =>
  claims.map(getClaimReviewItem).sort((a, b) => {
    const priorityDiff = priorityRank[a.priority] - priorityRank[b.priority];

    if (priorityDiff !== 0) {
      return priorityDiff;
    }

    const statusDiff = statusRank[a.claim.status] - statusRank[b.claim.status];

    if (statusDiff !== 0) {
      return statusDiff;
    }

    return `${a.claim.procedureSlug}-${a.claim.type}-${a.claim.label}`.localeCompare(
      `${b.claim.procedureSlug}-${b.claim.type}-${b.claim.label}`,
    );
  });

export const summarizeClaimReviewBacklog = (items: ClaimReviewItem[]): ClaimReviewSummary => ({
  total: items.length,
  critical: items.filter((item) => item.priority === "critical").length,
  high: items.filter((item) => item.priority === "high").length,
  medium: items.filter((item) => item.priority === "medium").length,
  low: items.filter((item) => item.priority === "low").length,
  needsCitation: items.filter((item) => item.needsCitation).length,
  needsHumanReview: items.filter((item) => item.needsHumanReview).length,
});
