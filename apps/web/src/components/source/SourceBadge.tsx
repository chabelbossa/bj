import type { SourceReference } from "@dossierbj/core";

export function SourceBadge({ source }: { source: SourceReference }) {
  return (
    <a
      className="inline-flex rounded-sm border border-line bg-surface px-2 py-1 text-xs font-medium text-brand-strong hover:border-brand"
      href={source.url}
      target="_blank"
      rel="noreferrer"
    >
      {source.title}
    </a>
  );
}
