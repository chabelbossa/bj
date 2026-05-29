import { describe, expect, it } from "vitest";

import type { ProcedureClaim } from "../schemas";
import { createClaimReviewBacklog, summarizeClaimReviewBacklog } from "./claimReview";

const baseClaim = {
  id: "claim-1",
  procedureId: "procedure-1",
  procedureSlug: "procedure-demo",
  label: "Frais",
  value: "Information non confirmée",
  sourceRefs: [],
  sourceField: "officialCost",
} satisfies Omit<ProcedureClaim, "type" | "status">;

describe("claim review backlog", () => {
  it("prioritizes critical unsourced claims first", () => {
    const backlog = createClaimReviewBacklog([
      {
        ...baseClaim,
        id: "claim-low",
        type: "general",
        status: "verified",
        sourceRefs: [
          {
            sourceId: "source-demo",
            url: "https://example.org/source",
            title: "Source demo",
            retrievedAt: "2026-05-19",
          },
        ],
      },
      {
        ...baseClaim,
        id: "claim-critical",
        type: "cost",
        status: "unverified",
      },
    ]);

    expect(backlog[0]?.claim.id).toBe("claim-critical");
    expect(backlog[0]?.priority).toBe("critical");
    expect(backlog[0]?.needsCitation).toBe(true);
  });

  it("summarizes review work for editorial screens", () => {
    const backlog = createClaimReviewBacklog([
      {
        ...baseClaim,
        id: "claim-critical",
        type: "required_document",
        status: "unverified",
      },
      {
        ...baseClaim,
        id: "claim-medium",
        type: "duration",
        status: "partially_verified",
        sourceRefs: [
          {
            sourceId: "source-demo",
            url: "https://example.org/source",
            title: "Source demo",
            retrievedAt: "2026-05-19",
          },
        ],
      },
    ]);
    const summary = summarizeClaimReviewBacklog(backlog);

    expect(summary.total).toBe(2);
    expect(summary.critical).toBe(1);
    expect(summary.medium).toBe(1);
    expect(summary.needsHumanReview).toBe(2);
  });
});
