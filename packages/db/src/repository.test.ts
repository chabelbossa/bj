import { afterEach, beforeEach, describe, expect, it } from "vitest";

import {
  getClaimCoverageData,
  getDataHealth,
  getProcedureClaimsBySlug,
  getProcedureBySlug,
  getProcedureFilterData,
  getSourceReviewEventsByItemId,
  getSourceValidationData,
  listSourceChunks,
  listSourceReviewItems,
  saveAssistantQuery,
  searchProcedureData,
} from "./repository";

const previousDataMode = process.env.DATA_MODE;
const previousDatabaseUrl = process.env.DATABASE_URL;

beforeEach(() => {
  process.env.DATA_MODE = "mock";
  delete process.env.DATABASE_URL;
});

afterEach(() => {
  if (previousDataMode === undefined) {
    delete process.env.DATA_MODE;
  } else {
    process.env.DATA_MODE = previousDataMode;
  }

  if (previousDatabaseUrl === undefined) {
    delete process.env.DATABASE_URL;
  } else {
    process.env.DATABASE_URL = previousDatabaseUrl;
  }
});

describe("data repository", () => {
  it("serves procedures from mock mode by default", async () => {
    const procedure = await getProcedureBySlug("creation-entreprise");
    const results = await searchProcedureData({ query: "coût création entreprise" });
    const filters = await getProcedureFilterData();

    expect(procedure?.slug).toBe("creation-entreprise");
    expect(results[0]?.procedure.slug).toBe("creation-entreprise");
    expect(filters.categories).toContain("Entreprise");
  });

  it("provides source chunks for CivicRAG without Postgres", async () => {
    const [chunks, claims] = await Promise.all([
      listSourceChunks(),
      getProcedureClaimsBySlug("creation-entreprise"),
    ]);

    expect(chunks.length).toBeGreaterThan(0);
    expect(chunks[0]?.sourceRefs.length).toBeGreaterThan(0);
    expect(claims.some((claim) => claim.type === "cost")).toBe(true);
  });

  it("validates source integrity in mock mode", async () => {
    const [validation, coverage] = await Promise.all([
      getSourceValidationData(),
      getClaimCoverageData(),
    ]);

    expect(validation.summary.errors).toBe(0);
    expect(coverage.total).toBeGreaterThan(0);
    expect(coverage.byProcedure.length).toBeGreaterThan(0);
  });

  it("does not persist assistant queries in mock mode", async () => {
    await expect(
      saveAssistantQuery({
        question: "test",
        answer: {
          answer: "Réponse test",
          citations: [],
          confidence: "low",
          missingInfo: ["Source officielle"],
          disclaimer: "Cette plateforme est indépendante.",
          suggestedOfficialVerification: "Vérifiez la plateforme officielle.",
        },
      }),
    ).resolves.toBeUndefined();
  });

  it("exposes health and source reviews without requiring DATABASE_URL", async () => {
    const [health, reviews] = await Promise.all([getDataHealth(), listSourceReviewItems()]);
    const events = await getSourceReviewEventsByItemId("source-review-business-creation");

    expect(health.dataMode).toBe("mock");
    expect(health.database.active).toBe(false);
    expect(reviews.length).toBeGreaterThan(0);
    expect(events.length).toBeGreaterThan(0);
  });
});
