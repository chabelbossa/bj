import type { Metadata, Route } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { createClaimReviewBacklog, getManualIngestionReadiness } from "@dossierbj/core";

import { SourceReviewStatusBadge } from "@/components/source/SourceReviewStatusBadge";
import { TrustNotice } from "@/components/ui/TrustNotice";
import {
  getSourceReviewEventsByItemId,
  getSourceReviewItemById,
  listProcedureClaims,
} from "@/lib/data";

type SourceReviewPageProps = {
  params: Promise<{
    id: string;
  }>;
};

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: SourceReviewPageProps): Promise<Metadata> {
  const { id } = await params;
  const item = await getSourceReviewItemById(id);

  return {
    title: item ? `Revue source - ${item.title}` : "Revue source introuvable",
  };
}

export default async function SourceReviewDetailPage({ params }: SourceReviewPageProps) {
  const { id } = await params;
  const [item, events, claims] = await Promise.all([
    getSourceReviewItemById(id),
    getSourceReviewEventsByItemId(id),
    listProcedureClaims(),
  ]);

  if (!item) {
    notFound();
  }

  const readiness = getManualIngestionReadiness(item);
  const relatedClaims = createClaimReviewBacklog(
    claims.filter((claim) => item.relatedProcedureSlugs.includes(claim.procedureSlug)),
  );
  const urgentRelatedClaims = relatedClaims.filter(
    (claim) => claim.priority === "critical" || claim.priority === "high",
  );

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:py-12">
      <Link
        href={"/sources" as Route}
        className="text-sm font-semibold text-brand-strong hover:underline"
      >
        Retour aux sources
      </Link>

      <div className="mt-6 grid gap-6 lg:grid-cols-[minmax(0,1fr)_320px]">
        <article>
          <div className="flex flex-wrap gap-2">
            <SourceReviewStatusBadge status={item.status} />
            <SourceReviewStatusBadge status={item.status} priority={item.priority} />
          </div>
          <h1 className="mt-4 text-3xl font-bold sm:text-4xl">{item.title}</h1>
          <p className="mt-3 leading-7 text-muted">{item.authority}</p>

          <div className="mt-6">
            <TrustNotice compact />
          </div>

          <section className="mt-8 rounded-md border border-line bg-surface p-5">
            <h2 className="text-xl font-semibold">Informations de revue</h2>
            <dl className="mt-4 grid gap-4 sm:grid-cols-2">
              <div>
                <dt className="text-sm font-medium">Module</dt>
                <dd className="mt-1 text-sm text-muted">{item.module}</dd>
              </div>
              <div>
                <dt className="text-sm font-medium">Pays</dt>
                <dd className="mt-1 text-sm text-muted">{item.country}</dd>
              </div>
              <div>
                <dt className="text-sm font-medium">Dernière revue</dt>
                <dd className="mt-1 text-sm text-muted">{item.lastReviewedAt ?? "Non revue"}</dd>
              </div>
              <div>
                <dt className="text-sm font-medium">Démarches liées</dt>
                <dd className="mt-1 flex flex-wrap gap-2 text-sm text-muted">
                  {item.relatedProcedureSlugs.map((slug) => (
                    <Link
                      key={slug}
                      href={`/demarches/${slug}` as Route}
                      className="font-semibold text-brand-strong hover:underline"
                    >
                      {slug}
                    </Link>
                  ))}
                </dd>
              </div>
            </dl>
            <a
              href={item.candidateUrl}
              target="_blank"
              rel="noreferrer"
              className="mt-5 inline-flex min-h-11 items-center justify-center rounded-md border border-brand px-4 text-sm font-semibold text-brand-strong hover:bg-brand-soft"
            >
              Ouvrir la source candidate
            </a>
          </section>

          <section className="mt-8 rounded-md border border-line bg-surface p-5">
            <h2 className="text-xl font-semibold">Notes de revue</h2>
            <ul className="mt-4 list-disc space-y-2 pl-5 text-sm leading-6 text-muted">
              {item.notes.map((note) => (
                <li key={note}>{note}</li>
              ))}
            </ul>
          </section>

          <section className="mt-8 rounded-md border border-line bg-surface p-5">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
              <div>
                <h2 className="text-xl font-semibold">Claims liés à cette revue</h2>
                <p className="mt-2 text-sm leading-6 text-muted">
                  Les claims ci-dessous proviennent des démarches liées à cette source. Ils aident à
                  savoir quoi relire avant de changer un statut de vérification.
                </p>
              </div>
              <Link
                href={"/sources/claims" as Route}
                className="inline-flex min-h-10 w-fit items-center rounded-md border border-brand px-3 text-sm font-semibold text-brand-strong hover:bg-brand-soft"
              >
                Ouvrir la file claims
              </Link>
            </div>

            <div className="mt-5 grid gap-3 sm:grid-cols-3">
              <article className="rounded-md border border-line bg-background p-4">
                <p className="text-sm text-muted">Claims liés</p>
                <p className="mt-2 text-2xl font-bold">{relatedClaims.length}</p>
              </article>
              <article className="rounded-md border border-line bg-background p-4">
                <p className="text-sm text-muted">Priorité critique/haute</p>
                <p className="mt-2 text-2xl font-bold">{urgentRelatedClaims.length}</p>
              </article>
              <article className="rounded-md border border-line bg-background p-4">
                <p className="text-sm text-muted">Sans citation</p>
                <p className="mt-2 text-2xl font-bold">
                  {relatedClaims.filter((claim) => claim.needsCitation).length}
                </p>
              </article>
            </div>

            {relatedClaims.length > 0 ? (
              <ol className="mt-5 space-y-3">
                {relatedClaims.slice(0, 6).map((claim) => (
                  <li
                    key={claim.claim.id}
                    className="rounded-md border border-line bg-background p-4"
                  >
                    <div className="flex flex-wrap gap-2">
                      <span className="rounded-sm bg-[#fff1d6] px-2 py-1 text-xs font-semibold text-[#774d08]">
                        {claim.priority}
                      </span>
                      <span className="rounded-sm bg-surface px-2 py-1 text-xs font-semibold text-muted">
                        {claim.claim.status}
                      </span>
                      <span className="rounded-sm bg-surface px-2 py-1 text-xs font-semibold text-muted">
                        {claim.claim.type}
                      </span>
                    </div>
                    <h3 className="mt-3 text-sm font-semibold">{claim.claim.label}</h3>
                    <p className="mt-2 text-sm leading-6 text-muted">{claim.nextAction}</p>
                  </li>
                ))}
              </ol>
            ) : (
              <p className="mt-5 text-sm text-muted">
                Aucun claim lié n&apos;est encore disponible pour cette source.
              </p>
            )}
          </section>

          <section className="mt-8 rounded-md border border-line bg-surface p-5">
            <h2 className="text-xl font-semibold">Historique</h2>
            {events.length > 0 ? (
              <ol className="mt-4 space-y-4">
                {events.map((event) => (
                  <li key={event.id} className="rounded-md border border-line bg-background p-4">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <span className="text-sm font-semibold">{event.status}</span>
                      <span className="text-xs text-muted">{event.reviewedAt}</span>
                    </div>
                    <p className="mt-2 text-sm leading-6 text-muted">{event.note}</p>
                    <p className="mt-2 text-xs text-muted">Acteur : {event.actor}</p>
                  </li>
                ))}
              </ol>
            ) : (
              <p className="mt-4 text-sm text-muted">
                Aucun événement de revue n&apos;est encore enregistré.
              </p>
            )}
          </section>
        </article>

        <aside className="space-y-5">
          <section className="rounded-md border border-line bg-surface p-5">
            <h2 className="text-lg font-semibold">Prêt pour vérification ?</h2>
            <p className="mt-2 text-sm leading-6 text-muted">{readiness.nextAction}</p>
            <ul className="mt-4 space-y-3">
              {readiness.checklist.map((step) => (
                <li key={step.id} className="flex gap-3 text-sm">
                  <span
                    className={
                      step.done ? "font-semibold text-brand-strong" : "font-semibold text-[#774d08]"
                    }
                  >
                    {step.done ? "OK" : "À faire"}
                  </span>
                  <span className="text-muted">{step.label}</span>
                </li>
              ))}
            </ul>
          </section>

          <section className="rounded-md border border-line bg-surface p-5">
            <h2 className="text-lg font-semibold">Gestion locale</h2>
            <p className="mt-2 text-sm leading-6 text-muted">
              Les sources candidates restent fichier-based dans{" "}
              <code className="rounded-sm bg-background px-1 py-0.5">
                packages/core/src/seed/sourceRegistry.ts
              </code>
              . Après modification, lancer validation, tests et seed Postgres si le mode DB est
              utilisé.
            </p>
          </section>
        </aside>
      </div>
    </div>
  );
}
