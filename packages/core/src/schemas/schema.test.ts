import { describe, expect, it } from "vitest";

import {
  demoOfficialSource,
  demoProcedures,
  demoSourceDocument,
  demoSourceReviewItems,
  officialSources,
  pilotOpportunities,
  sourceDocuments,
} from "../seed";
import {
  assistantAnswerSchema,
  checklistSchema,
  officialSourceSchema,
  opportunitySchema,
  procedureSchema,
  sourceDocumentSchema,
  sourceReviewItemSchema,
  sourceReferenceSchema,
} from "./index";

describe("core schemas", () => {
  it("validates seeded procedures", () => {
    for (const procedure of demoProcedures) {
      expect(() => procedureSchema.parse(procedure)).not.toThrow();
      expect(procedure.verifiedFacts.length).toBeGreaterThan(0);
    }

    expect(
      demoProcedures.some((procedure) => procedure.verificationStatus === "partially_verified"),
    ).toBe(true);
    expect(
      demoProcedures.every((procedure) => procedure.verificationStatus !== "demo_unverified"),
    ).toBe(true);
  });

  it("validates demo source metadata without pretending it is official", () => {
    expect(() => officialSourceSchema.parse(demoOfficialSource)).not.toThrow();
    expect(() => sourceDocumentSchema.parse(demoSourceDocument)).not.toThrow();
    expect(demoOfficialSource.sourceType).toBe("demo");
    expect(demoOfficialSource.url).toContain("example.org");
  });

  it("validates connected official source metadata", () => {
    for (const source of officialSources) {
      expect(() => officialSourceSchema.parse(source)).not.toThrow();
    }

    for (const document of sourceDocuments) {
      expect(() => sourceDocumentSchema.parse(document)).not.toThrow();
    }

    expect(officialSources.some((source) => source.sourceType === "official")).toBe(true);
  });

  it("validates the local source review queue", () => {
    for (const item of demoSourceReviewItems) {
      expect(() => sourceReviewItemSchema.parse(item)).not.toThrow();
    }

    expect(demoSourceReviewItems.some((item) => item.status === "verified")).toBe(true);
    expect(demoSourceReviewItems.some((item) => item.status === "needs_human_review")).toBe(true);
    expect(
      demoSourceReviewItems
        .filter((item) => item.status === "verified")
        .every((item) => !item.candidateUrl.includes("example.org")),
    ).toBe(true);
  });

  it("requires valid citation URLs", () => {
    const result = sourceReferenceSchema.safeParse({
      sourceId: "source",
      url: "not-a-url",
      title: "Broken source",
      retrievedAt: "2026-05-19",
    });

    expect(result.success).toBe(false);
  });

  it("validates assistant answers with citations and confidence", () => {
    const firstSource = demoProcedures[0]?.sources[0];

    expect(firstSource).toBeDefined();

    const result = assistantAnswerSchema.safeParse({
      answer: "Réponse demo.",
      citations: firstSource ? [firstSource] : [],
      confidence: "low",
      missingInfo: ["Source officielle complète"],
      safetyNotice: "Cette plateforme est indépendante.",
    });

    expect(result.success).toBe(true);
  });

  it("validates future checklist and opportunity models", () => {
    const firstProcedure = demoProcedures[0];
    const firstSource = firstProcedure?.sources[0];
    const firstDocument = firstProcedure?.requiredDocuments[0];

    expect(firstProcedure).toBeDefined();
    expect(firstSource).toBeDefined();
    expect(firstDocument).toBeDefined();

    const checklistResult = checklistSchema.safeParse({
      id: "checklist-demo",
      procedureId: firstProcedure?.id,
      createdAt: "2026-05-19",
      items: [
        {
          id: "item-source-check",
          label: "Vérifier la source officielle",
          status: "todo",
          sourceRefs: firstSource ? [firstSource] : [],
        },
      ],
    });

    const opportunityResult = opportunitySchema.safeParse(pilotOpportunities[0]);

    expect(checklistResult.success).toBe(true);
    expect(opportunityResult.success).toBe(true);
  });
});
