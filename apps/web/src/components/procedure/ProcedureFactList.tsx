import type { ClaimStatus, ProcedureFact } from "@dossierbj/core";

import { InlineSourceRefs } from "@/components/source/InlineSourceRefs";

const statusLabels: Record<ClaimStatus, string> = {
  verified: "Vérifié",
  partially_verified: "Partiel",
  unverified: "À vérifier",
  not_applicable: "Non applicable",
};

const statusClassNames: Record<ClaimStatus, string> = {
  verified: "bg-[#e6f2ec] text-brand-strong",
  partially_verified: "bg-[#fff8e8] text-[#5d4318]",
  unverified: "bg-[#fff1d6] text-[#774d08]",
  not_applicable: "bg-background text-muted",
};

export function ProcedureFactList({ facts }: { facts: ProcedureFact[] }) {
  if (facts.length === 0) {
    return null;
  }

  return (
    <section className="mt-8 rounded-md border border-line bg-surface p-5">
      <div>
        <p className="text-sm font-semibold uppercase tracking-[0.08em] text-brand-strong">
          Preuves par affirmation
        </p>
        <h2 className="mt-2 text-xl font-semibold">Ce que la fiche peut affirmer</h2>
        <p className="mt-2 text-sm leading-6 text-muted">
          Chaque point important est relié à une source ou reste explicitement marqué à vérifier.
        </p>
      </div>

      <div className="mt-5 grid gap-4 md:grid-cols-2">
        {facts.map((fact) => (
          <article key={fact.id} className="rounded-md border border-line bg-background p-4">
            <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
              <h3 className="font-semibold">{fact.label}</h3>
              <span
                className={`inline-flex w-fit rounded-sm px-2 py-1 text-xs font-semibold ${statusClassNames[fact.status]}`}
              >
                {statusLabels[fact.status]}
              </span>
            </div>
            <p className="mt-3 text-sm leading-6 text-muted">{fact.value}</p>
            {fact.note ? <p className="mt-2 text-xs text-danger">{fact.note}</p> : null}
            <InlineSourceRefs sources={fact.sourceRefs} label="Preuves" />
          </article>
        ))}
      </div>
    </section>
  );
}
