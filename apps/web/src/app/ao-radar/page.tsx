import { TrustNotice } from "@/components/ui/TrustNotice";
import { listOpportunities } from "@/lib/data";

export const metadata = {
  title: "AO Radar",
};

export default async function AoRadarPage() {
  const opportunities = await listOpportunities();

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:py-12">
      <div className="max-w-3xl">
        <p className="text-sm font-semibold uppercase tracking-[0.08em] text-brand-strong">
          AO Radar
        </p>
        <h1 className="mt-3 text-3xl font-bold sm:text-4xl">Pilote appels d&apos;offres</h1>
        <p className="mt-4 leading-7 text-muted">
          AO Radar transforme la préparation commerciale en checklist sourcée : repérer l&apos;avis,
          vérifier la date limite, lire le dossier officiel et construire une matrice de conformité.
        </p>
      </div>

      <div className="mt-6">
        <TrustNotice compact />
      </div>

      <section className="mt-8 grid gap-4 md:grid-cols-3">
        <article className="rounded-md border border-line bg-surface p-5">
          <p className="text-sm text-muted">Opportunités pilotes</p>
          <p className="mt-2 text-3xl font-bold">{opportunities.length}</p>
        </article>
        <article className="rounded-md border border-line bg-surface p-5">
          <p className="text-sm text-muted">Sources officielles</p>
          <p className="mt-2 text-3xl font-bold">
            {new Set(opportunities.map((item) => item.sourceUrl)).size}
          </p>
        </article>
        <article className="rounded-md border border-line bg-surface p-5">
          <p className="text-sm text-muted">Statut</p>
          <p className="mt-2 text-3xl font-bold">
            {opportunities.filter((item) => item.status === "open").length}
          </p>
          <p className="mt-1 text-xs uppercase tracking-[0.08em] text-accent">ouvert(s)</p>
        </article>
      </section>

      <section className="mt-8 grid gap-4 lg:grid-cols-2">
        {opportunities.map((opportunity) => (
          <article key={opportunity.id} className="rounded-md border border-line bg-surface p-5">
            <div className="flex flex-wrap gap-2">
              <span className="rounded-sm bg-brand-soft px-2 py-1 text-xs font-semibold text-brand-strong">
                {opportunity.status}
              </span>
              <span className="rounded-sm bg-background px-2 py-1 text-xs font-semibold text-muted">
                {opportunity.sector}
              </span>
            </div>
            <h2 className="mt-4 text-xl font-semibold">{opportunity.title}</h2>
            <p className="mt-2 text-sm text-muted">{opportunity.authority}</p>
            <p className="mt-3 text-sm leading-6 text-muted">{opportunity.summary}</p>
            <div className="mt-4 rounded-md border border-line bg-background p-4">
              <p className="text-sm font-semibold">Date limite à revérifier</p>
              <p className="mt-1 text-sm text-muted">{opportunity.deadline}</p>
            </div>
            <div className="mt-4">
              <p className="text-sm font-semibold">Checklist de pré-soumission</p>
              <ul className="mt-2 list-disc space-y-2 pl-5 text-sm leading-6 text-muted">
                {opportunity.eligibility.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>
            <a
              href={opportunity.sourceUrl}
              target="_blank"
              rel="noreferrer"
              className="mt-5 inline-flex min-h-10 items-center rounded-md border border-brand px-3 text-sm font-semibold text-brand-strong hover:bg-brand-soft"
            >
              Ouvrir la source officielle
            </a>
          </article>
        ))}
      </section>
    </div>
  );
}
