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
    expect(items.some((item) => item.status === "to_connect")).toBe(true);
  });

  it("summarizes source review status", () => {
    const summary = getSourceReviewSummary();

    expect(summary.total).toBeGreaterThan(0);
    expect(summary.toConnect).toBeGreaterThan(0);
    expect(summary.verified).toBeGreaterThan(0);
    expect(summary.needsHumanReview).toBeGreaterThan(0);
  });

  it("exposes official and demo sources separately", () => {
    const sources = getOfficialSources();

    expect(sources.some((source) => source.sourceType === "official")).toBe(true);
    expect(sources.some((source) => source.sourceType === "demo")).toBe(true);
  });

  it("computes manual ingestion readiness for local source management", () => {
    const verifiedItem = getSourceReviewItems().find((item) => item.status === "verified");
    const toConnectItem = getSourceReviewItems().find((item) => item.status === "to_connect");

    expect(verifiedItem).toBeDefined();
    expect(toConnectItem).toBeDefined();

    if (verifiedItem && toConnectItem) {
      expect(getManualIngestionReadiness(verifiedItem).readyForVerifiedStatus).toBe(true);
      expect(getManualIngestionReadiness(toConnectItem).readyForVerifiedStatus).toBe(false);
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
