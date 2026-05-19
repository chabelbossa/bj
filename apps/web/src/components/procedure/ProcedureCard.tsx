import type { Route } from "next";
import Link from "next/link";
import type { Procedure } from "@dossierbj/core";

import { ProcedureStatusBadge } from "./ProcedureStatusBadge";

export function ProcedureCard({ procedure }: { procedure: Procedure }) {
  return (
    <article className="rounded-md border border-line bg-surface p-5">
      <div className="flex flex-col gap-3">
        <ProcedureStatusBadge status={procedure.verificationStatus} />
        <h2 className="text-xl font-semibold">{procedure.title}</h2>
        <p className="text-sm leading-6 text-muted">{procedure.summary}</p>
        <p className="text-sm leading-6 text-foreground">{procedure.userNeed}</p>
        <p className="text-xs font-medium text-brand-strong">
          {procedure.verifiedFacts.length} affirmation(s) suivie(s) avec sources
        </p>
        <div className="flex flex-wrap gap-2 text-xs text-muted">
          <span className="rounded-sm bg-background px-2 py-1">{procedure.category}</span>
          {procedure.targetUsers.map((target) => (
            <span key={target} className="rounded-sm bg-background px-2 py-1">
              {target}
            </span>
          ))}
        </div>
        <Link
          href={`/demarches/${procedure.slug}` as Route}
          className="mt-1 inline-flex min-h-10 items-center justify-center rounded-md border border-brand px-4 text-sm font-semibold text-brand-strong hover:bg-[#e6f2ec] sm:w-fit"
        >
          Voir la fiche
        </Link>
      </div>
    </article>
  );
}
