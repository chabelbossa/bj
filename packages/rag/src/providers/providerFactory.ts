import type { AiProvider } from "../types";
import { mockAiProvider } from "./mockAiProvider";
import { createOpenAiProvider } from "./openAiProvider";

export type AiProviderName = "mock" | "openai";
export type AiProviderEnv = {
  AI_PROVIDER?: string;
  OPENAI_API_KEY?: string;
  OPENAI_BASE_URL?: string;
  OPENAI_MODEL?: string;
  OPENAI_TIMEOUT_MS?: string;
};

const currentAiProviderEnv = (): AiProviderEnv => ({
  AI_PROVIDER: process.env.AI_PROVIDER,
  OPENAI_API_KEY: process.env.OPENAI_API_KEY,
  OPENAI_BASE_URL: process.env.OPENAI_BASE_URL,
  OPENAI_MODEL: process.env.OPENAI_MODEL,
  OPENAI_TIMEOUT_MS: process.env.OPENAI_TIMEOUT_MS,
});

const parseTimeoutMs = (value: string | undefined) => {
  if (!value) {
    return undefined;
  }

  const parsedValue = Number.parseInt(value, 10);

  return Number.isFinite(parsedValue) && parsedValue > 0 ? parsedValue : undefined;
};

const optionalEnvValue = (value: string | undefined) => {
  const trimmedValue = value?.trim();

  return trimmedValue ? trimmedValue : undefined;
};

export const getAiProviderName = (env: AiProviderEnv = currentAiProviderEnv()) => {
  const provider = env.AI_PROVIDER?.trim() || "mock";

  if (provider === "mock" || provider === "openai") {
    return provider satisfies AiProviderName;
  }

  throw new Error(
    `AI_PROVIDER="${provider}" is not supported. Use AI_PROVIDER="mock" or AI_PROVIDER="openai".`,
  );
};

export const resolveAiProvider = (env: AiProviderEnv = currentAiProviderEnv()): AiProvider => {
  const provider = getAiProviderName(env);

  if (provider === "mock") {
    return mockAiProvider;
  }

  return createOpenAiProvider({
    apiKey: optionalEnvValue(env.OPENAI_API_KEY),
    baseUrl: optionalEnvValue(env.OPENAI_BASE_URL),
    model: optionalEnvValue(env.OPENAI_MODEL),
    timeoutMs: parseTimeoutMs(env.OPENAI_TIMEOUT_MS),
  });
};
