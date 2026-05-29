import { describe, expect, it } from "vitest";

import { demoProcedures } from "../seed";
import { createProcedureClaims, getProcedureClaimsBySlug, summarizeClaimCoverage } from "./claims";

describe("procedure claims", () => {
  it("creates explicit claims for priority procedures", () => {
    const claims = getProcedureClaimsBySlug("creation-entreprise");

    expect(claims.length).toBeGreaterThan(0);
    expect(claims.some((claim) => claim.type === "cost")).toBe(true);
    expect(claims.some((claim) => claim.type === "duration")).toBe(true);
    expect(claims.every((claim) => claim.procedureSlug === "creation-entreprise")).toBe(true);
  });

  it("keeps verified and partially verified claims sourced", () => {
    const claims = createProcedureClaims(demoProcedures);
    const sourcedClaims = claims.filter(
      (claim) => claim.status === "verified" || claim.status === "partially_verified",
    );

    expect(sourcedClaims.length).toBeGreaterThan(0);
    expect(sourcedClaims.every((claim) => claim.sourceRefs.length > 0)).toBe(true);
  });

  it("marks unconfirmed fees and durations as unverified", () => {
    const rccmClaims = getProcedureClaimsBySlug("rccm");

    expect(rccmClaims.find((claim) => claim.sourceField === "officialCost")?.status).toBe(
      "unverified",
    );
    expect(rccmClaims.find((claim) => claim.sourceField === "estimatedDuration")?.status).toBe(
      "unverified",
    );
  });

  it("summarizes claim coverage for source review", () => {
    const claims = createProcedureClaims(demoProcedures);
    const coverage = summarizeClaimCoverage(claims);

    expect(coverage.total).toBe(claims.length);
    expect(coverage.sourceCoveragePercent).toBeGreaterThan(0);
    expect(coverage.unverifiedCritical).toBeGreaterThan(0);
    expect(coverage.byProcedure.some((item) => item.procedureSlug === "creation-entreprise")).toBe(
      true,
    );
  });
});
