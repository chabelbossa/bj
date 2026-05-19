import type { SourceReference } from "@dossierbj/core";

import type { GroundedAnswer, RetrievalResult } from "../types";

export const INDEPENDENT_PLATFORM_DISCLAIMER =
  "Cette plateforme est indépendante et ne remplace pas les plateformes officielles.";

export const createNoSourceAnswer = (question: string): GroundedAnswer => ({
  answer:
    "Je n'ai pas trouvé d'information pertinente dans les sources actuellement connectées. Je ne peux donc pas confirmer cette démarche, ses frais, ses délais ou ses pièces à fournir.",
  citations: [],
  confidence: "low",
  missingInfo: [
    "Source officielle pertinente",
    "Document officiel consulté",
    `Question à vérifier : ${question}`,
  ],
  disclaimer: INDEPENDENT_PLATFORM_DISCLAIMER,
  suggestedOfficialVerification:
    "Vérifiez directement l'information auprès de la plateforme officielle ou de l'institution compétente.",
});

const uniqueCitations = (results: RetrievalResult[]): SourceReference[] => {
  const citations = new Map<string, SourceReference>();

  for (const result of results) {
    for (const sourceRef of result.chunk.sourceRefs) {
      citations.set(`${sourceRef.sourceId}:${sourceRef.documentId ?? sourceRef.url}`, sourceRef);
    }
  }

  return Array.from(citations.values());
};

const summarizeMatches = (retrievalResults: RetrievalResult[]) => {
  const titles = new Set<string>();
  const matchedTerms = new Set<string>();
  const facts = new Set<string>();

  for (const result of retrievalResults) {
    if (typeof result.chunk.metadata.title === "string") {
      titles.add(result.chunk.metadata.title);
    }

    if (Array.isArray(result.chunk.metadata.facts)) {
      for (const fact of result.chunk.metadata.facts) {
        if (
          typeof fact === "object" &&
          fact !== null &&
          "label" in fact &&
          "value" in fact &&
          typeof fact.label === "string" &&
          typeof fact.value === "string"
        ) {
          facts.add(`${fact.label} : ${fact.value.replace(/[.!?]+$/u, "")}`);
        }
      }
    }

    for (const term of result.matchedTerms) {
      matchedTerms.add(term);
    }
  }

  return {
    titles: Array.from(titles).slice(0, 3),
    matchedTerms: Array.from(matchedTerms).slice(0, 6),
    facts: Array.from(facts).slice(0, 3),
  };
};

const inferQuestionFocus = (question: string, hasOnlyDemoResults: boolean) => {
  const normalized = question.toLowerCase();

  if (/(frais|cout|coût|payer|tarif)/u.test(normalized)) {
    return hasOnlyDemoResults
      ? "Les frais ne sont pas confirmés dans les sources demo."
      : "Pour les frais, je reprends seulement les montants explicitement présents dans les sources citées.";
  }

  if (/(delai|délai|temps|jour|semaine)/u.test(normalized)) {
    return hasOnlyDemoResults
      ? "Les délais ne sont pas confirmés dans les sources demo."
      : "Pour les délais, je distingue les délais sourcés des délais encore à vérifier.";
  }

  if (/(piece|pièce|document|papier)/u.test(normalized)) {
    return hasOnlyDemoResults
      ? "La liste officielle des pièces n'est pas confirmée dans les sources demo."
      : "Pour les pièces, je ne généralise pas au-delà du périmètre indiqué par les sources citées.";
  }

  return "La réponse reste limitée aux éléments de préparation et de vérification.";
};

export const createGroundedAnswerFromResults = (
  question: string,
  retrievalResults: RetrievalResult[],
): GroundedAnswer => {
  if (retrievalResults.length === 0) {
    return createNoSourceAnswer(question);
  }

  const bestResult = retrievalResults[0];
  const focusThreshold = Math.max((bestResult?.score ?? 0) - 0.2, (bestResult?.score ?? 0) * 0.75);
  const focusedResults = retrievalResults.filter((result) => result.score >= focusThreshold);
  const citations = uniqueCitations(focusedResults);
  const summary = summarizeMatches(focusedResults);
  const hasOnlyDemoResults = focusedResults.every(
    (result) =>
      result.chunk.metadata.demo === true ||
      result.chunk.metadata.verificationStatus === "demo_unverified",
  );
  const hasVerifiedResult = focusedResults.some(
    (result) => result.chunk.metadata.verificationStatus === "verified",
  );
  const hasPartiallyVerifiedResult = focusedResults.some(
    (result) => result.chunk.metadata.verificationStatus === "partially_verified",
  );
  const confidence =
    hasVerifiedResult && bestResult && bestResult.score >= 0.6
      ? "high"
      : hasPartiallyVerifiedResult && bestResult && bestResult.score >= 0.25
        ? "medium"
        : "low";
  const missingInfo = hasOnlyDemoResults
    ? ["Pièces officielles validées", "Frais officiels confirmés", "Délais officiels confirmés"]
    : [
        "Cas particuliers non couverts par les sources connectées",
        "Mise à jour à revérifier sur la plateforme officielle",
        "Validation humaine avant usage administratif critique",
      ];

  return {
    answer: [
      summary.titles.length > 0
        ? hasOnlyDemoResults
          ? `J'ai trouvé une correspondance demo avec : ${summary.titles.join(", ")}.`
          : `J'ai trouvé une correspondance sourcée avec : ${summary.titles.join(", ")}.`
        : "J'ai trouvé une correspondance dans les sources connectées.",
      inferQuestionFocus(question, hasOnlyDemoResults),
      summary.facts.length > 0 ? `Éléments disponibles : ${summary.facts.join(" ; ")}.` : "",
      "Utilisez cette réponse uniquement pour préparer les vérifications : source officielle, pièces, frais, délais et canal de dépôt.",
    ]
      .filter(Boolean)
      .join(" "),
    citations,
    confidence,
    missingInfo,
    disclaimer: INDEPENDENT_PLATFORM_DISCLAIMER,
    suggestedOfficialVerification:
      "Avant toute décision, consultez la plateforme officielle ou contactez l'institution compétente.",
  };
};

export const assertGroundedAnswerPolicy = (answer: GroundedAnswer) => {
  const claimsInformation = !answer.answer.includes("pas trouvé d'information pertinente");

  if (claimsInformation && answer.citations.length === 0) {
    throw new Error("Grounded answers that make administrative claims must include citations.");
  }

  if (!answer.disclaimer.includes("indépendante")) {
    throw new Error("Grounded answers must include the independent platform disclaimer.");
  }

  return answer;
};
