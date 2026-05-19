import { TrustNotice } from "@/components/ui/TrustNotice";

export const metadata = {
  title: "CivicUX Lab",
};

const criteria = [
  "Clarté du parcours",
  "Visibilité des frais et délais",
  "Accessibilité mobile",
  "Présence des sources",
  "Compréhension des pièces",
  "Feedback utilisateur",
];

export default function UxLabPage() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:py-12">
      <div className="max-w-3xl">
        <p className="text-sm font-semibold uppercase tracking-[0.08em] text-brand-strong">
          CivicUX Lab
        </p>
        <h1 className="mt-3 text-3xl font-bold sm:text-4xl">Laboratoire UX des services publics</h1>
        <p className="mt-4 leading-7 text-muted">
          Le module servira à auditer des plateformes publiques avec des critères lisibles et
          reproductibles. Le MVP expose seulement une grille de départ.
        </p>
      </div>
      <div className="mt-6">
        <TrustNotice compact />
      </div>
      <section className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {criteria.map((criterion, index) => (
          <article key={criterion} className="rounded-md border border-line bg-surface p-5">
            <p className="text-sm font-semibold text-brand-strong">Critère {index + 1}</p>
            <h2 className="mt-2 text-lg font-semibold">{criterion}</h2>
            <p className="mt-2 text-sm leading-6 text-muted">
              Critère de démonstration. Le scoring réel devra être documenté et vérifiable.
            </p>
          </article>
        ))}
      </section>
    </div>
  );
}
