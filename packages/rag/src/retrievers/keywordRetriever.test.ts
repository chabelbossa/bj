import { describe, expect, it } from "vitest";

import { mockRetriever } from "./mockRetriever";

describe("mock retriever", () => {
  it("finds demo procedure chunks by keyword", async () => {
    const results = await mockRetriever.retrieve({ question: "création entreprise" });

    expect(results.length).toBeGreaterThan(0);
    expect(results[0]?.chunk.sourceRefs.length).toBeGreaterThan(0);
  });

  it("matches singular and plural normalized terms", async () => {
    const results = await mockRetriever.retrieve({ question: "documents entreprise" });

    expect(results.length).toBeGreaterThan(0);
    expect(results[0]?.matchedTerms).toContain("entreprise");
  });

  it("returns no result for unrelated questions", async () => {
    const results = await mockRetriever.retrieve({ question: "permis spatial intergalactique" });

    expect(results).toEqual([]);
  });
});
