import { getManualIngestionReadiness, type SourceReviewItem } from "@dossierbj/core";

import { SourceReviewStatusBadge, sourceReviewStatusLabels } from "./SourceReviewStatusBadge";

export function SourceReviewCard({ item }: { item: SourceReviewItem }) {
  const readiness = getManualIngestionReadiness(item);

  return (
    <article className="rounded-md border border-line bg-surface p-5">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.08em] text-brand-strong">
            {item.module}
          </p>
          <h2 className="mt-2 text-xl font-semibold">{item.title}</h2>
          <p className="mt-2 text-sm text-muted">{item.authority}</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <SourceReviewStatusBadge status={item.status} />
          <SourceReviewStatusBadge status={item.status} priority={item.priority} />
        </div>
      </div>
      <dl className="mt-4 grid gap-3 text-sm sm:grid-cols-2">
        <div>
          <dt className="font-medium">Statut</dt>
          <dd className="text-muted">{sourceReviewStatusLabels[item.status]}</dd>
        </div>
        <div>
          <dt className="font-medium">Fiches liées</dt>
          <dd className="text-muted">{item.relatedProcedureSlugs.join(", ")}</dd>
        </div>
      </dl>
      <a
        className="mt-4 inline-flex text-sm font-semibold text-brand-strong hover:underline"
        href={item.candidateUrl}
        target="_blank"
        rel="noreferrer"
      >
        Ouvrir la source candidate
      </a>
      <ul className="mt-4 list-disc space-y-2 pl-5 text-sm leading-6 text-muted">
        {item.notes.map((note) => (
          <li key={note}>{note}</li>
        ))}
      </ul>
      <div className="mt-4 rounded-md border border-line bg-background p-3">
        <p className="text-sm font-semibold">Checklist revue locale</p>
        <ul className="mt-3 space-y-2 text-sm text-muted">
          {readiness.checklist.map((step) => (
            <li key={step.id} className="flex gap-2">
              <span className="font-medium" aria-hidden="true">
                {step.done ? "OK" : "-"}
              </span>
              <span>{step.label}</span>
            </li>
          ))}
        </ul>
        <p className="mt-3 text-xs text-brand-strong">Prochaine action : {readiness.nextAction}</p>
      </div>
    </article>
  );
}
