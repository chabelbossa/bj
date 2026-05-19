import { describe, expect, it } from "vitest";

import { getProcedureCategories, getProcedureTargetUsers, searchProcedures } from "./repository";

describe("procedure search", () => {
  it("ranks procedure aliases and normalized terms", () => {
    const results = searchProcedures({ query: "registre commerce" });

    expect(results[0]?.procedure.slug).toBe("rccm");
    expect(results[0]?.matchedFields.join(" ")).toContain("alias");
  });

  it("filters by category and target user", () => {
    const results = searchProcedures({
      category: "Entreprise",
      targetUser: "PME",
    });

    expect(results.length).toBeGreaterThan(0);
    expect(results.every((result) => result.procedure.category === "Entreprise")).toBe(true);
    expect(results.every((result) => result.procedure.targetUsers.includes("PME"))).toBe(true);
  });

  it("filters partially verified procedures", () => {
    const results = searchProcedures({
      verificationStatus: "partially_verified",
    });

    expect(results.length).toBeGreaterThan(0);
    expect(
      results.every((result) => result.procedure.verificationStatus === "partially_verified"),
    ).toBe(true);
  });

  it("returns useful filter values", () => {
    expect(getProcedureCategories()).toContain("Entreprise");
    expect(getProcedureTargetUsers()).toContain("Diaspora");
  });
});
