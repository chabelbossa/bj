const statusStyles: Record<string, { background: string; color: string }> = {
  MVP: { background: "var(--primary)", color: "var(--on-primary)" },
  "Prévu léger": { background: "var(--surface-cream-strong)", color: "var(--muted)" },
  "Plus tard": { background: "var(--surface-card)", color: "var(--muted-soft)" },
};

export function ModuleCard({
  title,
  description,
  status,
}: {
  title: string;
  description: string;
  status: string;
}) {
  const style = statusStyles[status] ?? { background: "var(--surface-card)", color: "var(--muted)" };

  return (
    <article
      style={{
        background: "var(--surface-card)",
        borderRadius: "var(--radius-lg)",
        padding: "var(--space-xl)",
        display: "flex",
        flexDirection: "column",
        gap: 12,
      }}
    >
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 12 }}>
        <h3
          style={{
            fontFamily: "var(--font-sans)",
            fontSize: 18,
            fontWeight: 500,
            lineHeight: 1.4,
            color: "var(--ink)",
            margin: 0,
          }}
        >
          {title}
        </h3>
        <span
          style={{
            fontFamily: "var(--font-sans)",
            fontSize: 12,
            fontWeight: 500,
            letterSpacing: "1.2px",
            textTransform: "uppercase",
            padding: "4px 12px",
            borderRadius: "var(--radius-pill)",
            background: style.background,
            color: style.color,
            flexShrink: 0,
          }}
        >
          {status}
        </span>
      </div>
      <p
        style={{
          fontFamily: "var(--font-sans)",
          fontSize: 14,
          lineHeight: 1.6,
          color: "var(--muted)",
          margin: 0,
        }}
      >
        {description}
      </p>
    </article>
  );
}
