import type { SourceReference } from "@dossierbj/core";

export function CitationList({ citations }: { citations: SourceReference[] }) {
  if (citations.length === 0) {
    return (
      <p className="text-sm text-muted">
        Aucune citation disponible. L&apos;information doit être vérifiée sur une source officielle.
      </p>
    );
  }

  return (
    <ol className="space-y-3">
      {citations.map((citation, index) => (
        <li
          key={`${citation.sourceId}-${citation.documentId ?? citation.url}-${index}`}
          className="rounded-md border border-line bg-surface p-4"
        >
          <a
            className="font-medium text-brand-strong hover:underline"
            href={citation.url}
            target="_blank"
            rel="noreferrer"
          >
            {citation.title}
          </a>
          {citation.excerpt ? (
            <p className="mt-2 text-sm leading-6 text-muted">{citation.excerpt}</p>
          ) : null}
          <p className="mt-2 text-xs text-muted">Consulté : {citation.retrievedAt}</p>
        </li>
      ))}
    </ol>
  );
}
