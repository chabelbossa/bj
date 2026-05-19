import { describe, expect, it } from "vitest";

import { formatFcfa, formatVerificationStatus } from "./format";

describe("format helpers", () => {
  it("formats demo verification status explicitly", () => {
    expect(formatVerificationStatus("demo_unverified")).toBe(
      "Données de démonstration non officielles",
    );
  });

  it("formats FCFA values for future paid modules", () => {
    expect(formatFcfa(15000)).toContain("15");
  });
});
