import { SourceCandidateForm } from "@/components/source/SourceCandidateForm";
import { TrustNotice } from "@/components/ui/TrustNotice";

export const metadata = {
  title: "Proposer une source candidate",
};

export default function NewSourceCandidatePage() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:py-12">
      <div className="max-w-3xl">
        <p className="text-sm font-semibold uppercase tracking-[0.08em] text-brand-strong">
          Ingestion manuelle
        </p>
        <h1 className="mt-3 text-3xl font-bold sm:text-4xl">Proposer une source candidate</h1>
        <p className="mt-4 leading-7 text-muted">
          Cette page prépare le travail éditorial sans automatiser la collecte. Le brouillon reste
          dans le navigateur, puis un opérateur peut l&apos;intégrer manuellement après revue
          humaine.
        </p>
      </div>

      <div className="mt-6">
        <TrustNotice compact />
      </div>

      <section className="mt-8 rounded-md border border-line bg-surface p-5">
        <h2 className="text-xl font-semibold">Règle de validation</h2>
        <p className="mt-3 text-sm leading-6 text-muted">
          Une source candidate ne rend aucune donnée officielle. Elle doit être reliée à des
          citations vérifiables avant qu&apos;une fiche puisse passer en statut partiellement
          vérifié ou vérifié.
        </p>
      </section>

      <div className="mt-8">
        <SourceCandidateForm />
      </div>
    </div>
  );
}
