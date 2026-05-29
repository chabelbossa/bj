import type { SourceReference } from "@dossierbj/core";

export function SourceBadge({ source }: { source: SourceReference }) {
  return (
    <a
      href={source.url}
      target="_blank"
      rel="noreferrer"
      className="hover-border-primary"
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 4,
        fontFamily: "var(--font-sans)",
        fontSize: 12,
        fontWeight: 500,
        color: "var(--primary)",
        background: "var(--canvas)",
        border: "1px solid var(--hairline)",
        borderRadius: "var(--radius-pill)",
        padding: "4px 10px",
        textDecoration: "none",
        transition: "border-color 0.12s ease",
      }}
    >
      <svg
        width="10"
        height="10"
        viewBox="0 0 12 12"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <path d="M7 2H10V5" />
        <path d="M10 2L5 7" />
        <path d="M9 7V10H2V3H5" />
      </svg>
      {source.title}
    </a>
  );
}
