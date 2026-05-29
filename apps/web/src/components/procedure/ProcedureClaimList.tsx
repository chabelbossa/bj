import type { ClaimStatus, ClaimType, ProcedureClaim } from "@dossierbj/core";

import { InlineSourceRefs } from "@/components/source/InlineSourceRefs";

const statusLabels: Record<ClaimStatus, string> = {
  verified: "Vérifié",
  partially_verified: "Partiel",
  unverified: "À vérifier",
  not_applicable: "Notice",
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
    <section
      style={{
        marginTop: 32,
        background: "var(--surface-card)",
        borderRadius: "var(--radius-lg)",
        padding: "var(--space-xl)",
      }}
    >
      {/* Header */}
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          alignItems: "flex-start",
          justifyContent: "space-between",
          gap: 12,
          marginBottom: 24,
        }}
      >
        <div>
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
            Registre de claims
          </p>
          <h2
            style={{
              fontFamily: "var(--font-serif)",
              fontSize: 24,
              fontWeight: 400,
              lineHeight: 1.2,
              letterSpacing: "-0.3px",
              color: "var(--ink)",
              margin: "0 0 8px",
            }}
          >
            Affirmations traçables
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
            Chaque frais, délai, pièce ou étape est traité comme une affirmation indépendante avec
            statut et sources.
          </p>
        </div>
        <span
          style={{
            fontFamily: "var(--font-sans)",
            fontSize: 12,
            fontWeight: 500,
            padding: "4px 12px",
            borderRadius: "var(--radius-pill)",
            background: "var(--surface-cream-strong)",
            color: "var(--muted)",
            whiteSpace: "nowrap",
          }}
        >
          {claims.length} claim(s)
        </span>
      </div>

      {/* Claims grid */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
          gap: 16,
        }}
      >
        {claims.map((claim) => {
          const s = statusStyles[claim.status];
          return (
            <article
              key={claim.id}
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
                <div>
                  <p
                    style={{
                      fontFamily: "var(--font-sans)",
                      fontSize: 11,
                      fontWeight: 500,
                      letterSpacing: "1.2px",
                      textTransform: "uppercase",
                      color: "var(--muted-soft)",
                      margin: "0 0 4px",
                    }}
                  >
                    {typeLabels[claim.type]}
                  </p>
                  <h3
                    style={{
                      fontFamily: "var(--font-sans)",
                      fontSize: 15,
                      fontWeight: 500,
                      color: "var(--ink)",
                      margin: 0,
                    }}
                  >
                    {claim.label}
                  </h3>
                </div>
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
                  {statusLabels[claim.status]}
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
                {claim.value}
              </p>
              {claim.note ? (
                <p
                  style={{
                    fontFamily: "var(--font-sans)",
                    fontSize: 12,
                    color: "var(--error)",
                    margin: "0 0 8px",
                  }}
                >
                  {claim.note}
                </p>
              ) : null}
              <InlineSourceRefs sources={claim.sourceRefs} label="Sources du claim" />
            </article>
          );
        })}
      </div>
    </section>
  );
}
