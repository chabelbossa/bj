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

const statusStyles: Record<SourceReviewStatus, { background: string; color: string }> = {
  verified: {
    background: "color-mix(in srgb, var(--success) 15%, var(--canvas))",
    color: "color-mix(in srgb, var(--success) 70%, var(--ink))",
  },
  demo_connected: {
    background: "color-mix(in srgb, var(--accent-amber) 18%, var(--canvas))",
    color: "color-mix(in srgb, var(--accent-amber) 80%, var(--ink))",
  },
  needs_human_review: {
    background: "color-mix(in srgb, var(--accent-amber) 18%, var(--canvas))",
    color: "color-mix(in srgb, var(--accent-amber) 80%, var(--ink))",
  },
  to_connect: {
    background: "var(--surface-card)",
    color: "var(--muted)",
  },
  rejected: {
    background: "color-mix(in srgb, var(--error) 10%, var(--canvas))",
    color: "var(--error)",
  },
};

export function SourceReviewStatusBadge({
  status,
  priority,
}: {
  status: SourceReviewStatus;
  priority?: SourceReviewPriority;
}) {
  const s = statusStyles[status];
  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        background: s.background,
        color: s.color,
        fontFamily: "var(--font-sans)",
        fontSize: 12,
        fontWeight: 500,
        padding: "4px 10px",
        borderRadius: "var(--radius-pill)",
      }}
    >
      {priority ? priorityLabels[priority] : statusLabels[status]}
    </span>
  );
}

export { statusLabels as sourceReviewStatusLabels, priorityLabels as sourceReviewPriorityLabels };
