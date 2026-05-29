import { createCivicRag, createKeywordRetriever, resolveAiProvider } from "@dossierbj/rag";
import { afterAll, beforeAll, describe, expect, it } from "vitest";

import {
  getAssistantQueryCount,
  getClaimCoverageData,
  getDataHealth,
  getProcedureClaimsBySlug,
  getProcedureBySlug,
  listSourceChunks,
  saveAssistantQuery,
  searchProcedureData,
} from "./repository";

const describePostgres = process.env.RUN_POSTGRES_TESTS === "true" ? describe : describe.skip;

const previousDataMode = process.env.DATA_MODE;
const previousAiProvider = process.env.AI_PROVIDER;

describePostgres("postgres repository integration", () => {
  beforeAll(() => {
    process.env.DATA_MODE = "postgres";
    process.env.AI_PROVIDER = "mock";
  });

  afterAll(() => {
    if (previousDataMode === undefined) {
      delete process.env.DATA_MODE;
    } else {
      process.env.DATA_MODE = previousDataMode;
    }

    if (previousAiProvider === undefined) {
      delete process.env.AI_PROVIDER;
    } else {
      process.env.AI_PROVIDER = previousAiProvider;
    }
  });

  it("reads procedures and search results from Postgres", async () => {
    const [health, procedure, results, claims, coverage] = await Promise.all([
      getDataHealth(),
      getProcedureBySlug("creation-entreprise"),
      searchProcedureData({ query: "casier judiciaire" }),
      getProcedureClaimsBySlug("creation-entreprise"),
      getClaimCoverageData(),
    ]);

    expect(health.dataMode).toBe("postgres");
    expect(health.database.active).toBe(true);
    expect(health.database.reachable).toBe(true);
    expect(procedure?.slug).toBe("creation-entreprise");
    expect(results.some((result) => result.procedure.slug === "casier-judiciaire")).toBe(true);
    expect(claims.some((claim) => claim.type === "cost" && claim.sourceRefs.length > 0)).toBe(true);
    expect(coverage.total).toBeGreaterThan(claims.length);
  });

  it("answers with citations from Postgres chunks and persists the assistant query", async () => {
    const chunks = await listSourceChunks();
    const beforeCount = await getAssistantQueryCount();
    const answer = await createCivicRag({
      retriever: createKeywordRetriever(chunks),
      provider: resolveAiProvider({ AI_PROVIDER: "mock" }),
    }).answerQuestion({ question: "Quels sont les frais du RCCM ?" });

    expect(chunks.length).toBeGreaterThan(0);
    expect(answer.citations.length).toBeGreaterThan(0);
    expect(answer.disclaimer).toContain("indépendante");

    await saveAssistantQuery({
      question: "Quels sont les frais du RCCM ?",
      answer,
    });

    await expect(getAssistantQueryCount()).resolves.toBe(beforeCount + 1);
  });
});
