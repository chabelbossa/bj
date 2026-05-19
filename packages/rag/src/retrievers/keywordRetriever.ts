import { includesSearchToken, tokenizeSearchText, type SourceChunk } from "@dossierbj/core";

import type { RagQuestion, RetrievalResult, Retriever } from "../types";

export const createKeywordRetriever = (chunks: SourceChunk[]): Retriever => ({
  async retrieve({ question, maxResults = 5 }: RagQuestion): Promise<RetrievalResult[]> {
    const queryTerms = new Set(tokenizeSearchText(question));

    if (queryTerms.size === 0) {
      return [];
    }

    return chunks
      .map((chunk) => {
        const matchedTerms = Array.from(queryTerms).filter((term) =>
          includesSearchToken(chunk.content, term),
        );

        return {
          chunk,
          score: matchedTerms.length / queryTerms.size,
          matchedTerms,
        };
      })
      .filter((result) => result.score > 0)
      .sort((a, b) => b.score - a.score)
      .slice(0, maxResults);
  },
});
