import { describe, expect, it } from "vitest";

import { mockRetriever } from "../retrievers/mockRetriever";
import {
  assertGroundedAnswerPolicy,
  createGroundedAnswerFromResults,
  createNoSourceAnswer,
  INDEPENDENT_PLATFORM_DISCLAIMER,
} from "./groundingPolicy";

describe("grounding policy", () => {
  it("returns a cautious answer when no source is found", () => {
    const answer = createNoSourceAnswer("Quel est le coût ?");

    expect(answer.confidence).toBe("low");
    expect(answer.citations).toEqual([]);
    expect(answer.disclaimer).toBe(INDEPENDENT_PLATFORM_DISCLAIMER);
    expect(answer.answer).toContain("pas trouvé");
  });

  it("requires citations for grounded administrative answers", () => {
    expect(() =>
      assertGroundedAnswerPolicy({
        answer: "Une affirmation administrative.",
        citations: [],
        confidence: "medium",
        missingInfo: [],
        disclaimer: INDEPENDENT_PLATFORM_DISCLAIMER,
        suggestedOfficialVerification: "Vérifiez la source officielle.",
      }),
    ).toThrow("citations");
  });

  it("formats citations from retrieval results", async () => {
    const results = await mockRetriever.retrieve({ question: "casier judiciaire" });
    const answer = createGroundedAnswerFromResults("casier judiciaire", results);

    expect(answer.citations.length).toBeGreaterThan(0);
    expect(answer.citations[0]?.url).toMatch(/^https:\/\//);
    expect(answer.confidence).toBe("medium");
    expect(answer.answer).toContain("Casier judiciaire");
    expect(answer.missingInfo).toContain("Validation humaine avant usage administratif critique");
  });

  it("can answer from partially verified source-backed procedure data", async () => {
    const results = await mockRetriever.retrieve({ question: "coût création entreprise" });
    const answer = createGroundedAnswerFromResults("coût création entreprise", results);

    expect(answer.answer).toContain("montants explicitement présents");
    expect(answer.answer).toContain("Coûts visibles");
    expect(answer.confidence).toBe("medium");
    expect(answer.citations.some((citation) => citation.url.includes("monentreprise.bj"))).toBe(
      true,
    );
  });

  it("does not confirm costs from demo-only results", async () => {
    const results = (
      await mockRetriever.retrieve({ question: "attestation administrative", maxResults: 10 })
    ).filter((result) => result.chunk.metadata.demo === true);
    const answer = createGroundedAnswerFromResults("coût attestation administrative", results);

    expect(results.length).toBeGreaterThan(0);
    expect(answer.answer).toContain("frais ne sont pas confirmés");
    expect(answer.confidence).toBe("low");
  });

  it("keeps a citations array even when no source is available", () => {
    const answer = createGroundedAnswerFromResults("question sans source", []);

    expect(Array.isArray(answer.citations)).toBe(true);
    expect(answer.citations).toHaveLength(0);
    expect(answer.suggestedOfficialVerification).toContain("officielle");
  });
});
