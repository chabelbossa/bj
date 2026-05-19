import { describe, expect, it } from "vitest";

import { answerWithConfiguredRag, getAiProviderName, resolveAiProvider } from "../index";

describe("AI provider factory", () => {
  it("defaults to the mock provider", () => {
    expect(getAiProviderName({})).toBe("mock");
    expect(resolveAiProvider({ AI_PROVIDER: "mock" })).toBeDefined();
  });

  it("answers with AI_PROVIDER=mock without external calls", async () => {
    const answer = await answerWithConfiguredRag("création entreprise", {
      AI_PROVIDER: "mock",
    });

    expect(answer.confidence).toBe("medium");
    expect(answer.citations.length).toBeGreaterThan(0);
    expect(answer.disclaimer).toContain("indépendante");
  });

  it("rejects unimplemented paid providers explicitly", () => {
    expect(() => getAiProviderName({ AI_PROVIDER: "openai" })).toThrow("not enabled");
  });
});
