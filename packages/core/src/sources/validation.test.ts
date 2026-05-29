import { describe, expect, it } from "vitest";

import { demoProcedures, demoSourceReviewItems } from "../seed";
import { validateSourceIntegrity } from "./validation";

describe("source validation", () => {
  it("accepts current partially verified procedures because claims are cited", () => {
    const issues = validateSourceIntegrity();

    expect(issues.filter((issue) => issue.severity === "error")).toHaveLength(0);
  });

  it("rejects partially verified procedures without source references", () => {
    const procedure = {
      ...demoProcedures.find((item) => item.slug === "creation-entreprise")!,
      sources: [],
    };

    const issues = validateSourceIntegrity({
      procedures: [procedure],
      reviewItems: demoSourceReviewItems,
    });

    expect(issues.some((issue) => issue.id.includes("missing-procedure-sources"))).toBe(true);
  });

  it("rejects partially verified procedures without explicit claims", () => {
    const procedure = demoProcedures.find((item) => item.slug === "creation-entreprise")!;

    const issues = validateSourceIntegrity({
      procedures: [procedure],
      reviewItems: demoSourceReviewItems,
      claims: [],
    });

    expect(issues.some((issue) => issue.id.includes("missing-claims"))).toBe(true);
  });
});
