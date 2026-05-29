"use client";

import type { Route } from "next";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

import type { ClaimReviewItem, ClaimReviewPriority, ClaimStatus, ClaimType } from "@dossierbj/core";

type ProcedureOption = {
  slug: string;
  title: string;
};

type ClaimReviewWorkspaceProps = {
  items: ClaimReviewItem[];
  procedures: ProcedureOption[];
};

type LocalNoteMap = Record<string, string>;

const storageKey = "dossierbj:claim-review-notes:v1";

const priorityLabels: Record<ClaimReviewPriority, string> = {
  critical: "Critique",
  high: "Haute",
  medium: "Moyenne",
  low: "Basse",
};

const statusLabels: Record<ClaimStatus, string> = {
  verified: "Vérifié",
  partially_verified: "Partiel",
  unverified: "À vérifier",
  not_applicable: "Non applicable",
};

const typeLabels: Record<ClaimType, string> = {
  general: "Général",
  official_channel: "Canal officiel",
  cost: "Frais",
  duration: "Délai",
  required_document: "Pièce",
  procedure_step: "Étape",
  eligibility: "Éligibilité",
  warning: "Avertissement",
};

const priorities: ClaimReviewPriority[] = ["critical", "high", "medium", "low"];
const statuses: ClaimStatus[] = ["unverified", "partially_verified", "verified", "not_applicable"];
const types: ClaimType[] = [
  "cost",
  "duration",
  "required_document",
  "procedure_step",
  "official_channel",
  "eligibility",
  "warning",
  "general",
];

export function ClaimReviewWorkspace({ items, procedures }: ClaimReviewWorkspaceProps) {
  const [query, setQuery] = useState("");
  const [priority, setPriority] = useState<ClaimReviewPriority | "all">("all");
  const [status, setStatus] = useState<ClaimStatus | "all">("all");
  const [type, setType] = useState<ClaimType | "all">("all");
  const [procedureSlug, setProcedureSlug] = useState("all");
  const [notes, setNotes] = useState<LocalNoteMap>({});
  const [saveStatus, setSaveStatus] = useState<string | null>(null);

  useEffect(() => {
    const frameId = window.requestAnimationFrame(() => {
      const rawValue = window.localStorage.getItem(storageKey);

      if (!rawValue) {
        return;
      }

      try {
        const parsed = JSON.parse(rawValue) as LocalNoteMap;
        setNotes(parsed && typeof parsed === "object" ? parsed : {});
      } catch {
        window.localStorage.removeItem(storageKey);
      }
    });

    return () => window.cancelAnimationFrame(frameId);
  }, []);

  useEffect(() => {
    window.localStorage.setItem(storageKey, JSON.stringify(notes));
  }, [notes]);

  const visibleItems = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();

    return items.filter((item) => {
      const claim = item.claim;
      const searchable =
        `${claim.procedureSlug} ${claim.label} ${claim.value} ${claim.type}`.toLowerCase();

      return (
        (priority === "all" || item.priority === priority) &&
        (status === "all" || claim.status === status) &&
        (type === "all" || claim.type === type) &&
        (procedureSlug === "all" || claim.procedureSlug === procedureSlug) &&
        (!normalizedQuery || searchable.includes(normalizedQuery))
      );
    });
  }, [items, priority, procedureSlug, query, status, type]);

  const notedCount = Object.values(notes).filter((value) => value.trim().length > 0).length;

  function updateNote(claimId: string, value: string) {
    setSaveStatus("Notes enregistrées localement.");
    setNotes((current) => ({
      ...current,
      [claimId]: value,
    }));
  }

  async function exportNotes() {
    const payload = {
      exportedAt: new Date().toISOString(),
      notes: Object.entries(notes)
        .filter(([, value]) => value.trim().length > 0)
        .map(([claimId, note]) => ({ claimId, note })),
    };

    try {
      await window.navigator.clipboard.writeText(JSON.stringify(payload, null, 2));
      setSaveStatus("Export des notes copié localement.");
    } catch {
      setSaveStatus("Copie indisponible. Les notes restent visibles dans le navigateur.");
    }
  }

  function clearNotes() {
    setNotes({});
    window.localStorage.removeItem(storageKey);
    setSaveStatus("Notes locales effacées.");
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[300px_minmax(0,1fr)]">
      <aside className="rounded-md border border-line bg-surface p-5 lg:sticky lg:top-4 lg:self-start">
        <h2 className="text-lg font-semibold">Filtres de revue</h2>
        <div className="mt-4 grid gap-4">
          <label className="grid gap-2 text-sm font-semibold">
            Recherche
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              className="min-h-10 rounded-md border border-line bg-background px-3 font-normal"
              placeholder="frais, document, rccm..."
            />
          </label>
          <label className="grid gap-2 text-sm font-semibold">
            Priorité
            <select
              value={priority}
              onChange={(event) => setPriority(event.target.value as ClaimReviewPriority | "all")}
              className="min-h-10 rounded-md border border-line bg-background px-3 font-normal"
            >
              <option value="all">Toutes</option>
              {priorities.map((item) => (
                <option key={item} value={item}>
                  {priorityLabels[item]}
                </option>
              ))}
            </select>
          </label>
          <label className="grid gap-2 text-sm font-semibold">
            Statut
            <select
              value={status}
              onChange={(event) => setStatus(event.target.value as ClaimStatus | "all")}
              className="min-h-10 rounded-md border border-line bg-background px-3 font-normal"
            >
              <option value="all">Tous</option>
              {statuses.map((item) => (
                <option key={item} value={item}>
                  {statusLabels[item]}
                </option>
              ))}
            </select>
          </label>
          <label className="grid gap-2 text-sm font-semibold">
            Type
            <select
              value={type}
              onChange={(event) => setType(event.target.value as ClaimType | "all")}
              className="min-h-10 rounded-md border border-line bg-background px-3 font-normal"
            >
              <option value="all">Tous</option>
              {types.map((item) => (
                <option key={item} value={item}>
                  {typeLabels[item]}
                </option>
              ))}
            </select>
          </label>
          <label className="grid gap-2 text-sm font-semibold">
            Fiche
            <select
              value={procedureSlug}
              onChange={(event) => setProcedureSlug(event.target.value)}
              className="min-h-10 rounded-md border border-line bg-background px-3 font-normal"
            >
              <option value="all">Toutes</option>
              {procedures.map((procedure) => (
                <option key={procedure.slug} value={procedure.slug}>
                  {procedure.title}
                </option>
              ))}
            </select>
          </label>
        </div>

        <div className="mt-5 rounded-md border border-line bg-background p-4 text-sm text-muted">
          <p>
            {visibleItems.length} claim(s) affiché(s), {notedCount} note(s) locale(s).
          </p>
          <p className="mt-2">
            Les notes restent dans ce navigateur et ne modifient jamais le corpus public.
          </p>
        </div>

        <div className="mt-4 flex flex-col gap-2">
          <button
            type="button"
            onClick={exportNotes}
            className="min-h-10 rounded-md border border-brand px-3 text-sm font-semibold text-brand-strong hover:bg-[#e6f2ec]"
          >
            Copier les notes
          </button>
          <button
            type="button"
            onClick={clearNotes}
            className="min-h-10 rounded-md border border-line px-3 text-sm font-semibold text-muted hover:border-brand"
          >
            Effacer les notes
          </button>
        </div>
        {saveStatus ? <p className="mt-3 text-sm text-brand-strong">{saveStatus}</p> : null}
      </aside>

      <section className="space-y-4">
        {visibleItems.map((item) => (
          <article key={item.claim.id} className="rounded-md border border-line bg-surface p-5">
            <div className="flex flex-wrap gap-2">
              <span className="rounded-sm bg-[#fff1d6] px-2 py-1 text-xs font-semibold text-[#774d08]">
                {priorityLabels[item.priority]}
              </span>
              <span className="rounded-sm bg-background px-2 py-1 text-xs font-semibold text-muted">
                {statusLabels[item.claim.status]}
              </span>
              <span className="rounded-sm bg-background px-2 py-1 text-xs font-semibold text-muted">
                {typeLabels[item.claim.type]}
              </span>
            </div>

            <div className="mt-4 flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
              <div>
                <h3 className="text-lg font-semibold">{item.claim.label}</h3>
                <Link
                  href={`/demarches/${item.claim.procedureSlug}` as Route}
                  className="mt-1 inline-flex text-sm font-semibold text-brand-strong hover:underline"
                >
                  {item.claim.procedureSlug}
                </Link>
              </div>
              <span className="w-fit rounded-sm border border-line px-2 py-1 text-xs text-muted">
                {item.claim.sourceField ?? "champ non précisé"}
              </span>
            </div>

            <p className="mt-3 text-sm leading-6 text-muted">{item.claim.value}</p>
            <div className="mt-4 rounded-md border border-line bg-background p-4 text-sm">
              <p className="font-semibold">Pourquoi ce claim est dans la file</p>
              <p className="mt-2 text-muted">{item.reason}</p>
              <p className="mt-2 text-muted">Action : {item.nextAction}</p>
            </div>

            {item.claim.sourceRefs.length > 0 ? (
              <div className="mt-4">
                <p className="text-xs font-semibold uppercase tracking-[0.08em] text-muted">
                  Sources liées
                </p>
                <div className="mt-2 flex flex-wrap gap-2">
                  {item.claim.sourceRefs.map((source) => (
                    <a
                      key={`${item.claim.id}-${source.sourceId}-${source.documentId ?? source.url}`}
                      href={source.url}
                      target="_blank"
                      rel="noreferrer"
                      className="rounded-sm border border-line bg-background px-2 py-1 text-xs font-medium text-brand-strong hover:border-brand"
                    >
                      {source.title}
                    </a>
                  ))}
                </div>
              </div>
            ) : (
              <p className="mt-4 text-sm text-danger">Aucune source liée à ce claim.</p>
            )}

            <label className="mt-4 grid gap-2 text-sm font-semibold">
              Note locale de revue
              <textarea
                value={notes[item.claim.id] ?? ""}
                onChange={(event) => updateNote(item.claim.id, event.target.value)}
                rows={3}
                className="rounded-md border border-line bg-background p-3 font-normal"
                placeholder="Ex. source à connecter, libellé à clarifier, claim à masquer..."
              />
            </label>
          </article>
        ))}

        {visibleItems.length === 0 ? (
          <div className="rounded-md border border-line bg-surface p-6 text-sm text-muted">
            Aucun claim ne correspond aux filtres actuels.
          </div>
        ) : null}
      </section>
    </div>
  );
}
