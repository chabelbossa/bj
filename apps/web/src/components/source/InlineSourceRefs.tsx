import type { SourceReference } from "@dossierbj/core";

import { SourceBadge } from "./SourceBadge";

export function InlineSourceRefs({
  sources,
  label = "Sources",
}: {
  sources: SourceReference[];
  label?: string;
}) {
  if (sources.length === 0) {
    return (
      <p
        style={{
          fontFamily: "var(--font-sans)",
          fontSize: 12,
          color: "var(--error)",
          margin: "8px 0 0",
        }}
      >
        Aucune source liée : information à vérifier avant usage.
      </p>
    );
  }

  return (
    <div style={{ marginTop: 10 }}>
      <p
        style={{
          fontFamily: "var(--font-sans)",
          fontSize: 11,
          fontWeight: 500,
          letterSpacing: "1.2px",
          textTransform: "uppercase",
          color: "var(--muted-soft)",
          margin: "0 0 6px",
        }}
      >
        {label}
      </p>
      <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
        {sources.map((source) => (
          <SourceBadge
            key={`${source.sourceId}-${source.documentId ?? source.url}`}
            source={source}
          />
        ))}
      </div>
    </div>
  );
}
