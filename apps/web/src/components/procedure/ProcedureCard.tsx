import type { Route } from "next";
import Link from "next/link";
import type { Procedure } from "@dossierbj/core";

import { ProcedureStatusBadge } from "./ProcedureStatusBadge";

export function ProcedureCard({ procedure }: { procedure: Procedure }) {
  return (
    <article
      style={{
        background: "var(--surface-card)",
        borderRadius: "var(--radius-lg)",
        padding: "var(--space-xl)",
        display: "flex",
        flexDirection: "column",
        gap: 14,
      }}
    >
      <ProcedureStatusBadge status={procedure.verificationStatus} />

      <h2
        style={{
          fontFamily: "var(--font-sans)",
          fontSize: 18,
          fontWeight: 500,
          lineHeight: 1.4,
          color: "var(--ink)",
          margin: 0,
        }}
      >
        {procedure.title}
      </h2>

      <p
        style={{
          fontFamily: "var(--font-sans)",
          fontSize: 14,
          lineHeight: 1.6,
          color: "var(--muted)",
          margin: 0,
        }}
      >
        {procedure.summary}
      </p>

      <p
        style={{
          fontFamily: "var(--font-sans)",
          fontSize: 13,
          lineHeight: 1.5,
          color: "var(--body)",
          margin: 0,
        }}
      >
        {procedure.userNeed}
      </p>

      <p
        style={{
          fontFamily: "var(--font-sans)",
          fontSize: 12,
          fontWeight: 500,
          color: "var(--primary)",
          margin: 0,
        }}
      >
        {procedure.verifiedFacts.length} affirmation(s) avec sources
      </p>

      {/* Tags */}
      <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
        <span
          style={{
            fontFamily: "var(--font-sans)",
            fontSize: 12,
            fontWeight: 500,
            padding: "4px 10px",
            borderRadius: "var(--radius-pill)",
            background: "var(--surface-cream-strong)",
            color: "var(--muted)",
          }}
        >
          {procedure.category}
        </span>
        {procedure.targetUsers.map((target) => (
          <span
            key={target}
            style={{
              fontFamily: "var(--font-sans)",
              fontSize: 12,
              padding: "4px 10px",
              borderRadius: "var(--radius-pill)",
              background: "var(--surface-cream-strong)",
              color: "var(--muted)",
            }}
          >
            {target}
          </span>
        ))}
      </div>

      {/* CTA */}
      <Link
        href={`/demarches/${procedure.slug}` as Route}
        className="btn-primary"
        style={{ alignSelf: "flex-start" }}
      >
        Voir la fiche
      </Link>
    </article>
  );
}
