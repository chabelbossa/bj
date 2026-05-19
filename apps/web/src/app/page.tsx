import Link from "next/link";

import { ModuleCard } from "@/components/ui/ModuleCard";
import { TrustNotice } from "@/components/ui/TrustNotice";
import { SearchBox } from "@/components/procedure/SearchBox";
import { ProcedureCard } from "@/components/procedure/ProcedureCard";
import { getProcedures } from "@dossierbj/core";

const modules = [
  {
    title: "DossierBJ Core",
    description: "Démarches, pièces, étapes, sources et checklists prudentes.",
    status: "MVP",
  },
  {
    title: "Digital Pulse",
    description: "Observatoire léger des services publics numériques et changements récents.",
    status: "Prévu léger",
  },
  {
    title: "CivicUX Lab",
    description: "Critères UX simples pour analyser les parcours publics numériques.",
    status: "Prévu léger",
  },
  {
    title: "AO Radar",
    description: "Préparation technique pour appels d'offres et checklists de soumission.",
    status: "Plus tard",
  },
];

export default function HomePage() {
  const featuredProcedures = getProcedures().slice(0, 3);

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:py-12">
      <section className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_360px] lg:items-start">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.08em] text-brand-strong">
            CivicRAG en mode local
          </p>
          <h1 className="mt-4 max-w-3xl text-4xl font-bold leading-tight sm:text-5xl">
            Comprendre et préparer ses démarches avec des sources vérifiables.
          </h1>
          <p className="mt-5 max-w-2xl text-lg leading-8 text-muted">
            DossierBJ combine des fiches demo clairement marquées et quelques sources officielles
            connectées manuellement pour tester un parcours vraiment exploitable.
          </p>
          <div className="mt-7">
            <SearchBox />
          </div>
          <div className="mt-6 flex flex-col gap-3 sm:flex-row">
            <Link
              href="/demarches"
              className="inline-flex min-h-11 items-center justify-center rounded-md bg-brand px-5 font-semibold text-white hover:bg-brand-strong"
            >
              Voir les démarches
            </Link>
            <Link
              href="/assistant"
              className="inline-flex min-h-11 items-center justify-center rounded-md border border-brand px-5 font-semibold text-brand-strong hover:bg-[#e6f2ec]"
            >
              Tester l&apos;assistant
            </Link>
          </div>
        </div>
        <div className="rounded-md border border-line bg-surface p-5">
          <h2 className="text-lg font-semibold">Statut MVP</h2>
          <dl className="mt-4 space-y-4 text-sm">
            <div>
              <dt className="font-medium">Données</dt>
              <dd className="text-muted">Seedées localement, avec preuves et statuts visibles</dd>
            </div>
            <div>
              <dt className="font-medium">IA</dt>
              <dd className="text-muted">Provider mock, aucun appel externe</dd>
            </div>
            <div>
              <dt className="font-medium">Base</dt>
              <dd className="text-muted">PostgreSQL préparé, non obligatoire</dd>
            </div>
          </dl>
        </div>
      </section>

      <div className="mt-8">
        <TrustNotice />
      </div>

      <section className="mt-12">
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
          <div>
            <h2 className="text-2xl font-bold">Démarches prioritaires</h2>
            <p className="mt-2 text-sm text-muted">
              Les fiches indiquent clairement ce qui est partiellement vérifié et ce qui reste demo.
            </p>
          </div>
          <Link
            href="/demarches"
            className="text-sm font-semibold text-brand-strong hover:underline"
          >
            Tout voir
          </Link>
        </div>
        <div className="mt-5 grid gap-4 md:grid-cols-3">
          {featuredProcedures.map((procedure) => (
            <ProcedureCard key={procedure.id} procedure={procedure} />
          ))}
        </div>
      </section>

      <section className="mt-12">
        <h2 className="text-2xl font-bold">Modules préparés</h2>
        <div className="mt-5 grid gap-4 md:grid-cols-2">
          {modules.map((module) => (
            <ModuleCard key={module.title} {...module} />
          ))}
        </div>
      </section>
    </div>
  );
}
