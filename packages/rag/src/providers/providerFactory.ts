import type { AiProvider } from "../types";
import { mockAiProvider } from "./mockAiProvider";

export type AiProviderName = "mock";
export type AiProviderEnv = {
  AI_PROVIDER?: string;
};

const currentAiProviderEnv = (): AiProviderEnv => ({
  AI_PROVIDER: process.env.AI_PROVIDER,
});

export const getAiProviderName = (env: AiProviderEnv = currentAiProviderEnv()) => {
  const provider = env.AI_PROVIDER?.trim() || "mock";

  if (provider === "mock") {
    return provider satisfies AiProviderName;
  }

  throw new Error(
    `AI_PROVIDER="${provider}" is not enabled in this MVP. Use AI_PROVIDER="mock" unless a real provider adapter is implemented.`,
  );
};

export const resolveAiProvider = (env: AiProviderEnv = currentAiProviderEnv()): AiProvider => {
  const provider = getAiProviderName(env);

  if (provider === "mock") {
    return mockAiProvider;
  }

  return mockAiProvider;
};
