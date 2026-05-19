"use client";

import { useState } from "react";
import type { GroundedAnswer } from "@dossierbj/rag";

import { ConfidenceBadge } from "@/components/ui/ConfidenceBadge";
import { CitationList } from "@/components/source/CitationList";

const defaultQuestion = "Quelles informations vérifier pour une création d'entreprise ?";

const suggestedQuestions = [
  "Quels frais dois-je vérifier ?",
  "Quelles pièces ne sont pas confirmées ?",
  "Comment préparer une checklist prudente ?",
];

export function AssistantPanel({
  initialQuestion = defaultQuestion,
}: {
  initialQuestion?: string;
}) {
  const [question, setQuestion] = useState(initialQuestion);
  const [answer, setAnswer] = useState<GroundedAnswer | null>(null);
  const [status, setStatus] = useState<"idle" | "loading" | "error">("idle");

  async function submitQuestion(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("loading");

    try {
      const response = await fetch("/api/assistant", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ question }),
      });

      if (!response.ok) {
        throw new Error("Assistant request failed");
      }

      setAnswer((await response.json()) as GroundedAnswer);
      setStatus("idle");
    } catch {
      setStatus("error");
    }
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[minmax(0,0.85fr)_minmax(0,1.15fr)]">
      <form onSubmit={submitQuestion} className="rounded-md border border-line bg-surface p-5">
        <label className="block text-sm font-semibold" htmlFor="assistant-question">
          Votre question
        </label>
        <textarea
          id="assistant-question"
          value={question}
          onChange={(event) => setQuestion(event.target.value)}
          rows={7}
          className="mt-3 w-full rounded-md border border-line bg-background p-3 text-base outline-none focus:border-brand focus:ring-2 focus:ring-brand/20"
        />
        <button
          type="submit"
          disabled={status === "loading" || question.trim().length === 0}
          className="mt-4 min-h-11 w-full rounded-md bg-brand px-4 font-semibold text-white hover:bg-brand-strong disabled:cursor-not-allowed disabled:opacity-60"
        >
          {status === "loading" ? "Recherche dans les sources..." : "Poser la question"}
        </button>
        {status === "error" ? (
          <p className="mt-3 text-sm text-danger">Impossible d&apos;obtenir une réponse mockée.</p>
        ) : null}
        <div className="mt-5 space-y-2">
          <p className="text-xs font-semibold uppercase tracking-[0.08em] text-muted">
            Questions utiles
          </p>
          <div className="flex flex-wrap gap-2">
            {suggestedQuestions.map((suggestion) => (
              <button
                key={suggestion}
                type="button"
                onClick={() => setQuestion(suggestion)}
                className="rounded-md border border-line px-3 py-2 text-left text-xs text-brand-strong hover:border-brand"
              >
                {suggestion}
              </button>
            ))}
          </div>
        </div>
      </form>

      <section className="rounded-md border border-line bg-surface p-5" aria-live="polite">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h2 className="text-lg font-semibold">Réponse CivicRAG</h2>
          {answer ? <ConfidenceBadge confidence={answer.confidence} /> : null}
        </div>
        {answer ? (
          <div className="mt-4 space-y-5">
            <p className="leading-7">{answer.answer}</p>
            <div>
              <h3 className="mb-3 text-sm font-semibold">Citations</h3>
              <CitationList citations={answer.citations} />
            </div>
            <div>
              <h3 className="text-sm font-semibold">Informations manquantes</h3>
              <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-muted">
                {answer.missingInfo.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>
            <p className="rounded-md bg-[#fff8e8] p-3 text-sm text-[#5d4318]">
              {answer.disclaimer} {answer.suggestedOfficialVerification}
            </p>
          </div>
        ) : (
          <p className="mt-4 text-sm leading-6 text-muted">
            Posez une question. Le MVP utilise un provider mock et ne fait aucun appel externe.
          </p>
        )}
      </section>
    </div>
  );
}
