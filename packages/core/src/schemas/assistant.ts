import { z } from "zod";

import { confidenceSchema, sourceReferenceSchema } from "./common";

export const assistantAnswerSchema = z.object({
  answer: z.string().min(1),
  citations: z.array(sourceReferenceSchema),
  confidence: confidenceSchema,
  missingInfo: z.array(z.string().min(1)),
  safetyNotice: z.string().min(1),
});

export type AssistantAnswer = z.infer<typeof assistantAnswerSchema>;
