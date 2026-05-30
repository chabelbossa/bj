import type { ClaimStatus, ProcedureFact } from "@dossierbj/core";

import { InlineSourceRefs } from "@/components/source/InlineSourceRefs";

const statusLabels: Record<ClaimStatus, string> = {
  verified: "Vérifié",
  partially_verified: "Partiel",
  unverified: "À vérifier",
  not_applicable: "Non applicable",
};

const statusStyles: Record<ClaimStatus, { background: string; color: string }> = {
  verified: {
    background: "color-mix(in srgb, var(--success) 15%, var(--canvas))",
    color: "color-mix(in srgb, var(--success) 70%, var(--ink))",
  },
  partially_verified: {
    background: "color-mix(in srgb, var(--accent-amber) 18%, var(--canvas))",
    color: "color-mix(in srgb, var(--accent-amber) 80%, var(--ink))",
  },
  unverified: {
    background: "var(--primary)",
    color: "var(--on-primary)",
  },
  not_applicable: {
    background: "var(--surface-card)",
    color: "var(--muted-soft)",
  },
};

export function ProcedureFactList({ facts }: { facts: ProcedureFact[] }) {
  if (facts.length === 0) {
    return null;
  }

  return (
    <section
      style={{
        marginTop: 32,
        background: "var(--surface-card)",
        borderRadius: "var(--radius-lg)",
        padding: "var(--space-xl)",
      }}
    >
      <div style={{ marginBottom: 24 }}>
        <p
          style={{
            fontFamily: "var(--font-sans)",
            fontSize: 12,
            fontWeight: 500,
            letterSpacing: "1.5px",
            textTransform: "uppercase",
            color: "var(--primary)",
            margin: "0 0 8px",
          }}
        >
          Preuves par affirmation
        </p>
        <h2
          style={{
            fontFamily: "var(--font-serif)",
            fontSize: 24,
            fontWeight: 400,
            lineHeight: 1.2,
            letterSpacing: 0,
            color: "var(--ink)",
            margin: "0 0 8px",
          }}
        >
          Ce que la fiche peut affirmer
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
          Chaque point important est relié à une source ou reste explicitement marqué à vérifier.
        </p>
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
          gap: 16,
        }}
      >
        {facts.map((fact) => {
          const s = statusStyles[fact.status];
          return (
            <article
              key={fact.id}
              style={{
                background: "var(--canvas)",
                border: "1px solid var(--hairline)",
                borderRadius: "var(--radius-lg)",
                padding: "var(--space-md)",
              }}
            >
              <div
                style={{
                  display: "flex",
                  flexWrap: "wrap",
                  alignItems: "flex-start",
                  justifyContent: "space-between",
                  gap: 8,
                  marginBottom: 10,
                }}
              >
                <h3
                  style={{
                    fontFamily: "var(--font-sans)",
                    fontSize: 15,
                    fontWeight: 500,
                    color: "var(--ink)",
                    margin: 0,
                  }}
                >
                  {fact.label}
                </h3>
                <span
                  style={{
                    fontFamily: "var(--font-sans)",
                    fontSize: 12,
                    fontWeight: 500,
                    padding: "4px 10px",
                    borderRadius: "var(--radius-pill)",
                    background: s.background,
                    color: s.color,
                    flexShrink: 0,
                  }}
                >
                  {statusLabels[fact.status]}
                </span>
              </div>
              <p
                style={{
                  fontFamily: "var(--font-sans)",
                  fontSize: 13,
                  lineHeight: 1.6,
                  color: "var(--muted)",
                  margin: "0 0 8px",
                }}
              >
                {fact.value}
              </p>
              {fact.note ? (
                <p
                  style={{
                    fontFamily: "var(--font-sans)",
                    fontSize: 12,
                    color: "var(--error)",
                    margin: "0 0 8px",
                  }}
                >
                  {fact.note}
                </p>
              ) : null}
              <InlineSourceRefs sources={fact.sourceRefs} label="Preuves" />
            </article>
          );
        })}
      </div>
    </section>
  );
}
