import type { SourceReference } from "@dossierbj/core";

export function CitationList({ citations }: { citations: SourceReference[] }) {
  if (citations.length === 0) {
    return (
      <p
        style={{
          fontFamily: "var(--font-sans)",
          fontSize: 14,
          color: "var(--muted)",
          lineHeight: 1.6,
        }}
      >
        Aucune citation disponible. L&apos;information doit être vérifiée sur une source officielle.
      </p>
    );
  }

  return (
    <ol
      style={{
        listStyle: "none",
        padding: 0,
        margin: 0,
        display: "flex",
        flexDirection: "column",
        gap: 12,
      }}
    >
      {citations.map((citation, index) => (
        <li
          key={`${citation.sourceId}-${citation.documentId ?? citation.url}-${index}`}
          style={{
            background: "var(--surface-soft)",
            border: "1px solid var(--hairline)",
            borderRadius: "var(--radius-lg)",
            padding: "var(--space-md)",
            display: "flex",
            flexDirection: "column",
            gap: 6,
          }}
        >
          <div style={{ display: "flex", alignItems: "flex-start", gap: 8 }}>
            <span
              style={{
                fontFamily: "var(--font-sans)",
                fontSize: 12,
                fontWeight: 600,
                color: "var(--primary)",
                background: "color-mix(in srgb, var(--primary) 10%, var(--canvas))",
                borderRadius: "var(--radius-pill)",
                padding: "2px 8px",
                flexShrink: 0,
                lineHeight: 1.6,
              }}
            >
              {index + 1}
            </span>
            <a
              href={citation.url}
              target="_blank"
              rel="noreferrer"
              className="hover-underline"
              style={{
                fontFamily: "var(--font-sans)",
                fontSize: 14,
                fontWeight: 500,
                color: "var(--primary)",
                textDecoration: "none",
                lineHeight: 1.5,
              }}
            >
              {citation.title}
            </a>
          </div>
          {citation.excerpt ? (
            <p
              style={{
                fontFamily: "var(--font-sans)",
                fontSize: 13,
                lineHeight: 1.6,
                color: "var(--muted)",
                margin: 0,
                paddingLeft: 28,
              }}
            >
              {citation.excerpt}
            </p>
          ) : null}
          <p
            style={{
              fontFamily: "var(--font-sans)",
              fontSize: 11,
              color: "var(--muted-soft)",
              margin: 0,
              paddingLeft: 28,
            }}
          >
            Consulté : {citation.retrievedAt}
          </p>
        </li>
      ))}
    </ol>
  );
}
