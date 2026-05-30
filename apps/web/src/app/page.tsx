import Link from "next/link";

import { ModuleCard } from "@/components/ui/ModuleCard";
import { TrustNotice } from "@/components/ui/TrustNotice";
import { SearchBox } from "@/components/procedure/SearchBox";
import { ProcedureCard } from "@/components/procedure/ProcedureCard";
import { listProcedures } from "@/lib/data";

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

export default async function HomePage() {
  const featuredProcedures = (await listProcedures()).slice(0, 3);

  return (
    <div>
      {/* ── Hero band ───────────────────────────────────────────── */}
      <section
        style={{
          maxWidth: 1200,
          margin: "0 auto",
          padding: "96px 24px",
          display: "grid",
          gridTemplateColumns: "1fr",
          gap: 48,
          alignItems: "start",
        }}
        className="hero-section"
      >
        {/* Left — copy */}
        <div style={{ maxWidth: 640 }}>
          <span
            style={{
              fontFamily: "var(--font-sans)",
              fontSize: 12,
              fontWeight: 500,
              letterSpacing: "1.5px",
              textTransform: "uppercase",
              color: "var(--primary)",
              display: "block",
              marginBottom: 20,
            }}
          >
            CivicRAG · Mode local
          </span>

          <h1
            style={{
              fontFamily: "var(--font-serif)",
              fontSize: "clamp(36px, 5vw, 48px)",
              fontWeight: 400,
              lineHeight: 1.1,
              letterSpacing: 0,
              color: "var(--ink)",
              margin: "0 0 24px",
            }}
          >
            Comprendre et préparer ses démarches avec des sources vérifiables.
          </h1>

          <p
            style={{
              fontFamily: "var(--font-sans)",
              fontSize: 17,
              lineHeight: 1.65,
              color: "var(--muted)",
              margin: "0 0 36px",
              maxWidth: 520,
            }}
          >
            DossierBJ combine des fiches demo clairement marquées et quelques sources officielles
            connectées manuellement pour tester un parcours vraiment exploitable.
          </p>

          <div style={{ marginBottom: 28 }}>
            <SearchBox />
          </div>

          <div style={{ display: "flex", flexWrap: "wrap", gap: 12 }}>
            <Link href="/demarches" className="btn-primary">
              Voir les démarches
            </Link>
            <Link href="/assistant" className="btn-secondary">
              Tester l&apos;assistant
            </Link>
          </div>
        </div>

        {/* Right — MVP status card (dark) */}
        <div
          style={{
            background: "var(--surface-dark)",
            borderRadius: "var(--radius-xl)",
            padding: "var(--space-xl)",
            color: "var(--on-dark)",
          }}
          className="hero-dark-card"
        >
          <p
            style={{
              fontFamily: "var(--font-sans)",
              fontSize: 11,
              fontWeight: 500,
              letterSpacing: "1.5px",
              textTransform: "uppercase",
              color: "var(--on-dark-soft)",
              marginBottom: 16,
            }}
          >
            Statut MVP
          </p>
          <dl style={{ display: "flex", flexDirection: "column", gap: 18 }}>
            {[
              { dt: "Données", dd: "Seedées localement, avec preuves et statuts visibles" },
              { dt: "IA", dd: "Provider mock, aucun appel externe" },
              { dt: "Base", dd: "PostgreSQL préparé, non obligatoire" },
            ].map(({ dt, dd }) => (
              <div
                key={dt}
                style={{
                  borderBottom: "1px solid color-mix(in srgb, var(--on-dark) 10%, transparent)",
                  paddingBottom: 16,
                }}
              >
                <dt
                  style={{
                    fontFamily: "var(--font-sans)",
                    fontSize: 13,
                    fontWeight: 500,
                    color: "var(--on-dark)",
                    marginBottom: 4,
                  }}
                >
                  {dt}
                </dt>
                <dd
                  style={{
                    fontFamily: "var(--font-sans)",
                    fontSize: 13,
                    lineHeight: 1.6,
                    color: "var(--on-dark-soft)",
                    margin: 0,
                  }}
                >
                  {dd}
                </dd>
              </div>
            ))}
          </dl>
          <div style={{ marginTop: 20 }}>
            <span
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 6,
                fontFamily: "var(--font-sans)",
                fontSize: 12,
                color: "var(--accent-teal)",
              }}
            >
              <span
                style={{
                  width: 6,
                  height: 6,
                  borderRadius: "50%",
                  background: "var(--accent-teal)",
                  display: "inline-block",
                }}
              />
              Opérationnel en local
            </span>
          </div>
        </div>
      </section>

      {/* ── Trust notice ────────────────────────────────────────── */}
      <div
        style={{
          maxWidth: 1200,
          margin: "0 auto",
          padding: "0 24px 48px",
        }}
      >
        <TrustNotice />
      </div>

      {/* ── Hairline divider ────────────────────────────────────── */}
      <hr
        style={{
          border: "none",
          borderTop: "1px solid var(--hairline)",
          maxWidth: 1200,
          margin: "0 auto",
        }}
      />

      {/* ── Featured procedures ─────────────────────────────────── */}
      <section
        style={{
          maxWidth: 1200,
          margin: "0 auto",
          padding: "96px 24px",
        }}
      >
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            alignItems: "flex-end",
            justifyContent: "space-between",
            gap: 16,
            marginBottom: 40,
          }}
        >
          <div>
            <h2
              style={{
                fontFamily: "var(--font-serif)",
                fontSize: "clamp(28px, 3vw, 36px)",
                fontWeight: 400,
                lineHeight: 1.15,
                letterSpacing: 0,
                color: "var(--ink)",
                margin: "0 0 10px",
              }}
            >
              Démarches prioritaires
            </h2>
            <p
              style={{
                fontFamily: "var(--font-sans)",
                fontSize: 15,
                lineHeight: 1.6,
                color: "var(--muted)",
                margin: 0,
              }}
            >
              Les fiches indiquent clairement ce qui est partiellement vérifié et ce qui reste demo.
            </p>
          </div>
          <Link
            href="/demarches"
            style={{
              fontFamily: "var(--font-sans)",
              fontSize: 14,
              fontWeight: 500,
              color: "var(--primary)",
              textDecoration: "none",
              whiteSpace: "nowrap",
            }}
          >
            Tout voir →
          </Link>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
            gap: 20,
          }}
        >
          {featuredProcedures.map((procedure) => (
            <ProcedureCard key={procedure.id} procedure={procedure} />
          ))}
        </div>
      </section>

      {/* ── CTA coral band ──────────────────────────────────────── */}
      <div
        style={{
          maxWidth: 1200,
          margin: "0 auto",
          padding: "0 24px 96px",
        }}
      >
        <div
          style={{
            background: "var(--primary)",
            borderRadius: "var(--radius-lg)",
            padding: "64px 48px",
            display: "flex",
            flexWrap: "wrap",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 32,
          }}
        >
          <div>
            <h2
              style={{
                fontFamily: "var(--font-serif)",
                fontSize: "clamp(22px, 2.5vw, 28px)",
                fontWeight: 400,
                lineHeight: 1.2,
                letterSpacing: 0,
                color: "var(--on-primary)",
                margin: "0 0 10px",
              }}
            >
              Posez une question à l&apos;assistant sourcé.
            </h2>
            <p
              style={{
                fontFamily: "var(--font-sans)",
                fontSize: 15,
                lineHeight: 1.6,
                color: "rgba(255,255,255,0.8)",
                margin: 0,
              }}
            >
              CivicRAG en mode local — IA mock, aucune donnée envoyée.
            </p>
          </div>
          <Link
            href="/assistant"
            style={{
              display: "inline-flex",
              alignItems: "center",
              background: "var(--canvas)",
              color: "var(--ink)",
              fontFamily: "var(--font-sans)",
              fontSize: 14,
              fontWeight: 500,
              padding: "12px 24px",
              borderRadius: "var(--radius-md)",
              textDecoration: "none",
              whiteSpace: "nowrap",
              flexShrink: 0,
            }}
          >
            Tester l&apos;assistant
          </Link>
        </div>
      </div>

      {/* ── Modules ─────────────────────────────────────────────── */}
      <section
        style={{
          background: "var(--surface-dark)",
          padding: "96px 24px",
        }}
      >
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          <div style={{ marginBottom: 40 }}>
            <h2
              style={{
                fontFamily: "var(--font-serif)",
                fontSize: "clamp(28px, 3vw, 36px)",
                fontWeight: 400,
                lineHeight: 1.15,
                letterSpacing: 0,
                color: "var(--on-dark)",
                margin: "0 0 10px",
              }}
            >
              Modules préparés
            </h2>
            <p
              style={{
                fontFamily: "var(--font-sans)",
                fontSize: 15,
                lineHeight: 1.6,
                color: "var(--on-dark-soft)",
                margin: 0,
              }}
            >
              Architecture modulaire — seul DossierBJ Core est actif en MVP.
            </p>
          </div>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
              gap: 20,
            }}
          >
            {modules.map((module) => (
              <ModuleCard key={module.title} {...module} />
            ))}
          </div>
        </div>
      </section>

      <style>{`
        @media (min-width: 900px) {
          .hero-section {
            grid-template-columns: minmax(0, 1fr) 360px !important;
          }
          .hero-dark-card {
            position: sticky;
            top: 88px;
          }
        }
      `}</style>
    </div>
  );
}
