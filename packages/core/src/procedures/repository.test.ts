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

  it("keeps service-public.bj details cited for casier and RCCM", () => {
    const [casier] = searchProcedures({ query: "casier judiciaire" });
    const [rccm] = searchProcedures({ query: "rccm" });

    expect(casier?.procedure.officialCost).toContain("1 900 FCFA");
    expect(casier?.procedure.estimatedDuration).toContain("72h");
    expect(
      casier?.procedure.verifiedFacts.some(
        (fact) => fact.id === "casier-fact-required-documents" && fact.sourceRefs.length > 0,
      ),
    ).toBe(true);

    expect(rccm?.procedure.officialCost).toContain("5 000 FCFA");
    expect(rccm?.procedure.estimatedDuration).toContain("Instantané en ligne");
    expect(
      rccm?.procedure.verifiedFacts.some(
        (fact) => fact.id === "rccm-fact-online-documents" && fact.sourceRefs.length > 0,
      ),
    ).toBe(true);
  });
});
