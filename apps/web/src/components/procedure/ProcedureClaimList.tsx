import type { ClaimStatus, ClaimType, ProcedureClaim } from "@dossierbj/core";

import { InlineSourceRefs } from "@/components/source/InlineSourceRefs";

const statusLabels: Record<ClaimStatus, string> = {
  verified: "Vérifié",
  partially_verified: "Partiel",
  unverified: "À vérifier",
  not_applicable: "Notice",
};

const statusClassNames: Record<ClaimStatus, string> = {
  verified: "bg-[#e6f2ec] text-brand-strong",
  partially_verified: "bg-[#fff8e8] text-[#5d4318]",
  unverified: "bg-[#fff1d6] text-[#774d08]",
  not_applicable: "bg-background text-muted",
};

const typeLabels: Record<ClaimType, string> = {
  general: "Général",
  official_channel: "Canal officiel",
  cost: "Frais",
  duration: "Délai",
  required_document: "Pièce",
  procedure_step: "Étape",
  eligibility: "Éligibilité",
  warning: "Prudence",
};

export function ProcedureClaimList({ claims }: { claims: ProcedureClaim[] }) {
  if (claims.length === 0) {
    return null;
  }

  return (
    <section className="mt-8 rounded-md border border-line bg-surface p-5">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.08em] text-brand-strong">
            Registre de claims
          </p>
          <h2 className="mt-2 text-xl font-semibold">Affirmations traçables</h2>
          <p className="mt-2 text-sm leading-6 text-muted">
            Chaque frais, délai, pièce ou étape est traité comme une affirmation indépendante avec
            statut et sources.
          </p>
        </div>
        <span className="w-fit rounded-sm bg-background px-2 py-1 text-xs font-semibold text-muted">
          {claims.length} claim(s)
        </span>
      </div>

      <div className="mt-5 grid gap-4 md:grid-cols-2">
        {claims.map((claim) => (
          <article key={claim.id} className="rounded-md border border-line bg-background p-4">
            <div className="flex flex-wrap items-start justify-between gap-2">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.08em] text-muted">
                  {typeLabels[claim.type]}
                </p>
                <h3 className="mt-1 font-semibold">{claim.label}</h3>
              </div>
              <span
                className={`inline-flex w-fit rounded-sm px-2 py-1 text-xs font-semibold ${
                  statusClassNames[claim.status]
                }`}
              >
                {statusLabels[claim.status]}
              </span>
            </div>
            <p className="mt-3 text-sm leading-6 text-muted">{claim.value}</p>
            {claim.note ? <p className="mt-2 text-xs text-danger">{claim.note}</p> : null}
            <InlineSourceRefs sources={claim.sourceRefs} label="Sources du claim" />
          </article>
        ))}
      </div>
    </section>
  );
}
