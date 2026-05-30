import Link from "next/link";

import { EmptyState } from "@/components/ui/EmptyState";
import { ProcedureResultCard } from "@/components/procedure/ProcedureResultCard";
import { TrustNotice } from "@/components/ui/TrustNotice";
import { getProcedureFilterData, searchProcedureData } from "@/lib/data";
import { verificationStatusSchema } from "@dossierbj/core";

type DemarchesPageProps = {
  searchParams: Promise<{
    q?: string | string[];
    category?: string | string[];
    target?: string | string[];
    status?: string | string[];
  }>;
};

export const metadata = {
  title: "Démarches",
};

const firstParam = (value: string | string[] | undefined) =>
  Array.isArray(value) ? value[0] : value;

const inputStyle: React.CSSProperties = {
  background: "var(--canvas)",
  color: "var(--ink)",
  fontFamily: "var(--font-sans)",
  fontSize: 14,
  padding: "10px 14px",
  minHeight: 42,
  borderRadius: "var(--radius-md)",
  border: "1px solid var(--hairline)",
  outline: "none",
  width: "100%",
};

const labelStyle: React.CSSProperties = {
  fontFamily: "var(--font-sans)",
  fontSize: 13,
  fontWeight: 500,
  color: "var(--muted)",
  display: "block",
  marginBottom: 6,
};

export default async function DemarchesPage({ searchParams }: DemarchesPageProps) {
  const params = await searchParams;
  const query = firstParam(params.q) ?? "";
  const category = firstParam(params.category);
  const target = firstParam(params.target);
  const rawStatus = firstParam(params.status);
  const parsedStatus = rawStatus ? verificationStatusSchema.safeParse(rawStatus) : undefined;
  const status = parsedStatus?.success ? parsedStatus.data : undefined;
  const [results, filters] = await Promise.all([
    searchProcedureData({
      query,
      category,
      targetUser: target,
      verificationStatus: status,
    }),
    getProcedureFilterData(),
  ]);

  return (
    <div style={{ maxWidth: 1200, margin: "0 auto", padding: "64px 24px" }}>
      {/* Page header */}
      <div style={{ maxWidth: 600, marginBottom: 32 }}>
        <span
          style={{
            fontFamily: "var(--font-sans)",
            fontSize: 12,
            fontWeight: 500,
            letterSpacing: "1.5px",
            textTransform: "uppercase",
            color: "var(--primary)",
            display: "block",
            marginBottom: 14,
          }}
        >
          DossierBJ Core
        </span>
        <h1
          style={{
            fontFamily: "var(--font-serif)",
            fontSize: "clamp(28px, 4vw, 36px)",
            fontWeight: 400,
            lineHeight: 1.15,
            letterSpacing: 0,
            color: "var(--ink)",
            margin: "0 0 14px",
          }}
        >
          Démarches disponibles
        </h1>
        <p
          style={{
            fontFamily: "var(--font-sans)",
            fontSize: 15,
            lineHeight: 1.7,
            color: "var(--muted)",
            margin: 0,
          }}
        >
          Recherche dans les fiches disponibles. Les informations sensibles restent reliées aux
          citations ou marquées comme non confirmées.
        </p>
      </div>

      <div style={{ marginBottom: 32 }}>
        <TrustNotice compact />
      </div>

      {/* Filter panel */}
      <div
        style={{
          background: "var(--surface-card)",
          borderRadius: "var(--radius-lg)",
          padding: "var(--space-xl)",
          marginBottom: 40,
        }}
      >
        <form action="/demarches" style={{ display: "flex", flexDirection: "column", gap: 20 }}>
          {/* Search input */}
          <div>
            <label htmlFor="procedure-search" style={labelStyle}>
              Recherche
            </label>
            <input
              id="procedure-search"
              name="q"
              defaultValue={query}
              placeholder="Ex : entreprise, casier, état civil..."
              style={{ ...inputStyle, minHeight: 48, fontSize: 15 }}
            />
          </div>

          {/* Filters row */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
              gap: 16,
            }}
          >
            <div>
              <label htmlFor="category-filter" style={labelStyle}>
                Catégorie
              </label>
              <select
                id="category-filter"
                name="category"
                defaultValue={category ?? ""}
                style={inputStyle}
              >
                <option value="">Toutes</option>
                {filters.categories.map((item) => (
                  <option key={item} value={item}>
                    {item}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="target-filter" style={labelStyle}>
                Profil
              </label>
              <select
                id="target-filter"
                name="target"
                defaultValue={target ?? ""}
                style={inputStyle}
              >
                <option value="">Tous</option>
                {filters.targets.map((item) => (
                  <option key={item} value={item}>
                    {item}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="status-filter" style={labelStyle}>
                Statut
              </label>
              <select
                id="status-filter"
                name="status"
                defaultValue={status ?? ""}
                style={inputStyle}
              >
                <option value="">Tous</option>
                <option value="verified">Vérifié</option>
                <option value="partially_verified">Partiellement vérifié</option>
                <option value="pending_verification">Vérification en attente</option>
              </select>
            </div>
          </div>

          {/* Actions */}
          <div style={{ display: "flex", flexWrap: "wrap", gap: 12 }}>
            <button type="submit" className="btn-primary">
              Rechercher
            </button>
            <Link href="/demarches" className="btn-secondary">
              Réinitialiser
            </Link>
          </div>
        </form>
      </div>

      {/* Results */}
      <section>
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            alignItems: "flex-end",
            justifyContent: "space-between",
            gap: 8,
            marginBottom: 24,
          }}
        >
          <div>
            <h2
              style={{
                fontFamily: "var(--font-serif)",
                fontSize: 22,
                fontWeight: 400,
                letterSpacing: 0,
                color: "var(--ink)",
                margin: "0 0 4px",
              }}
            >
              {results.length} résultat(s)
            </h2>
            <p
              style={{
                fontFamily: "var(--font-sans)",
                fontSize: 13,
                color: "var(--muted)",
                margin: 0,
              }}
            >
              Classement keyword local, sans API externe ni base distante.
            </p>
          </div>
        </div>

        {results.length > 0 ? (
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
              gap: 20,
            }}
          >
            {results.map((result) => (
              <ProcedureResultCard key={result.procedure.id} result={result} />
            ))}
          </div>
        ) : (
          <EmptyState
            title="Aucune démarche trouvée"
            description="Essayez une recherche plus large. Si la démarche manque, elle devra être ajoutée avec une source officielle vérifiée."
          />
        )}
      </section>
    </div>
  );
}
