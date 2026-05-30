import type { Metadata } from "next";
import type { Route } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { ChecklistBuilder } from "@/components/checklist/ChecklistBuilder";
import { ProcedureClaimList } from "@/components/procedure/ProcedureClaimList";
import { ProcedureFactList } from "@/components/procedure/ProcedureFactList";
import { ProcedureStatusBadge } from "@/components/procedure/ProcedureStatusBadge";
import { CitationList } from "@/components/source/CitationList";
import { InlineSourceRefs } from "@/components/source/InlineSourceRefs";
import { SourceBadge } from "@/components/source/SourceBadge";
import { TrustNotice } from "@/components/ui/TrustNotice";
import { getProcedureBySlug, getProcedureClaimsBySlug } from "@/lib/data";

type ProcedurePageProps = {
  params: Promise<{
    slug: string;
  }>;
};

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: ProcedurePageProps): Promise<Metadata> {
  const { slug } = await params;
  const procedure = await getProcedureBySlug(slug);

  return {
    title: procedure ? procedure.title : "Démarche introuvable",
  };
}

const sectionStyle: React.CSSProperties = {
  background: "var(--surface-card)",
  borderRadius: "var(--radius-lg)",
  padding: "var(--space-xl)",
  marginTop: 24,
};

const sectionTitleStyle: React.CSSProperties = {
  fontFamily: "var(--font-serif)",
  fontSize: 22,
  fontWeight: 400,
  lineHeight: 1.2,
  letterSpacing: 0,
  color: "var(--ink)",
  margin: "0 0 16px",
};

const dtStyle: React.CSSProperties = {
  fontFamily: "var(--font-sans)",
  fontSize: 12,
  fontWeight: 500,
  color: "var(--muted-soft)",
  marginBottom: 4,
  textTransform: "uppercase",
  letterSpacing: "0.8px",
};

const ddStyle: React.CSSProperties = {
  fontFamily: "var(--font-sans)",
  fontSize: 14,
  lineHeight: 1.6,
  color: "var(--body)",
  margin: 0,
};

export default async function ProcedureDetailPage({ params }: ProcedurePageProps) {
  const { slug } = await params;
  const [procedure, claims] = await Promise.all([
    getProcedureBySlug(slug),
    getProcedureClaimsBySlug(slug),
  ]);

  if (!procedure) {
    notFound();
  }

  return (
    <div style={{ maxWidth: 1200, margin: "0 auto", padding: "64px 24px" }}>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr",
          gap: 32,
          alignItems: "start",
        }}
        className="procedure-detail-grid"
      >
        {/* ── Main article ── */}
        <article>
          {/* Status + title */}
          <ProcedureStatusBadge status={procedure.verificationStatus} />
          <h1
            style={{
              fontFamily: "var(--font-serif)",
              fontSize: "clamp(28px, 4vw, 40px)",
              fontWeight: 400,
              lineHeight: 1.1,
              letterSpacing: 0,
              color: "var(--ink)",
              margin: "16px 0 14px",
            }}
          >
            {procedure.title}
          </h1>
          <p
            style={{
              fontFamily: "var(--font-sans)",
              fontSize: 16,
              lineHeight: 1.7,
              color: "var(--muted)",
              margin: "0 0 24px",
            }}
          >
            {procedure.summary}
          </p>

          <TrustNotice compact />

          {/* Key info section */}
          <section style={sectionStyle}>
            <h2 style={sectionTitleStyle}>Informations clés</h2>
            <dl
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
                gap: 20,
                marginBottom: 20,
              }}
            >
              <div>
                <dt style={dtStyle}>Besoin utilisateur</dt>
                <dd style={ddStyle}>{procedure.userNeed}</dd>
              </div>
              <div>
                <dt style={dtStyle}>Résultat attendu</dt>
                <dd style={ddStyle}>{procedure.expectedOutcome}</dd>
              </div>
              <div>
                <dt style={dtStyle}>Frais</dt>
                <dd style={ddStyle}>{procedure.officialCost}</dd>
              </div>
              <div>
                <dt style={dtStyle}>Délais</dt>
                <dd style={ddStyle}>{procedure.estimatedDuration}</dd>
              </div>
              <div>
                <dt style={dtStyle}>Dernière vérification</dt>
                <dd style={ddStyle}>{procedure.lastVerifiedAt}</dd>
              </div>
              <div>
                <dt style={dtStyle}>Source principale</dt>
                <dd style={{ ...ddStyle, display: "flex", flexWrap: "wrap", gap: 6 }}>
                  {procedure.sources.map((source) => (
                    <SourceBadge key={`${source.sourceId}-${source.url}`} source={source} />
                  ))}
                </dd>
              </div>
              <div>
                <dt style={dtStyle}>État source</dt>
                <dd style={ddStyle}>{procedure.sourceStatusNote}</dd>
              </div>
            </dl>
            {procedure.officialUrl ? (
              <a
                href={procedure.officialUrl}
                target="_blank"
                rel="noreferrer"
                className="btn-secondary"
                style={{ display: "inline-flex" }}
              >
                Ouvrir la plateforme officielle ↗
              </a>
            ) : null}
          </section>

          <ProcedureFactList facts={procedure.verifiedFacts} />
          <ProcedureClaimList claims={claims} />

          {/* Preparation hints */}
          <section style={sectionStyle}>
            <h2 style={sectionTitleStyle}>Préparation prudente</h2>
            <ul
              style={{
                listStyle: "none",
                padding: 0,
                margin: 0,
                display: "flex",
                flexDirection: "column",
                gap: 10,
              }}
            >
              {procedure.preparationHints.map((item, i) => (
                <li key={item} style={{ display: "flex", gap: 12, alignItems: "flex-start" }}>
                  <span
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      justifyContent: "center",
                      width: 22,
                      height: 22,
                      borderRadius: "50%",
                      background: "color-mix(in srgb, var(--primary) 10%, var(--canvas))",
                      color: "var(--primary)",
                      fontFamily: "var(--font-sans)",
                      fontSize: 11,
                      fontWeight: 600,
                      flexShrink: 0,
                    }}
                  >
                    {i + 1}
                  </span>
                  <span
                    style={{
                      fontFamily: "var(--font-sans)",
                      fontSize: 14,
                      lineHeight: 1.6,
                      color: "var(--muted)",
                    }}
                  >
                    {item}
                  </span>
                </li>
              ))}
            </ul>
          </section>

          {/* Points to verify */}
          <section style={sectionStyle}>
            <h2 style={sectionTitleStyle}>Ce qui reste à vérifier</h2>
            <p
              style={{
                fontFamily: "var(--font-sans)",
                fontSize: 14,
                lineHeight: 1.6,
                color: "var(--muted)",
                margin: "0 0 16px",
              }}
            >
              Ces points doivent être confirmés directement sur la plateforme officielle avant toute
              décision ou paiement.
            </p>
            <ul
              style={{
                listStyle: "none",
                padding: 0,
                margin: 0,
                display: "flex",
                flexDirection: "column",
                gap: 8,
              }}
            >
              {procedure.pointsToVerify.map((item) => (
                <li key={item} style={{ display: "flex", gap: 10, alignItems: "flex-start" }}>
                  <span
                    style={{
                      width: 6,
                      height: 6,
                      borderRadius: "50%",
                      background: "var(--primary)",
                      marginTop: 7,
                      flexShrink: 0,
                    }}
                  />
                  <span
                    style={{
                      fontFamily: "var(--font-sans)",
                      fontSize: 14,
                      lineHeight: 1.6,
                      color: "var(--muted)",
                    }}
                  >
                    {item}
                  </span>
                </li>
              ))}
            </ul>
          </section>

          {/* Required documents */}
          <section style={sectionStyle}>
            <h2 style={sectionTitleStyle}>Pièces à fournir</h2>
            <ul
              style={{
                listStyle: "none",
                padding: 0,
                margin: 0,
                display: "flex",
                flexDirection: "column",
                gap: 0,
              }}
            >
              {procedure.requiredDocuments.map((document, i) => (
                <li
                  key={document.id}
                  style={{
                    padding: "16px 0",
                    borderBottom:
                      i < procedure.requiredDocuments.length - 1
                        ? "1px solid var(--hairline)"
                        : "none",
                  }}
                >
                  <h3
                    style={{
                      fontFamily: "var(--font-sans)",
                      fontSize: 15,
                      fontWeight: 500,
                      color: "var(--ink)",
                      margin: "0 0 6px",
                    }}
                  >
                    {document.name}
                  </h3>
                  <p
                    style={{
                      fontFamily: "var(--font-sans)",
                      fontSize: 13,
                      lineHeight: 1.6,
                      color: "var(--muted)",
                      margin: 0,
                    }}
                  >
                    {document.description}
                  </p>
                  {document.condition ? (
                    <p
                      style={{
                        fontFamily: "var(--font-sans)",
                        fontSize: 12,
                        color: "var(--error)",
                        margin: "6px 0 0",
                      }}
                    >
                      {document.condition}
                    </p>
                  ) : null}
                  <InlineSourceRefs sources={document.sourceRefs} label="Sources de cette pièce" />
                </li>
              ))}
            </ul>
          </section>

          {/* Steps */}
          <section style={sectionStyle}>
            <h2 style={sectionTitleStyle}>Étapes</h2>
            <ol
              style={{
                listStyle: "none",
                padding: 0,
                margin: 0,
                display: "flex",
                flexDirection: "column",
                gap: 20,
              }}
            >
              {procedure.steps.map((step) => (
                <li
                  key={step.id}
                  style={{ display: "grid", gridTemplateColumns: "36px 1fr", gap: 14 }}
                >
                  <span
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      width: 36,
                      height: 36,
                      borderRadius: "50%",
                      background: "var(--primary)",
                      color: "var(--on-primary)",
                      fontFamily: "var(--font-sans)",
                      fontSize: 14,
                      fontWeight: 600,
                      flexShrink: 0,
                    }}
                  >
                    {step.order}
                  </span>
                  <div>
                    <span
                      style={{
                        fontFamily: "var(--font-sans)",
                        fontSize: 15,
                        fontWeight: 500,
                        color: "var(--ink)",
                        display: "block",
                        marginBottom: 4,
                      }}
                    >
                      {step.title}
                    </span>
                    <span
                      style={{
                        fontFamily: "var(--font-sans)",
                        fontSize: 13,
                        lineHeight: 1.6,
                        color: "var(--muted)",
                        display: "block",
                      }}
                    >
                      {step.description}
                    </span>
                    <InlineSourceRefs sources={step.sourceRefs} label="Sources de cette étape" />
                  </div>
                </li>
              ))}
            </ol>
          </section>

          {/* Citations */}
          <section style={{ marginTop: 32 }}>
            <h2 style={{ ...sectionTitleStyle, marginBottom: 20 }}>Sources et citations</h2>
            <CitationList citations={procedure.sources} />
          </section>
        </article>

        {/* ── Aside ── */}
        <aside
          style={{ display: "flex", flexDirection: "column", gap: 16 }}
          className="procedure-aside"
        >
          <ChecklistBuilder procedure={procedure} />

          <Link
            href={`/assistant?q=${encodeURIComponent(procedure.title)}`}
            className="btn-primary"
            style={{ width: "100%", justifyContent: "center" }}
          >
            Poser une question à l&apos;assistant
          </Link>

          <Link
            href={"/sources" as Route}
            className="btn-secondary"
            style={{ width: "100%", justifyContent: "center" }}
          >
            Voir les sources à vérifier
          </Link>

          {/* Warnings */}
          <section
            style={{
              background: "var(--surface-dark)",
              borderRadius: "var(--radius-lg)",
              padding: "var(--space-lg)",
              color: "var(--on-dark)",
            }}
          >
            <h2
              style={{
                fontFamily: "var(--font-sans)",
                fontSize: 15,
                fontWeight: 500,
                color: "var(--on-dark)",
                margin: "0 0 12px",
              }}
            >
              Avertissements
            </h2>
            <ul
              style={{
                listStyle: "none",
                padding: 0,
                margin: 0,
                display: "flex",
                flexDirection: "column",
                gap: 8,
              }}
            >
              {procedure.warnings.map((warning) => (
                <li key={warning} style={{ display: "flex", gap: 8, alignItems: "flex-start" }}>
                  <span
                    style={{
                      width: 5,
                      height: 5,
                      borderRadius: "50%",
                      background: "var(--accent-amber)",
                      marginTop: 6,
                      flexShrink: 0,
                    }}
                  />
                  <span
                    style={{
                      fontFamily: "var(--font-sans)",
                      fontSize: 13,
                      lineHeight: 1.6,
                      color: "var(--on-dark-soft)",
                    }}
                  >
                    {warning}
                  </span>
                </li>
              ))}
            </ul>
          </section>
        </aside>
      </div>

      <style>{`
        @media (min-width: 900px) {
          .procedure-detail-grid {
            grid-template-columns: minmax(0, 1fr) 320px !important;
          }
          .procedure-aside {
            position: sticky;
            top: 88px;
          }
        }
      `}</style>
    </div>
  );
}
