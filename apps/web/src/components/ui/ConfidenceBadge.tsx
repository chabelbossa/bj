import type { Confidence } from "@dossierbj/core";

const labels: Record<Confidence, string> = {
  low: "Confiance faible",
  medium: "Confiance moyenne",
  high: "Confiance élevée",
};

export function ConfidenceBadge({ confidence }: { confidence: Confidence }) {
  return (
    <span className="rounded-sm border border-line bg-background px-2 py-1 text-xs font-medium text-muted">
      {labels[confidence]}
    </span>
  );
}
