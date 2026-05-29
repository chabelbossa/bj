import type { Route } from "next";
import Link from "next/link";

import { SourceReviewCard } from "@/components/source/SourceReviewCard";
import { TrustNotice } from "@/components/ui/TrustNotice";
import {
  getClaimCoverageData,
  getSourceReviewSummaryData,
  getSourceValidationData,
  listOfficialSources,
  listSourceDocuments,
  listSourceReviewItems,
} from "@/lib/data";
import { manualIngestionWorkflow } from "@dossierbj/core";

export const metadata = {
  title: "Sources à vérifier",
};

export default async function SourcesPage() {
  const [reviewItems, summary, officialSources, sourceDocuments, validation, coverage] =
    await Promise.all([
      listSourceReviewItems(),
      getSourceReviewSummaryData(),
      listOfficialSources(),
      listSourceDocuments(),
      getSourceValidationData(),
      getClaimCoverageData(),
    ]);

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:py-12">
      <div className="max-w-3xl">
        <p className="text-sm font-semibold uppercase tracking-[0.08em] text-brand-strong">
          Back-office local
        </p>
        <h1 className="mt-3 text-3xl font-bold sm:text-4xl">Sources à vérifier</h1>
        <p className="mt-4 leading-7 text-muted">
          Cette page sert de mini back-office local. Elle distingue les sources connectées, les
          sources en revue et les candidates, sans scraping agressif ni collecte de documents
          personnels.
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
        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <h2 className="text-xl font-semibold">Couverture du corpus</h2>
            <p className="mt-2 text-sm leading-6 text-muted">
              Vue claims : ce qui est sourcé, partiellement vérifié ou encore à confirmer.
            </p>
          </div>
          <span className="w-fit rounded-sm bg-background px-2 py-1 text-xs font-semibold text-muted">
            {coverage.total} claim(s)
          </span>
        </div>
        <div className="mt-5 grid gap-4 sm:grid-cols-4">
          <article className="rounded-md border border-line bg-background p-4">
            <p className="text-sm text-muted">Claims sourcés</p>
            <p className="mt-2 text-2xl font-bold">{coverage.sourceCoveragePercent}%</p>
          </article>
          <article className="rounded-md border border-line bg-background p-4">
            <p className="text-sm text-muted">Vérifiés ou partiels</p>
            <p className="mt-2 text-2xl font-bold">{coverage.verifiedOrPartial}</p>
          </article>
          <article className="rounded-md border border-line bg-background p-4">
            <p className="text-sm text-muted">Critiques à vérifier</p>
            <p className="mt-2 text-2xl font-bold">{coverage.unverifiedCritical}</p>
          </article>
          <article className="rounded-md border border-line bg-background p-4">
            <p className="text-sm text-muted">Non applicables</p>
            <p className="mt-2 text-2xl font-bold">{coverage.statusCounts.not_applicable}</p>
          </article>
        </div>
        <div className="mt-5 grid gap-3 md:grid-cols-2">
          {coverage.byProcedure.map((item) => (
            <article
              key={item.procedureSlug}
              className="rounded-md border border-line bg-background p-4"
            >
              <div className="flex flex-wrap items-center justify-between gap-2">
                <h3 className="font-semibold">{item.procedureSlug}</h3>
                <span className="rounded-sm bg-brand-soft px-2 py-1 text-xs font-semibold text-brand-strong">
                  {item.sourceCoveragePercent}% sourcé
                </span>
              </div>
              <p className="mt-2 text-sm text-muted">
                {item.total} claim(s), {item.unverifiedCritical} critique(s) à vérifier.
              </p>
            </article>
          ))}
        </div>
      </section>

      <section className="mt-8 rounded-md border border-line bg-surface p-5">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <h2 className="text-xl font-semibold">Validation du corpus</h2>
            <p className="mt-2 text-sm leading-6 text-muted">
              Contrôle local : aucune fiche sensible ne doit être affichée sans citations.
            </p>
          </div>
          <span
            className={
              validation.summary.errors > 0
                ? "rounded-sm bg-[#fff1d6] px-2 py-1 text-xs font-semibold text-[#774d08]"
                : "rounded-sm bg-brand-soft px-2 py-1 text-xs font-semibold text-brand-strong"
            }
          >
            {validation.summary.errors} erreur(s), {validation.summary.warnings} alerte(s)
          </span>
        </div>
        {validation.issues.length > 0 ? (
          <ul className="mt-4 space-y-2 text-sm text-muted">
            {validation.issues.map((issue) => (
              <li key={issue.id}>
                <strong>{issue.severity.toUpperCase()}</strong> - {issue.message}
              </li>
            ))}
          </ul>
        ) : (
          <p className="mt-4 text-sm text-muted">
            Aucun problème bloquant détecté dans les sources actuellement connectées.
          </p>
        )}
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
        <div className="mt-4 flex flex-wrap gap-3">
          <Link
            href={"/sources/claims" as Route}
            className="inline-flex min-h-10 items-center rounded-md bg-brand px-3 text-sm font-semibold text-white hover:bg-brand-strong"
          >
            Revoir les claims
          </Link>
          <Link
            href={"/sources/nouvelle" as Route}
            className="inline-flex min-h-10 items-center rounded-md border border-brand px-3 text-sm font-semibold text-brand-strong hover:bg-brand-soft"
          >
            Proposer une source candidate
          </Link>
        </div>
        <ol className="mt-5 grid gap-3 md:grid-cols-2">
          {manualIngestionWorkflow.map((step, index) => (
            <li key={step} className="grid grid-cols-[28px_1fr] gap-3 text-sm text-muted">
              <span className="flex h-7 w-7 items-center justify-center rounded-md bg-brand-soft text-xs font-bold text-brand-strong">
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
