import {
  includesSearchToken,
  normalizeText,
  tokenizeSearchText,
  type SourceChunk,
} from "@dossierbj/core";

import type { RagQuestion, RetrievalResult, Retriever } from "../types";

const ASSISTANT_STOP_WORDS = new Set([
  "avoir",
  "benin",
  "besoin",
  "chez",
  "concret",
  "donner",
  "faire",
  "faut",
  "liste",
  "obtenir",
  "peux",
  "pouvez",
  "preparer",
  "savoir",
  "veux",
]);

const QUERY_EXPANSIONS: Record<string, string[]> = {
  apiex: ["apiex", "monentreprise", "entreprise", "creation"],
  b3: ["b3", "casier", "judiciaire"],
  cip: ["cip", "identification", "personnelle"],
  commerce: ["commerce", "rccm", "registre"],
  creer: ["creer", "creation"],
  creation: ["creation", "creer"],
  entreprise: ["entreprise"],
  extrait: ["extrait", "rccm", "casier"],
  fiscal: ["fiscal", "fiscale"],
  fiscale: ["fiscal", "fiscale"],
  foncier: ["foncier", "fonciere"],
  fonciere: ["foncier", "fonciere"],
  immatriculation: ["immatriculation", "rccm"],
  judiciaire: ["judiciaire", "casier"],
  monentreprise: ["monentreprise", "entreprise", "creation"],
  registre: ["registre", "rccm", "commerce"],
  rccm: ["rccm", "registre", "commerce"],
  societe: ["societe", "entreprise", "creation"],
};

const getStringMetadata = (chunk: SourceChunk, key: string) => {
  const value = chunk.metadata[key];

  return typeof value === "string" ? value : "";
};

const getStringArrayMetadata = (chunk: SourceChunk, key: string) => {
  const value = chunk.metadata[key];

  return Array.isArray(value)
    ? value.filter((item): item is string => typeof item === "string")
    : [];
};

const buildQueryTerms = (question: string) => {
  const baseTerms = tokenizeSearchText(question).filter((term) => !ASSISTANT_STOP_WORDS.has(term));
  const expandedTerms = new Set<string>();

  for (const term of baseTerms) {
    const expansions = QUERY_EXPANSIONS[term] ?? [term];

    for (const expansion of expansions) {
      expandedTerms.add(expansion);
    }
  }

  return Array.from(expandedTerms);
};

const scoreText = (text: string, queryTerms: string[], weight: number) => {
  const matchedTerms = queryTerms.filter((term) => includesSearchToken(text, term));

  return {
    score: matchedTerms.length * weight,
    matchedTerms,
  };
};

const scoreChunk = (chunk: SourceChunk, queryTerms: string[]) => {
  const title = getStringMetadata(chunk, "title");
  const slug = getStringMetadata(chunk, "slug").replace(/-/gu, " ");
  const category = getStringMetadata(chunk, "category");
  const aliases = getStringArrayMetadata(chunk, "aliases").join(" ");
  const sourceTitles = chunk.sourceRefs.map((sourceRef) => sourceRef.title).join(" ");
  const weightedTexts = [
    { text: title, weight: 8 },
    { text: slug, weight: 6 },
    { text: aliases, weight: 4 },
    { text: category, weight: 2 },
    { text: sourceTitles, weight: 2 },
    { text: chunk.content, weight: 1 },
  ];
  const matchedTerms = new Set<string>();
  let rawScore = 0;

  for (const { text, weight } of weightedTexts) {
    const weightedScore = scoreText(text, queryTerms, weight);
    rawScore += weightedScore.score;

    for (const term of weightedScore.matchedTerms) {
      matchedTerms.add(term);
    }
  }

  const normalizedQuestionTerms = normalizeText(queryTerms.join(" "));
  const normalizedTitle = normalizeText(title);

  if (normalizedTitle && normalizedQuestionTerms.includes(normalizedTitle)) {
    rawScore += 6;
  }

  return {
    score: rawScore / Math.max(queryTerms.length, 1),
    matchedTerms: Array.from(matchedTerms),
  };
};

export const createKeywordRetriever = (chunks: SourceChunk[]): Retriever => ({
  async retrieve({ question, maxResults = 5 }: RagQuestion): Promise<RetrievalResult[]> {
    const queryTerms = buildQueryTerms(question);

    if (queryTerms.length === 0) {
      return [];
    }

    return chunks
      .map((chunk) => {
        const { score, matchedTerms } = scoreChunk(chunk, queryTerms);

        return {
          chunk,
          score,
          matchedTerms,
        };
      })
      .filter((result) => result.score > 0)
      .sort((a, b) => b.score - a.score || a.chunk.position - b.chunk.position)
      .slice(0, maxResults);
  },
});
