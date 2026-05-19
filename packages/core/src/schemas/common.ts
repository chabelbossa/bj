import { z } from "zod";

export const isoDateStringSchema = z.string().min(4);

export const sourceReferenceSchema = z.object({
  sourceId: z.string().min(1),
  documentId: z.string().min(1).optional(),
  url: z.string().url(),
  title: z.string().min(1),
  excerpt: z.string().optional(),
  retrievedAt: isoDateStringSchema,
});

export const confidenceSchema = z.enum(["low", "medium", "high"]);

export type SourceReference = z.infer<typeof sourceReferenceSchema>;
export type Confidence = z.infer<typeof confidenceSchema>;
