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
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:py-12">
      <div className="max-w-3xl">
        <p className="text-sm font-semibold uppercase tracking-[0.08em] text-brand-strong">
          DossierBJ Core
        </p>
        <h1 className="mt-3 text-3xl font-bold sm:text-4xl">Démarches disponibles</h1>
        <p className="mt-4 leading-7 text-muted">
          Recherche dans les fiches disponibles. Les informations sensibles restent reliées aux
          citations ou marquées comme non confirmées.
        </p>
      </div>

      <div className="mt-6">
        <TrustNotice compact />
      </div>

      <div className="mt-8 rounded-md border border-line bg-surface p-4">
        <form action="/demarches" className="grid gap-4">
          <div>
            <label className="text-sm font-semibold" htmlFor="procedure-search">
              Recherche
            </label>
            <input
              id="procedure-search"
              name="q"
              defaultValue={query}
              placeholder="Ex: entreprise, casier, état civil..."
              className="mt-2 min-h-12 w-full rounded-md border border-line bg-background px-4 text-base outline-none focus:border-brand focus:ring-2 focus:ring-brand/20"
            />
          </div>

          <div className="grid gap-3 sm:grid-cols-3">
            <label className="text-sm font-semibold" htmlFor="category-filter">
              Catégorie
              <select
                id="category-filter"
                name="category"
                defaultValue={category ?? ""}
                className="mt-2 min-h-11 w-full rounded-md border border-line bg-background px-3 font-normal"
              >
                <option value="">Toutes</option>
                {filters.categories.map((item) => (
                  <option key={item} value={item}>
                    {item}
                  </option>
                ))}
              </select>
            </label>

            <label className="text-sm font-semibold" htmlFor="target-filter">
              Profil
              <select
                id="target-filter"
                name="target"
                defaultValue={target ?? ""}
                className="mt-2 min-h-11 w-full rounded-md border border-line bg-background px-3 font-normal"
              >
                <option value="">Tous</option>
                {filters.targets.map((item) => (
                  <option key={item} value={item}>
                    {item}
                  </option>
                ))}
              </select>
            </label>

            <label className="text-sm font-semibold" htmlFor="status-filter">
              Statut
              <select
                id="status-filter"
                name="status"
                defaultValue={status ?? ""}
                className="mt-2 min-h-11 w-full rounded-md border border-line bg-background px-3 font-normal"
              >
                <option value="">Tous</option>
                <option value="partially_verified">Partiellement vérifié</option>
                <option value="demo_unverified">Demo non officielle</option>
              </select>
            </label>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row">
            <button
              type="submit"
              className="min-h-11 rounded-md bg-brand px-5 font-semibold text-white hover:bg-brand-strong"
            >
              Rechercher
            </button>
            <Link
              href="/demarches"
              className="inline-flex min-h-11 items-center justify-center rounded-md border border-line px-5 font-semibold text-brand-strong hover:border-brand"
            >
              Réinitialiser
            </Link>
          </div>
        </form>
      </div>

      <section className="mt-8">
        <div className="mb-4 flex flex-col justify-between gap-2 sm:flex-row sm:items-end">
          <div>
            <h2 className="text-xl font-semibold">{results.length} résultat(s)</h2>
            <p className="mt-1 text-sm text-muted">
              Classement keyword local, sans API externe ni base distante.
            </p>
          </div>
        </div>
        {results.length > 0 ? (
          <div className="grid gap-4 md:grid-cols-2">
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
