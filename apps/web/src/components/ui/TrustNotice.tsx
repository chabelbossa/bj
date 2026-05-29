import { siteConfig } from "@/lib/site";

export function TrustNotice({ compact = false }: { compact?: boolean }) {
  return (
    <section
      aria-label="Avertissement non officiel"
      style={{
        background: "var(--surface-card)",
        border: "1px solid var(--hairline)",
        borderRadius: "var(--radius-lg)",
        padding: compact ? "12px 16px" : "16px 20px",
        display: "flex",
        gap: 12,
        alignItems: "flex-start",
      }}
    >
      {/* Icône bouclier */}
      <svg
        width="18"
        height="18"
        viewBox="0 0 20 20"
        fill="none"
        stroke="var(--primary)"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
        style={{ flexShrink: 0, marginTop: 1 }}
      >
        <path d="M10 2L3 5v5c0 4.418 3.134 8.167 7 9 3.866-.833 7-4.582 7-9V5L10 2z" />
        <line x1="10" y1="8" x2="10" y2="11" />
        <circle cx="10" cy="13" r="0.5" fill="var(--primary)" stroke="var(--primary)" />
      </svg>
      <p
        style={{
          fontFamily: "var(--font-sans)",
          fontSize: compact ? 13 : 14,
          lineHeight: 1.6,
          color: "var(--body-strong)",
          margin: 0,
        }}
      >
        <strong style={{ fontWeight: 600, color: "var(--ink)" }}>Indépendant · </strong>
        {siteConfig.disclaimer}
      </p>
    </section>
  );
}
