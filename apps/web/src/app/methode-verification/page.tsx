import { TrustNotice } from "@/components/ui/TrustNotice";

export const metadata = {
  title: "Méthode de vérification",
};

const steps = [
  "Identifier une source officielle ou institutionnelle.",
  "Lire la page manuellement, sans scraping agressif.",
  "Extraire uniquement les affirmations explicites.",
  "Relier chaque frais, délai, pièce ou étape à une citation.",
  "Marquer ce qui manque comme information non confirmée.",
  "Revérifier les informations critiques sur la plateforme officielle avant usage.",
];

export default function VerificationMethodPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:py-12">
      <p className="text-sm font-semibold uppercase tracking-[0.08em] text-brand-strong">
        Méthode DossierBJ
      </p>
      <h1 className="mt-3 text-3xl font-bold sm:text-4xl">Comment les fiches sont vérifiées</h1>
      <p className="mt-4 leading-7 text-muted">
        DossierBJ sépare les données demo, les sources en revue et les affirmations partiellement
        vérifiées. Une information administrative sensible n&apos;est affichée comme exploitable que
        si elle est rattachée à une source.
      </p>

      <div className="mt-6">
        <TrustNotice compact />
      </div>

      <section className="mt-8 rounded-md border border-line bg-surface p-5">
        <h2 className="text-xl font-semibold">Processus de revue</h2>
        <ol className="mt-5 space-y-4">
          {steps.map((step, index) => (
            <li key={step} className="grid grid-cols-[32px_1fr] gap-3">
              <span className="flex h-8 w-8 items-center justify-center rounded-md bg-brand-soft text-sm font-bold text-brand-strong">
                {index + 1}
              </span>
              <span className="text-sm leading-6 text-muted">{step}</span>
            </li>
          ))}
        </ol>
      </section>

      <section className="mt-8 rounded-md border border-line bg-surface p-5">
        <h2 className="text-xl font-semibold">Niveaux de confiance</h2>
        <dl className="mt-4 grid gap-4 sm:grid-cols-3">
          <div>
            <dt className="font-semibold">Faible</dt>
            <dd className="mt-1 text-sm leading-6 text-muted">
              Donnée demo, source absente ou information insuffisante.
            </dd>
          </div>
          <div>
            <dt className="font-semibold">Moyenne</dt>
            <dd className="mt-1 text-sm leading-6 text-muted">
              Source officielle connectée, mais couverture encore partielle.
            </dd>
          </div>
          <div>
            <dt className="font-semibold">Haute</dt>
            <dd className="mt-1 text-sm leading-6 text-muted">
              Réservée aux fiches exhaustives, revues et maintenues à jour.
            </dd>
          </div>
        </dl>
      </section>
    </div>
  );
}
