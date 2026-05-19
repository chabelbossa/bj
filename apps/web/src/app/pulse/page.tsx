import { ModuleCard } from "@/components/ui/ModuleCard";
import { TrustNotice } from "@/components/ui/TrustNotice";

export const metadata = {
  title: "Digital Pulse",
};

const metrics = [
  { title: "Démarches suivies", value: "5", note: "demo" },
  { title: "Sources connectées", value: "1", note: "à vérifier" },
  { title: "Alertes récentes", value: "0", note: "module futur" },
];

export default function PulsePage() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:py-12">
      <div className="max-w-3xl">
        <p className="text-sm font-semibold uppercase tracking-[0.08em] text-brand-strong">
          Digital Pulse
        </p>
        <h1 className="mt-3 text-3xl font-bold sm:text-4xl">Observatoire public léger</h1>
        <p className="mt-4 leading-7 text-muted">
          Digital Pulse suivra plus tard les changements, tendances numériques et signaux de
          disponibilité des démarches. Pour l&apos;instant, cette page affiche des métriques
          mockées.
        </p>
      </div>
      <div className="mt-6">
        <TrustNotice compact />
      </div>
      <section className="mt-8 grid gap-4 sm:grid-cols-3">
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
          title="Changements récents"
          description="Future capacité : repérer les mises à jour de sources officielles et demander une vérification humaine."
          status="À venir"
        />
        <ModuleCard
          title="Disponibilité des services"
          description="Future capacité : suivre les parcours numériques publics avec des critères transparents."
          status="À venir"
        />
      </section>
    </div>
  );
}
