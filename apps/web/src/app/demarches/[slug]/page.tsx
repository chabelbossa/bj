import type { Metadata } from "next";
import type { Route } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { ChecklistBuilder } from "@/components/checklist/ChecklistBuilder";
import { ProcedureClaimList } from "@/components/procedure/ProcedureClaimList";
import { ProcedureFactList } from "@/components/procedure/ProcedureFactList";
import { ProcedureStatusBadge } from "@/components/procedure/ProcedureStatusBadge";
import { CitationList } from "@/components/source/CitationList";
import { InlineSourceRefs } from "@/components/source/InlineSourceRefs";
import { SourceBadge } from "@/components/source/SourceBadge";
import { TrustNotice } from "@/components/ui/TrustNotice";
import { getProcedureBySlug, getProcedureClaimsBySlug } from "@/lib/data";

type ProcedurePageProps = {
  params: Promise<{
    slug: string;
  }>;
};

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: ProcedurePageProps): Promise<Metadata> {
  const { slug } = await params;
  const procedure = await getProcedureBySlug(slug);

  return {
    title: procedure ? procedure.title : "Démarche introuvable",
  };
}

export default async function ProcedureDetailPage({ params }: ProcedurePageProps) {
  const { slug } = await params;
  const [procedure, claims] = await Promise.all([
    getProcedureBySlug(slug),
    getProcedureClaimsBySlug(slug),
  ]);

  if (!procedure) {
    notFound();
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:py-12">
      <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_340px]">
        <article>
          <ProcedureStatusBadge status={procedure.verificationStatus} />
          <h1 className="mt-4 text-3xl font-bold sm:text-4xl">{procedure.title}</h1>
          <p className="mt-4 leading-7 text-muted">{procedure.summary}</p>

          <div className="mt-6">
            <TrustNotice compact />
          </div>

          <section className="mt-8 rounded-md border border-line bg-surface p-5">
            <h2 className="text-xl font-semibold">Informations clés</h2>
            <dl className="mt-4 grid gap-4 sm:grid-cols-2">
              <div>
                <dt className="text-sm font-medium">Besoin utilisateur</dt>
                <dd className="mt-1 text-sm text-muted">{procedure.userNeed}</dd>
              </div>
              <div>
                <dt className="text-sm font-medium">Résultat attendu</dt>
                <dd className="mt-1 text-sm text-muted">{procedure.expectedOutcome}</dd>
              </div>
              <div>
                <dt className="text-sm font-medium">Frais</dt>
                <dd className="mt-1 text-sm text-muted">{procedure.officialCost}</dd>
              </div>
              <div>
                <dt className="text-sm font-medium">Délais</dt>
                <dd className="mt-1 text-sm text-muted">{procedure.estimatedDuration}</dd>
              </div>
              <div>
                <dt className="text-sm font-medium">Dernière vérification</dt>
                <dd className="mt-1 text-sm text-muted">{procedure.lastVerifiedAt}</dd>
              </div>
              <div>
                <dt className="text-sm font-medium">Source principale</dt>
                <dd className="mt-1">
                  {procedure.sources.map((source) => (
                    <SourceBadge key={`${source.sourceId}-${source.url}`} source={source} />
                  ))}
                </dd>
              </div>
              <div>
                <dt className="text-sm font-medium">État source</dt>
                <dd className="mt-1 text-sm text-muted">{procedure.sourceStatusNote}</dd>
              </div>
            </dl>
            {procedure.officialUrl ? (
              <a
                href={procedure.officialUrl}
                target="_blank"
                rel="noreferrer"
                className="mt-5 inline-flex min-h-11 items-center justify-center rounded-md border border-brand px-4 text-sm font-semibold text-brand-strong hover:bg-[#e6f2ec]"
              >
                Ouvrir la plateforme officielle
              </a>
            ) : null}
          </section>

          <ProcedureFactList facts={procedure.verifiedFacts} />
          <ProcedureClaimList claims={claims} />

          <section className="mt-8 rounded-md border border-line bg-surface p-5">
            <h2 className="text-xl font-semibold">Préparation prudente</h2>
            <ul className="mt-4 list-disc space-y-2 pl-5 text-sm leading-6 text-muted">
              {procedure.preparationHints.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </section>

          <section className="mt-8 rounded-md border border-line bg-surface p-5">
            <h2 className="text-xl font-semibold">Ce qui reste à vérifier</h2>
            <p className="mt-2 text-sm leading-6 text-muted">
              Ces points doivent être confirmés directement sur la plateforme officielle avant toute
              décision ou paiement.
            </p>
            <ul className="mt-4 list-disc space-y-2 pl-5 text-sm leading-6 text-muted">
              {procedure.pointsToVerify.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </section>

          <section className="mt-8 rounded-md border border-line bg-surface p-5">
            <h2 className="text-xl font-semibold">Pièces à fournir</h2>
            <ul className="mt-4 space-y-4">
              {procedure.requiredDocuments.map((document) => (
                <li
                  key={document.id}
                  className="border-b border-line pb-4 last:border-b-0 last:pb-0"
                >
                  <h3 className="font-semibold">{document.name}</h3>
                  <p className="mt-1 text-sm leading-6 text-muted">{document.description}</p>
                  {document.condition ? (
                    <p className="mt-2 text-xs text-danger">{document.condition}</p>
                  ) : null}
                  <InlineSourceRefs sources={document.sourceRefs} label="Sources de cette pièce" />
                </li>
              ))}
            </ul>
          </section>

          <section className="mt-8 rounded-md border border-line bg-surface p-5">
            <h2 className="text-xl font-semibold">Étapes</h2>
            <ol className="mt-4 space-y-4">
              {procedure.steps.map((step) => (
                <li key={step.id} className="grid grid-cols-[32px_1fr] gap-3">
                  <span className="flex h-8 w-8 items-center justify-center rounded-md bg-[#e6f2ec] text-sm font-bold text-brand-strong">
                    {step.order}
                  </span>
                  <div>
                    <span className="block font-semibold">{step.title}</span>
                    <span className="mt-1 block text-sm leading-6 text-muted">
                      {step.description}
                    </span>
                    <InlineSourceRefs sources={step.sourceRefs} label="Sources de cette étape" />
                  </div>
                </li>
              ))}
            </ol>
          </section>

          <section className="mt-8">
            <h2 className="mb-4 text-xl font-semibold">Sources et citations</h2>
            <CitationList citations={procedure.sources} />
          </section>
        </article>

        <aside className="space-y-5">
          <ChecklistBuilder procedure={procedure} />
          <Link
            href={`/assistant?q=${encodeURIComponent(procedure.title)}`}
            className="inline-flex min-h-11 w-full items-center justify-center rounded-md bg-brand px-4 font-semibold text-white hover:bg-brand-strong"
          >
            Poser une question à l&apos;assistant
          </Link>
          <Link
            href={"/sources" as Route}
            className="inline-flex min-h-11 w-full items-center justify-center rounded-md border border-brand px-4 font-semibold text-brand-strong hover:bg-[#e6f2ec]"
          >
            Voir les sources à vérifier
          </Link>
          <section className="rounded-md border border-line bg-surface p-5">
            <h2 className="text-lg font-semibold">Avertissements</h2>
            <ul className="mt-3 list-disc space-y-2 pl-5 text-sm text-muted">
              {procedure.warnings.map((warning) => (
                <li key={warning}>{warning}</li>
              ))}
            </ul>
          </section>
        </aside>
      </div>
    </div>
  );
}
