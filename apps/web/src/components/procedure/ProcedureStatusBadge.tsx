import type { VerificationStatus } from "@dossierbj/core";
import { formatVerificationStatus } from "@dossierbj/core";

const styles: Record<VerificationStatus, { background: string; color: string }> = {
  verified: {
    background: "color-mix(in srgb, var(--success) 15%, var(--canvas))",
    color: "color-mix(in srgb, var(--success) 70%, var(--ink))",
  },
  partially_verified: {
    background: "color-mix(in srgb, var(--accent-amber) 18%, var(--canvas))",
    color: "color-mix(in srgb, var(--accent-amber) 80%, var(--ink))",
  },
  pending_verification: {
    background: "var(--surface-card)",
    color: "var(--muted)",
  },
  demo_unverified: {
    background: "var(--primary)",
    color: "var(--on-primary)",
  },
};

export function ProcedureStatusBadge({ status }: { status: VerificationStatus }) {
  const s = styles[status];
  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        background: s.background,
        color: s.color,
        fontFamily: "var(--font-sans)",
        fontSize: status === "demo_unverified" ? 10.5 : 12,
        fontWeight: 600,
        letterSpacing: status === "demo_unverified" ? "1px" : 0,
        textTransform: status === "demo_unverified" ? "uppercase" : "none",
        padding: status === "demo_unverified" ? "6px 12px" : "4px 12px",
        borderRadius: status === "demo_unverified" ? "var(--radius-sm)" : "var(--radius-pill)",
        lineHeight: 1.3,
        textAlign: "center",
      }}
    >
      {formatVerificationStatus(status)}
    </span>
  );
}
