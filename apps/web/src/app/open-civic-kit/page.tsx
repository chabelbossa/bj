import { ModuleCard } from "@/components/ui/ModuleCard";
import { TrustNotice } from "@/components/ui/TrustNotice";

export const metadata = {
  title: "OpenCivic Kit",
};

export default function OpenCivicKitPage() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:py-12">
      <div className="max-w-3xl">
        <p className="text-sm font-semibold uppercase tracking-[0.08em] text-brand-strong">
          OpenCivic Kit
        </p>
        <h1 className="mt-3 text-3xl font-bold sm:text-4xl">La couche open source prévue</h1>
        <p className="mt-4 leading-7 text-muted">
          OpenCivic Kit pourra publier des composants, types et helpers utiles à d&apos;autres
          projets civictech, sans exposer le corpus enrichi ni les workflows premium.
        </p>
      </div>
      <div className="mt-6">
        <TrustNotice compact />
      </div>
      <section className="mt-8 grid gap-4 md:grid-cols-2">
        <ModuleCard
          title="À ouvrir"
          description="Composants de citation, checklists, types publics, helpers FCFA et starter civictech."
          status="Possible"
        />
        <ModuleCard
          title="À garder propriétaire"
          description="Corpus enrichi, scoring avancé, prompts critiques, analytics business, workflows premium et billing."
          status="Protégé"
        />
      </section>
    </div>
  );
}
