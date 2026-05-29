import type { Confidence } from "@dossierbj/core";

const styles: Record<Confidence, { background: string; color: string; label: string }> = {
  low: {
    background: "color-mix(in srgb, var(--accent-amber) 18%, var(--canvas))",
    color: "color-mix(in srgb, var(--accent-amber) 80%, var(--ink))",
    label: "Confiance faible",
  },
  medium: {
    background: "var(--surface-card)",
    color: "var(--muted)",
    label: "Confiance moyenne",
  },
  high: {
    background: "color-mix(in srgb, var(--success) 15%, var(--canvas))",
    color: "color-mix(in srgb, var(--success) 70%, var(--ink))",
    label: "Confiance élevée",
  },
};

export function ConfidenceBadge({ confidence }: { confidence: Confidence }) {
  const s = styles[confidence];
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
        padding: "4px 12px",
        borderRadius: "var(--radius-pill)",
      }}
    >
      {s.label}
    </span>
  );
}
