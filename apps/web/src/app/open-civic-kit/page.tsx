import { ModuleCard } from "@/components/ui/ModuleCard";
import { TrustNotice } from "@/components/ui/TrustNotice";
import { formatFcfa, openCivicKitManifest, verificationTone } from "@dossierbj/ui";

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
          OpenCivic Kit expose maintenant les premiers helpers publics utilisés par l&apos;app :
          classes conditionnelles, format FCFA et ton de vérification réutilisable par d&apos;autres
          projets civictech.
        </p>
      </div>
      <div className="mt-6">
        <TrustNotice compact />
      </div>
      <section className="mt-8 grid gap-4 md:grid-cols-2">
        <ModuleCard
          title="Consommé par l'app"
          description={`Statut package ${openCivicKitManifest.status}. Exemple public : ${formatFcfa(1900)}.`}
          status="MVP"
        />
        <ModuleCard
          title="À garder propriétaire"
          description="Corpus enrichi, scoring avancé, prompts critiques, analytics business, workflows premium et billing."
          status="Protégé"
        />
      </section>
      <section className="mt-8 rounded-md border border-line bg-surface p-5">
        <h2 className="text-xl font-semibold">Manifest public</h2>
        <div className="mt-4 grid gap-4 md:grid-cols-3">
          {openCivicKitManifest.publicHelpers.map((helper) => (
            <article key={helper} className="rounded-md border border-line bg-background p-4">
              <p className="text-sm font-semibold">{helper}</p>
              <p className="mt-2 text-sm text-muted">
                {helper === "verificationTone"
                  ? `partially_verified -> ${verificationTone("partially_verified")}`
                  : "Helper exporté depuis @dossierbj/ui."}
              </p>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}
