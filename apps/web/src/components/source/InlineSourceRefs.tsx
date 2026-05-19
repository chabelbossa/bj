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
      <p className="mt-2 text-xs text-danger">
        Aucune source liée : information à vérifier avant usage.
      </p>
    );
  }

  return (
    <div className="mt-3">
      <p className="text-xs font-semibold uppercase tracking-[0.08em] text-muted">{label}</p>
      <div className="mt-2 flex flex-wrap gap-2">
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
