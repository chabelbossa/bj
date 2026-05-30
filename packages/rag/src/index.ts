import { mockAiProvider } from "./providers/mockAiProvider";
import { type AiProviderEnv, resolveAiProvider } from "./providers/providerFactory";
import { mockRetriever } from "./retrievers/mockRetriever";
import type { AiProvider, GroundedAnswer, RagQuestion, Retriever } from "./types";

export * from "./policies/groundingPolicy";
export * from "./prompts/systemPrompts";
export * from "./providers/mockAiProvider";
export * from "./providers/openAiProvider";
export * from "./providers/providerFactory";
export * from "./retrievers/keywordRetriever";
export * from "./retrievers/mockRetriever";
export * from "./types";

export const createCivicRag = ({
  retriever = mockRetriever,
  provider = mockAiProvider,
}: {
  retriever?: Retriever;
  provider?: AiProvider;
} = {}) => ({
  async answerQuestion(input: RagQuestion): Promise<GroundedAnswer> {
    const retrievalResults = await retriever.retrieve(input);

    return provider.answer({
      question: input.question,
      retrievalResults,
    });
  },
});

export const answerWithMockRag = async (question: string) =>
  createCivicRag().answerQuestion({ question });

export const answerWithConfiguredRag = async (
  question: string,
  env: AiProviderEnv = {
    AI_PROVIDER: process.env.AI_PROVIDER,
    OPENAI_API_KEY: process.env.OPENAI_API_KEY,
    OPENAI_BASE_URL: process.env.OPENAI_BASE_URL,
    OPENAI_MODEL: process.env.OPENAI_MODEL,
    OPENAI_TIMEOUT_MS: process.env.OPENAI_TIMEOUT_MS,
  },
) =>
  createCivicRag({
    provider: resolveAiProvider(env),
  }).answerQuestion({ question });
