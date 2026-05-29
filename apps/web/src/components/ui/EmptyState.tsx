export function EmptyState({ title, description }: { title: string; description: string }) {
  return (
    <div
      style={{
        background: "var(--surface-soft)",
        border: "1px dashed var(--hairline)",
        borderRadius: "var(--radius-lg)",
        padding: "var(--space-xxl)",
        textAlign: "center",
      }}
    >
      <svg
        width="40"
        height="40"
        viewBox="0 0 40 40"
        fill="none"
        stroke="var(--hairline)"
        strokeWidth="1.5"
        strokeLinecap="round"
        aria-hidden="true"
        style={{ margin: "0 auto 16px" }}
      >
        <rect x="6" y="8" width="28" height="24" rx="3" />
        <line x1="13" y1="16" x2="27" y2="16" />
        <line x1="13" y1="20" x2="22" y2="20" />
        <line x1="13" y1="24" x2="19" y2="24" />
      </svg>
      <h2
        style={{
          fontFamily: "var(--font-serif)",
          fontSize: 22,
          fontWeight: 400,
          lineHeight: 1.3,
          letterSpacing: "-0.3px",
          color: "var(--ink)",
          margin: "0 0 8px",
        }}
      >
        {title}
      </h2>
      <p
        style={{
          fontFamily: "var(--font-sans)",
          fontSize: 14,
          lineHeight: 1.6,
          color: "var(--muted)",
          margin: 0,
          maxWidth: 400,
          marginInline: "auto",
        }}
      >
        {description}
      </p>
    </div>
  );
}
