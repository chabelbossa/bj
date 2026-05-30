import { describe, expect, it } from "vitest";

import { mockRetriever } from "./mockRetriever";

describe("mock retriever", () => {
  it("finds source-backed procedure chunks by keyword", async () => {
    const results = await mockRetriever.retrieve({ question: "création entreprise" });

    expect(results.length).toBeGreaterThan(0);
    expect(results[0]?.chunk.metadata.slug).toBe("creation-entreprise");
    expect(results[0]?.chunk.sourceRefs.length).toBeGreaterThan(0);
  });

  it("matches singular and plural normalized terms", async () => {
    const results = await mockRetriever.retrieve({ question: "documents entreprise" });

    expect(results.length).toBeGreaterThan(0);
    expect(results[0]?.matchedTerms).toContain("entreprise");
  });

  it("prioritizes business creation for enterprise setup questions", async () => {
    const results = await mockRetriever.retrieve({
      question: "Quels documents faut-il pour créer une entreprise au Bénin ?",
    });

    expect(results[0]?.chunk.metadata.slug).toBe("creation-entreprise");
  });

  it("prioritizes the criminal record procedure for judicial record questions", async () => {
    const results = await mockRetriever.retrieve({
      question: "Comment obtenir un casier judiciaire au Bénin ?",
    });

    expect(results[0]?.chunk.metadata.slug).toBe("casier-judiciaire");
  });

  it("prioritizes the land tax clearance procedure for fiscal property questions", async () => {
    const results = await mockRetriever.retrieve({
      question: "Quel est le coût de l'attestation fiscale foncière ?",
    });

    expect(results[0]?.chunk.metadata.slug).toBe("attestation-regularite-fiscale-fonciere");
  });

  it("returns no result for unrelated questions", async () => {
    const results = await mockRetriever.retrieve({ question: "permis spatial intergalactique" });

    expect(results).toEqual([]);
  });
});
