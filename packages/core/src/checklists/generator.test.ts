import { describe, expect, it } from "vitest";

import { demoProcedures } from "../seed";
import { generateProcedureChecklist, getChecklistProgress } from "./generator";

describe("checklist generator", () => {
  it("creates a cautious checklist from a seeded procedure", () => {
    const procedure = demoProcedures[0];

    expect(procedure).toBeDefined();

    const checklist = generateProcedureChecklist(procedure!, {
      userType: "PME",
      urgency: "soon",
      alreadyHasDocuments: false,
    });

    expect(checklist.items.length).toBeGreaterThan(procedure!.requiredDocuments.length);
    expect(checklist.items[0]?.label).toContain("source officielle");
    expect(checklist.items.every((item) => item.sourceRefs.length > 0)).toBe(true);
  });

  it("computes checklist progress", () => {
    const procedure = demoProcedures[0]!;
    const checklist = generateProcedureChecklist(procedure);
    const items = checklist.items.map((item, index) => ({
      ...item,
      status: index === 0 ? ("done" as const) : item.status,
    }));

    expect(getChecklistProgress(items)).toBeGreaterThan(0);
  });
});
