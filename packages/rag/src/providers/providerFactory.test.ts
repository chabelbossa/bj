import { describe, expect, it, vi } from "vitest";

import {
  answerWithConfiguredRag,
  createOpenAiProvider,
  getAiProviderName,
  mockRetriever,
  resolveAiProvider,
} from "../index";

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

  it("enables the optional OpenAI provider only when configured", () => {
    expect(getAiProviderName({ AI_PROVIDER: "openai" })).toBe("openai");
    expect(() => resolveAiProvider({ AI_PROVIDER: "openai" })).toThrow("OPENAI_API_KEY");
    expect(resolveAiProvider({ AI_PROVIDER: "openai", OPENAI_API_KEY: "sk-test" })).toBeDefined();
  });

  it("answers with the OpenAI provider through the Responses API without external calls", async () => {
    const retrievalResults = await mockRetriever.retrieve({
      question: "Quels documents faut-il pour créer une entreprise au Bénin ?",
    });
    const sourceRef = retrievalResults[0]!.chunk.sourceRefs[0]!;
    const fetchImpl = vi.fn(async (_input: RequestInfo | URL, _init?: RequestInit) =>
      Response.json({
        output_text: JSON.stringify({
          answer:
            "La fiche sourcée concerne la création d'entreprise et liste les pièces visibles à revérifier sur MonEntreprise.bj.",
          citations: [
            {
              sourceId: sourceRef.sourceId,
              documentId: sourceRef.documentId ?? null,
              url: sourceRef.url,
              title: sourceRef.title,
              excerpt: sourceRef.excerpt ?? null,
              retrievedAt: sourceRef.retrievedAt,
            },
          ],
          confidence: "medium",
          missingInfo: ["Forme juridique exacte à confirmer avant dépôt"],
          disclaimer:
            "Cette plateforme est indépendante et ne remplace pas les plateformes officielles.",
          suggestedOfficialVerification:
            "Vérifiez directement l'information auprès de MonEntreprise.bj avant paiement.",
        }),
      }),
    );
    const provider = createOpenAiProvider({
      apiKey: "sk-test",
      fetch: fetchImpl as unknown as typeof fetch,
    });

    const answer = await provider.answer({
      question: "Quels documents faut-il pour créer une entreprise au Bénin ?",
      retrievalResults,
    });
    const requestInit = fetchImpl.mock.calls[0]![1]!;
    const requestBody = JSON.parse(requestInit.body as string) as {
      model: string;
      text: { format: { type: string } };
    };

    expect(fetchImpl).toHaveBeenCalledWith(
      "https://api.openai.com/v1/responses",
      expect.objectContaining({
        method: "POST",
        headers: expect.objectContaining({ Authorization: "Bearer sk-test" }),
      }),
    );
    expect(requestBody.model).toBe("gpt-5.4-mini");
    expect(requestBody.text.format.type).toBe("json_schema");
    expect(answer.citations).toEqual([sourceRef]);
    expect(answer.disclaimer).toContain("indépendante");
  });
});
