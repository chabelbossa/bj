import { z } from "zod";

import { confidenceSchema, sourceChunkSchema, sourceReferenceSchema } from "@dossierbj/core";

export const groundedAnswerSchema = z.object({
  answer: z.string().min(1),
  citations: z.array(sourceReferenceSchema),
  confidence: confidenceSchema,
  missingInfo: z.array(z.string().min(1)),
  disclaimer: z.string().min(1),
  suggestedOfficialVerification: z.string().min(1),
});

export const retrievalResultSchema = z.object({
  chunk: sourceChunkSchema,
  score: z.number().nonnegative(),
  matchedTerms: z.array(z.string()),
});

export type GroundedAnswer = z.infer<typeof groundedAnswerSchema>;
export type RetrievalResult = z.infer<typeof retrievalResultSchema>;

export type RagQuestion = {
  question: string;
  maxResults?: number;
};

export type Retriever = {
  retrieve(input: RagQuestion): Promise<RetrievalResult[]>;
};

export type AiProvider = {
  answer(input: { question: string; retrievalResults: RetrievalResult[] }): Promise<GroundedAnswer>;
};
