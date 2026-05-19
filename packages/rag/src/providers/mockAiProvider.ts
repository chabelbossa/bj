import type { AiProvider } from "../types";
import {
  assertGroundedAnswerPolicy,
  createGroundedAnswerFromResults,
} from "../policies/groundingPolicy";

export const mockAiProvider: AiProvider = {
  async answer({ question, retrievalResults }) {
    return assertGroundedAnswerPolicy(createGroundedAnswerFromResults(question, retrievalResults));
  },
};
