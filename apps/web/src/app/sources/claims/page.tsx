import type { Route } from "next";
import Link from "next/link";
import { createClaimReviewBacklog, summarizeClaimReviewBacklog } from "@dossierbj/core";

import { ClaimReviewWorkspace } from "@/components/source/ClaimReviewWorkspace";
import { TrustNotice } from "@/components/ui/TrustNotice";
import { getClaimCoverageData, listProcedureClaims, listProcedures } from "@/lib/data";

export const metadata = {
  title: "Claims à revoir",
};

export default async function SourceClaimsPage() {
  const [claims, procedures, coverage] = await Promise.all([
    listProcedureClaims(),
    listProcedures(),
    getClaimCoverageData(),
  ]);
  const backlog = createClaimReviewBacklog(claims);
  const reviewSummary = summarizeClaimReviewBacklog(backlog);
  const procedureOptions = procedures.map((procedure) => ({
    slug: procedure.slug,
    title: procedure.title,
  }));

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:py-12">
      <Link
        href={"/sources" as Route}
        className="text-sm font-semibold text-brand-strong hover:underline"
      >
        Retour aux sources
      </Link>

      <div className="mt-6 max-w-3xl">
        <p className="text-sm font-semibold uppercase tracking-[0.08em] text-brand-strong">
          Revue éditoriale
        </p>
        <h1 className="mt-3 text-3xl font-bold sm:text-4xl">Claims à revoir</h1>
        <p className="mt-4 leading-7 text-muted">
          Cette vue transforme les affirmations du corpus en file de travail. Elle aide à repérer
          les frais, délais, pièces et étapes qui doivent être sourcés ou relus avant exposition
          plus forte.
        </p>
      </div>

      <div className="mt-6">
        <TrustNotice compact />
      </div>

      <section className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
        <article className="rounded-md border border-line bg-surface p-4">
          <p className="text-sm text-muted">Claims</p>
          <p className="mt-2 text-2xl font-bold">{reviewSummary.total}</p>
        </article>
        <article className="rounded-md border border-line bg-surface p-4">
          <p className="text-sm text-muted">Critiques</p>
          <p className="mt-2 text-2xl font-bold">{reviewSummary.critical}</p>
        </article>
        <article className="rounded-md border border-line bg-surface p-4">
          <p className="text-sm text-muted">Sans citation</p>
          <p className="mt-2 text-2xl font-bold">{reviewSummary.needsCitation}</p>
        </article>
        <article className="rounded-md border border-line bg-surface p-4">
          <p className="text-sm text-muted">Revue humaine</p>
          <p className="mt-2 text-2xl font-bold">{reviewSummary.needsHumanReview}</p>
        </article>
        <article className="rounded-md border border-line bg-surface p-4">
          <p className="text-sm text-muted">Corpus sourcé</p>
          <p className="mt-2 text-2xl font-bold">{coverage.sourceCoveragePercent}%</p>
        </article>
      </section>

      <section className="mt-8 rounded-md border border-line bg-surface p-5">
        <h2 className="text-xl font-semibold">Limite volontaire</h2>
        <p className="mt-3 text-sm leading-6 text-muted">
          Cette page ne modifie pas encore Postgres ni les seeds. Les notes sont locales au
          navigateur. Pour publier un changement, il faut éditer le registre source ou les fiches,
          rattacher les `SourceReference`, puis relancer validation et tests.
        </p>
      </section>

      <div className="mt-8">
        <ClaimReviewWorkspace items={backlog} procedures={procedureOptions} />
      </div>
    </div>
  );
}
