"use client";

import { useEffect, useMemo, useState } from "react";
import {
  createSourceCandidateDraft,
  formatSourceCandidateSeedSnippet,
  type SourceCandidateDraft,
  type SourceReviewPriority,
} from "@dossierbj/core";

const storageKey = "dossierbj:source-candidates:v1";

type FormState = {
  title: string;
  module: string;
  country: string;
  authority: string;
  candidateUrl: string;
  priority: SourceReviewPriority;
  relatedProcedureSlugs: string;
  notes: string;
};

const initialFormState: FormState = {
  title: "",
  module: "DossierBJ Core",
  country: "BJ",
  authority: "",
  candidateUrl: "",
  priority: "medium",
  relatedProcedureSlugs: "",
  notes: "",
};

const splitLines = (value: string) =>
  value
    .split(/\r?\n/u)
    .map((item) => item.trim())
    .filter(Boolean);

const splitSlugs = (value: string) =>
  value
    .split(/[,;\s]+/u)
    .map((item) => item.trim())
    .filter(Boolean);

export function SourceCandidateForm() {
  const [form, setForm] = useState<FormState>(initialFormState);
  const [drafts, setDrafts] = useState<SourceCandidateDraft[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [copyStatus, setCopyStatus] = useState<string | null>(null);
  const latestDraft = drafts[0];
  const seedSnippet = useMemo(
    () => (latestDraft ? formatSourceCandidateSeedSnippet(latestDraft) : ""),
    [latestDraft],
  );

  useEffect(() => {
    const frameId = window.requestAnimationFrame(() => {
      const rawValue = window.localStorage.getItem(storageKey);

      if (!rawValue) {
        return;
      }

      try {
        const parsed = JSON.parse(rawValue) as SourceCandidateDraft[];

        if (Array.isArray(parsed)) {
          setDrafts(parsed);
        }
      } catch {
        window.localStorage.removeItem(storageKey);
      }
    });

    return () => window.cancelAnimationFrame(frameId);
  }, []);

  useEffect(() => {
    window.localStorage.setItem(storageKey, JSON.stringify(drafts));
  }, [drafts]);

  function updateField<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm((current) => ({
      ...current,
      [key]: value,
    }));
  }

  function submitCandidate(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setCopyStatus(null);

    try {
      const draft = createSourceCandidateDraft({
        title: form.title,
        module: form.module,
        country: form.country,
        authority: form.authority,
        candidateUrl: form.candidateUrl,
        priority: form.priority,
        relatedProcedureSlugs: splitSlugs(form.relatedProcedureSlugs),
        notes: splitLines(form.notes),
      });

      setDrafts((current) => [draft, ...current.filter((item) => item.id !== draft.id)]);
      setForm(initialFormState);
    } catch {
      setError("Vérifiez les champs obligatoires et l'URL candidate.");
    }
  }

  async function copySnippet() {
    if (!seedSnippet) {
      return;
    }

    try {
      await window.navigator.clipboard.writeText(seedSnippet);
      setCopyStatus("JSON copié localement.");
    } catch {
      setCopyStatus("Copie indisponible dans ce navigateur. Sélectionnez le JSON manuellement.");
    }
  }

  function clearDrafts() {
    setDrafts([]);
    setCopyStatus(null);
    window.localStorage.removeItem(storageKey);
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[minmax(0,0.95fr)_minmax(0,1.05fr)]">
      <form onSubmit={submitCandidate} className="rounded-md border border-line bg-surface p-5">
        <h2 className="text-xl font-semibold">Proposer une source</h2>
        <p className="mt-2 text-sm leading-6 text-muted">
          La proposition reste locale au navigateur. Elle ne rend aucune information officielle et
          doit être revue avant intégration dans le registre.
        </p>

        <div className="mt-5 grid gap-4">
          <label className="grid gap-2 text-sm font-semibold">
            Titre
            <input
              value={form.title}
              onChange={(event) => updateField("title", event.target.value)}
              className="min-h-11 rounded-md border border-line bg-background px-3 font-normal"
              placeholder="Ex. Portail service-public RCCM"
            />
          </label>
          <label className="grid gap-2 text-sm font-semibold">
            Autorité
            <input
              value={form.authority}
              onChange={(event) => updateField("authority", event.target.value)}
              className="min-h-11 rounded-md border border-line bg-background px-3 font-normal"
              placeholder="Institution responsable"
            />
          </label>
          <label className="grid gap-2 text-sm font-semibold">
            URL candidate
            <input
              value={form.candidateUrl}
              onChange={(event) => updateField("candidateUrl", event.target.value)}
              className="min-h-11 rounded-md border border-line bg-background px-3 font-normal"
              placeholder="https://..."
            />
          </label>
          <div className="grid gap-4 sm:grid-cols-3">
            <label className="grid gap-2 text-sm font-semibold">
              Module
              <input
                value={form.module}
                onChange={(event) => updateField("module", event.target.value)}
                className="min-h-11 rounded-md border border-line bg-background px-3 font-normal"
              />
            </label>
            <label className="grid gap-2 text-sm font-semibold">
              Pays
              <input
                value={form.country}
                onChange={(event) => updateField("country", event.target.value)}
                className="min-h-11 rounded-md border border-line bg-background px-3 font-normal"
              />
            </label>
            <label className="grid gap-2 text-sm font-semibold">
              Priorité
              <select
                value={form.priority}
                onChange={(event) =>
                  updateField("priority", event.target.value as SourceReviewPriority)
                }
                className="min-h-11 rounded-md border border-line bg-background px-3 font-normal"
              >
                <option value="high">Haute</option>
                <option value="medium">Moyenne</option>
                <option value="low">Basse</option>
              </select>
            </label>
          </div>
          <label className="grid gap-2 text-sm font-semibold">
            Slugs de démarches liées
            <input
              value={form.relatedProcedureSlugs}
              onChange={(event) => updateField("relatedProcedureSlugs", event.target.value)}
              className="min-h-11 rounded-md border border-line bg-background px-3 font-normal"
              placeholder="creation-entreprise, rccm"
            />
          </label>
          <label className="grid gap-2 text-sm font-semibold">
            Notes de revue
            <textarea
              value={form.notes}
              onChange={(event) => updateField("notes", event.target.value)}
              rows={5}
              className="rounded-md border border-line bg-background p-3 font-normal"
              placeholder="Une note par ligne"
            />
          </label>
        </div>

        {error ? <p className="mt-3 text-sm text-danger">{error}</p> : null}

        <button
          type="submit"
          className="mt-5 min-h-11 w-full rounded-md bg-brand px-4 font-semibold text-white hover:bg-brand-strong"
        >
          Générer la proposition locale
        </button>
      </form>

      <section className="rounded-md border border-line bg-surface p-5">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <h2 className="text-xl font-semibold">Brouillons locaux</h2>
            <p className="mt-2 text-sm leading-6 text-muted">
              Copiez le JSON après revue humaine, puis intégrez-le dans le registre source.
            </p>
          </div>
          <span className="w-fit rounded-sm bg-background px-2 py-1 text-xs font-semibold text-muted">
            {drafts.length} brouillon(s)
          </span>
        </div>

        {latestDraft ? (
          <div className="mt-5">
            <textarea
              readOnly
              value={seedSnippet}
              rows={16}
              className="w-full rounded-md border border-line bg-background p-3 font-mono text-xs"
            />
            <div className="mt-3 flex flex-wrap gap-3">
              <button
                type="button"
                onClick={copySnippet}
                className="min-h-10 rounded-md border border-brand px-3 text-sm font-semibold text-brand-strong hover:bg-[#e6f2ec]"
              >
                Copier le JSON
              </button>
              <button
                type="button"
                onClick={clearDrafts}
                className="min-h-10 rounded-md border border-line px-3 text-sm font-semibold text-muted hover:border-brand"
              >
                Effacer les brouillons
              </button>
            </div>
            {copyStatus ? <p className="mt-3 text-sm text-brand-strong">{copyStatus}</p> : null}
          </div>
        ) : (
          <p className="mt-5 text-sm leading-6 text-muted">
            Aucun brouillon local. Remplissez le formulaire pour générer une proposition.
          </p>
        )}
      </section>
    </div>
  );
}
