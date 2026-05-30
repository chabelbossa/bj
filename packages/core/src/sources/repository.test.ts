import { describe, expect, it } from "vitest";

import {
  createSourceCandidateDraft,
  formatSourceCandidateSeedSnippet,
  getManualIngestionReadiness,
} from "./manualIngestion";
import { getOfficialSources, getSourceReviewItems, getSourceReviewSummary } from "./repository";

describe("source review repository", () => {
  it("exposes local source review items for the MVP back-office", () => {
    const items = getSourceReviewItems();

    expect(items.length).toBeGreaterThan(0);
    expect(items.some((item) => item.status === "verified")).toBe(true);
    expect(items.some((item) => item.status === "needs_human_review")).toBe(true);
  });

  it("summarizes source review status", () => {
    const summary = getSourceReviewSummary();

    expect(summary.total).toBeGreaterThan(0);
    expect(summary.toConnect).toBe(0);
    expect(summary.verified).toBeGreaterThan(0);
    expect(summary.needsHumanReview).toBeGreaterThan(0);
  });

  it("exposes official sources in the active catalog", () => {
    const sources = getOfficialSources();

    expect(sources.some((source) => source.sourceType === "official")).toBe(true);
    expect(sources.some((source) => source.sourceType === "demo")).toBe(false);
  });

  it("computes manual ingestion readiness for local source management", () => {
    const verifiedItem = getSourceReviewItems().find((item) => item.status === "verified");
    const reviewItem = getSourceReviewItems().find((item) => item.status === "needs_human_review");

    expect(verifiedItem).toBeDefined();
    expect(reviewItem).toBeDefined();

    if (verifiedItem && reviewItem) {
      expect(getManualIngestionReadiness(verifiedItem).readyForVerifiedStatus).toBe(true);
      expect(getManualIngestionReadiness(reviewItem).readyForVerifiedStatus).toBe(false);
    }
  });

  it("creates local source candidate drafts for manual review", () => {
    const draft = createSourceCandidateDraft({
      title: "Portail test",
      module: "DossierBJ Core",
      country: "bj",
      authority: "Institution test",
      candidateUrl: "https://example.org/source",
      priority: "medium",
      relatedProcedureSlugs: ["creation-entreprise"],
      notes: ["À lire manuellement"],
      createdAt: "2026-05-19",
    });
    const snippet = formatSourceCandidateSeedSnippet(draft);

    expect(draft.id).toContain("source-candidate-portail-test");
    expect(draft.country).toBe("BJ");
    expect(snippet).toContain('"status": "to_connect"');
  });
});
