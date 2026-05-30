import type { SourceReference } from "@dossierbj/core";

import { assertGroundedAnswerPolicy, createNoSourceAnswer } from "../policies/groundingPolicy";
import {
  groundedAnswerSchema,
  type AiProvider,
  type GroundedAnswer,
  type RetrievalResult,
} from "../types";

const OPENAI_RESPONSES_PATH = "/v1/responses";
const DEFAULT_OPENAI_BASE_URL = "https://api.openai.com";
const DEFAULT_OPENAI_MODEL = "gpt-5.4-mini";

type OpenAiProviderConfig = {
  apiKey?: string;
  baseUrl?: string;
  fetch?: typeof fetch;
  model?: string;
  timeoutMs?: number;
};

type RawCitation = {
  sourceId?: unknown;
  documentId?: unknown;
  url?: unknown;
  title?: unknown;
  excerpt?: unknown;
  retrievedAt?: unknown;
};

type RawGroundedAnswer = Omit<GroundedAnswer, "citations"> & {
  citations: RawCitation[];
};

const groundedAnswerJsonSchema = {
  type: "object",
  additionalProperties: false,
  required: [
    "answer",
    "citations",
    "confidence",
    "missingInfo",
    "disclaimer",
    "suggestedOfficialVerification",
  ],
  properties: {
    answer: { type: "string" },
    citations: {
      type: "array",
      items: {
        type: "object",
        additionalProperties: false,
        required: ["sourceId", "documentId", "url", "title", "excerpt", "retrievedAt"],
        properties: {
          sourceId: { type: "string" },
          documentId: { type: ["string", "null"] },
          url: { type: "string" },
          title: { type: "string" },
          excerpt: { type: ["string", "null"] },
          retrievedAt: { type: "string" },
        },
      },
    },
    confidence: { type: "string", enum: ["low", "medium", "high"] },
    missingInfo: {
      type: "array",
      items: { type: "string" },
    },
    disclaimer: { type: "string" },
    suggestedOfficialVerification: { type: "string" },
  },
};

const normalizeBaseUrl = (baseUrl: string) => baseUrl.replace(/\/+$/u, "");

const supportsReasoningConfig = (model: string) =>
  model.startsWith("gpt-5") || model.startsWith("o");

const createAbortSignal = (timeoutMs: number) => {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), timeoutMs);

  return {
    signal: controller.signal,
    clear: () => clearTimeout(timeout),
  };
};

const serializeCitation = (sourceRef: SourceReference) => ({
  sourceId: sourceRef.sourceId,
  documentId: sourceRef.documentId ?? null,
  url: sourceRef.url,
  title: sourceRef.title,
  excerpt: sourceRef.excerpt ?? null,
  retrievedAt: sourceRef.retrievedAt,
});

const citationKey = (sourceRef: Pick<SourceReference, "sourceId" | "url">) =>
  `${sourceRef.sourceId}:${sourceRef.url}`;

const createAllowedCitationMap = (retrievalResults: RetrievalResult[]) => {
  const citations = new Map<string, SourceReference>();

  for (const result of retrievalResults) {
    for (const sourceRef of result.chunk.sourceRefs) {
      citations.set(citationKey(sourceRef), sourceRef);
    }
  }

  return citations;
};

const toOpenAiContext = (retrievalResults: RetrievalResult[]) =>
  retrievalResults.slice(0, 4).map((result) => ({
    score: result.score,
    matchedTerms: result.matchedTerms,
    metadata: {
      title: result.chunk.metadata.title,
      slug: result.chunk.metadata.slug,
      category: result.chunk.metadata.category,
      verificationStatus: result.chunk.metadata.verificationStatus,
      facts: result.chunk.metadata.facts,
      claims: result.chunk.metadata.claims,
    },
    content: result.chunk.content.slice(0, 3_500),
    citations: result.chunk.sourceRefs.map(serializeCitation),
  }));

const extractResponseText = (payload: unknown) => {
  if (typeof payload !== "object" || payload === null) {
    return "";
  }

  if ("output_text" in payload && typeof payload.output_text === "string") {
    return payload.output_text;
  }

  if (!("output" in payload) || !Array.isArray(payload.output)) {
    return "";
  }

  return payload.output
    .flatMap((outputItem) => {
      if (
        typeof outputItem !== "object" ||
        outputItem === null ||
        !("content" in outputItem) ||
        !Array.isArray(outputItem.content)
      ) {
        return [];
      }

      return outputItem.content
        .map((contentItem: unknown) =>
          typeof contentItem === "object" &&
          contentItem !== null &&
          "text" in contentItem &&
          typeof contentItem.text === "string"
            ? contentItem.text
            : "",
        )
        .filter(Boolean);
    })
    .join("\n")
    .trim();
};

const parseAnswerPayload = (
  text: string,
  allowedCitations: Map<string, SourceReference>,
): GroundedAnswer => {
  try {
    const rawAnswer = JSON.parse(text) as RawGroundedAnswer;
    const normalizedCitations = rawAnswer.citations
      .map((citation) => {
        const sourceId = typeof citation.sourceId === "string" ? citation.sourceId : "";
        const url = typeof citation.url === "string" ? citation.url : "";

        return allowedCitations.get(citationKey({ sourceId, url }));
      })
      .filter((sourceRef): sourceRef is SourceReference => Boolean(sourceRef));
    const parsedAnswer = groundedAnswerSchema.parse({
      ...rawAnswer,
      citations: normalizedCitations,
    });

    return assertGroundedAnswerPolicy(parsedAnswer);
  } catch (error) {
    const detail = error instanceof Error ? error.message : "unknown parse error";

    throw new Error(`OpenAI Responses API returned an invalid grounded answer: ${detail}`);
  }
};

export const createOpenAiProvider = ({
  apiKey,
  baseUrl = DEFAULT_OPENAI_BASE_URL,
  fetch: fetchImpl = fetch,
  model = DEFAULT_OPENAI_MODEL,
  timeoutMs = 30_000,
}: OpenAiProviderConfig): AiProvider => {
  if (!apiKey?.trim()) {
    throw new Error("OPENAI_API_KEY is required when AI_PROVIDER=openai.");
  }

  return {
    async answer({ question, retrievalResults }) {
      if (retrievalResults.length === 0) {
        return createNoSourceAnswer(question);
      }

      const allowedCitations = createAllowedCitationMap(retrievalResults);
      const abortSignal = createAbortSignal(timeoutMs);

      try {
        const response = await fetchImpl(`${normalizeBaseUrl(baseUrl)}${OPENAI_RESPONSES_PATH}`, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${apiKey}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            model,
            ...(supportsReasoningConfig(model) ? { reasoning: { effort: "low" } } : {}),
            instructions:
              "Tu es l'assistant CivicRAG de DossierBJ. Réponds en français, uniquement avec les sources fournies. N'invente jamais de frais, délais, pièces, conditions ou étapes. Si une information manque, indique-la dans missingInfo. Les citations doivent être copiées depuis les citations fournies.",
            input: JSON.stringify({
              question,
              retrievalContext: toOpenAiContext(retrievalResults),
            }),
            text: {
              format: {
                type: "json_schema",
                name: "dossierbj_grounded_answer",
                strict: true,
                schema: groundedAnswerJsonSchema,
              },
            },
          }),
          signal: abortSignal.signal,
        });

        if (!response.ok) {
          const body = await response.text().catch(() => "");
          throw new Error(`OpenAI Responses API failed with ${response.status}: ${body}`);
        }

        const payload: unknown = await response.json();
        const text = extractResponseText(payload);

        if (!text) {
          throw new Error("OpenAI Responses API returned an empty assistant answer.");
        }

        return parseAnswerPayload(text, allowedCitations);
      } finally {
        abortSignal.clear();
      }
    },
  };
};

export { DEFAULT_OPENAI_MODEL };
