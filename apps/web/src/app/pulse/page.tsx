import { ModuleCard } from "@/components/ui/ModuleCard";
import { TrustNotice } from "@/components/ui/TrustNotice";
import { getClaimCoverageData, listProcedures, listSourceReviewItems } from "@/lib/data";
import { servicePublicWatchlist } from "@dossierbj/core";

export const metadata = {
  title: "Digital Pulse",
};

export default async function PulsePage() {
  const [procedures, reviewItems, coverage] = await Promise.all([
    listProcedures(),
    listSourceReviewItems(),
    getClaimCoverageData(),
  ]);
  const verifiedSources = reviewItems.filter((item) => item.status === "verified").length;
  const monitoredServices = servicePublicWatchlist.length;
  const metrics = [
    { title: "Démarches suivies", value: String(procedures.length), note: "corpus seedé" },
    { title: "Sources connectées", value: String(verifiedSources), note: "revues datées" },
    { title: "Claims sourcés", value: `${coverage.sourceCoveragePercent}%`, note: "couverture" },
    { title: "Services surveillés", value: String(monitoredServices), note: "snapshot gratuit" },
  ];

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:py-12">
      <div className="max-w-3xl">
        <p className="text-sm font-semibold uppercase tracking-[0.08em] text-brand-strong">
          Digital Pulse
        </p>
        <h1 className="mt-3 text-3xl font-bold sm:text-4xl">Observatoire public léger</h1>
        <p className="mt-4 leading-7 text-muted">
          Digital Pulse agrège déjà les signaux locaux du corpus : démarches suivies, sources
          revues, couverture des claims et services officiels à surveiller sans API payante.
        </p>
      </div>
      <div className="mt-6">
        <TrustNotice compact />
      </div>
      <section className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {metrics.map((metric) => (
          <article key={metric.title} className="rounded-md border border-line bg-surface p-5">
            <p className="text-sm text-muted">{metric.title}</p>
            <p className="mt-2 text-3xl font-bold">{metric.value}</p>
            <p className="mt-1 text-xs uppercase tracking-[0.08em] text-accent">{metric.note}</p>
          </article>
        ))}
      </section>
      <section className="mt-8 grid gap-4 md:grid-cols-2">
        <ModuleCard
          title="Snapshots service-public.bj"
          description="Commande frugale pour comparer frais, délais, statut et pièces des services officiels déjà connectés."
          status="Actif"
        />
        <ModuleCard
          title="Disponibilité des services"
          description="Signal encore manuel : DossierBJ montre quoi revérifier et laisse l'humain décider avant publication."
          status="Sobre"
        />
      </section>
      <section className="mt-8 rounded-md border border-line bg-surface p-5">
        <h2 className="text-xl font-semibold">Services suivis</h2>
        <ul className="mt-4 grid gap-3 md:grid-cols-2">
          {servicePublicWatchlist.map((item) => (
            <li key={item.serviceId} className="rounded-md border border-line bg-background p-4">
              <a
                href={item.url}
                target="_blank"
                rel="noreferrer"
                className="font-semibold text-brand-strong hover:underline"
              >
                {item.title}
              </a>
              <p className="mt-1 text-sm text-muted">
                {item.serviceId} · statut attendu {item.expectedStatus}
              </p>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
