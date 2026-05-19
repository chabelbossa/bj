import type { SourceReviewPriority, SourceReviewStatus } from "@dossierbj/core";

const statusLabels: Record<SourceReviewStatus, string> = {
  to_connect: "À connecter",
  needs_human_review: "Revue humaine",
  demo_connected: "Demo connectée",
  verified: "Vérifiée",
  rejected: "Rejetée",
};

const priorityLabels: Record<SourceReviewPriority, string> = {
  low: "Priorité basse",
  medium: "Priorité moyenne",
  high: "Priorité haute",
};

export function SourceReviewStatusBadge({
  status,
  priority,
}: {
  status: SourceReviewStatus;
  priority?: SourceReviewPriority;
}) {
  const className =
    status === "verified" && !priority
      ? "bg-[#e6f2ec] text-brand-strong"
      : "bg-[#fff1d6] text-[#774d08]";

  return (
    <span className={`inline-flex rounded-sm px-2 py-1 text-xs font-semibold ${className}`}>
      {priority ? priorityLabels[priority] : statusLabels[status]}
    </span>
  );
}

export { statusLabels as sourceReviewStatusLabels, priorityLabels as sourceReviewPriorityLabels };
