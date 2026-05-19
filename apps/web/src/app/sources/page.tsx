import { SourceReviewCard } from "@/components/source/SourceReviewCard";
import { TrustNotice } from "@/components/ui/TrustNotice";
import {
  getOfficialSources,
  getSourceDocuments,
  getSourceReviewItems,
  getSourceReviewSummary,
  manualIngestionWorkflow,
} from "@dossierbj/core";

export const metadata = {
  title: "Sources à vérifier",
};

export default function SourcesPage() {
  const reviewItems = getSourceReviewItems();
  const summary = getSourceReviewSummary();
  const officialSources = getOfficialSources();
  const sourceDocuments = getSourceDocuments();

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:py-12">
      <div className="max-w-3xl">
        <p className="text-sm font-semibold uppercase tracking-[0.08em] text-brand-strong">
          Back-office local
        </p>
        <h1 className="mt-3 text-3xl font-bold sm:text-4xl">Sources à vérifier</h1>
        <p className="mt-4 leading-7 text-muted">
          Cette page sert de mini back-office fichier-based. Elle liste les sources demo à connecter
          plus tard, sans scraping agressif et sans les présenter comme officielles.
        </p>
      </div>

      <div className="mt-6">
        <TrustNotice compact />
      </div>

      <section className="mt-8 grid gap-4 sm:grid-cols-3">
        <article className="rounded-md border border-line bg-surface p-5">
          <p className="text-sm text-muted">Sources candidates</p>
          <p className="mt-2 text-3xl font-bold">{summary.total}</p>
        </article>
        <article className="rounded-md border border-line bg-surface p-5">
          <p className="text-sm text-muted">Connectées manuellement</p>
          <p className="mt-2 text-3xl font-bold">{summary.verified}</p>
        </article>
        <article className="rounded-md border border-line bg-surface p-5">
          <p className="text-sm text-muted">Revue humaine requise</p>
          <p className="mt-2 text-3xl font-bold">{summary.needsHumanReview}</p>
        </article>
      </section>

      <section className="mt-8 rounded-md border border-line bg-surface p-5">
        <h2 className="text-xl font-semibold">Gestion locale</h2>
        <p className="mt-3 text-sm leading-6 text-muted">
          Pour ajouter ou modifier une source candidate, éditez
          <code className="mx-1 rounded-sm bg-background px-1 py-0.5">
            packages/core/src/seed/sourceRegistry.ts
          </code>
          puis lancez <code className="rounded-sm bg-background px-1 py-0.5">pnpm test</code>. Une
          source ne doit devenir vérifiée qu&apos;après revue humaine et rattachement explicite aux
          citations.
        </p>
        <ol className="mt-5 grid gap-3 md:grid-cols-2">
          {manualIngestionWorkflow.map((step, index) => (
            <li key={step} className="grid grid-cols-[28px_1fr] gap-3 text-sm text-muted">
              <span className="flex h-7 w-7 items-center justify-center rounded-md bg-[#e6f2ec] text-xs font-bold text-brand-strong">
                {index + 1}
              </span>
              <span>{step}</span>
            </li>
          ))}
        </ol>
      </section>

      <section className="mt-8">
        <h2 className="mb-4 text-xl font-semibold">File de revue</h2>
        <div className="grid gap-4 lg:grid-cols-2">
          {reviewItems.map((item) => (
            <SourceReviewCard key={item.id} item={item} />
          ))}
        </div>
      </section>

      <section className="mt-8 grid gap-4 lg:grid-cols-2">
        <div className="rounded-md border border-line bg-surface p-5">
          <h2 className="text-xl font-semibold">Sources actuellement exposées</h2>
          <ul className="mt-4 space-y-3 text-sm text-muted">
            {officialSources.map((source) => (
              <li key={source.id}>
                {source.name} - {source.sourceType} - {source.status} - {source.url}
              </li>
            ))}
          </ul>
        </div>
        <div className="rounded-md border border-line bg-surface p-5">
          <h2 className="text-xl font-semibold">Documents demo</h2>
          <ul className="mt-4 space-y-3 text-sm text-muted">
            {sourceDocuments.map((document) => (
              <li key={document.id}>
                {document.title} - version {document.version}
              </li>
            ))}
          </ul>
        </div>
      </section>
    </div>
  );
}
