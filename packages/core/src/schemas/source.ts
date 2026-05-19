import { z } from "zod";

import { isoDateStringSchema, sourceReferenceSchema } from "./common";

export const sourceTypeSchema = z.enum(["official", "semi_official", "partner", "demo"]);

export const reliabilityLevelSchema = z.enum(["high", "medium", "low", "unknown"]);

export const sourceStatusSchema = z.enum([
  "active",
  "pending_review",
  "archived",
  "demo_unverified",
]);

export const sourceReviewStatusSchema = z.enum([
  "to_connect",
  "needs_human_review",
  "demo_connected",
  "verified",
  "rejected",
]);

export const sourceReviewPrioritySchema = z.enum(["low", "medium", "high"]);

export const officialSourceSchema = z.object({
  id: z.string().min(1),
  name: z.string().min(1),
  country: z.string().min(2),
  institution: z.string().min(1),
  url: z.string().url(),
  sourceType: sourceTypeSchema,
  reliabilityLevel: reliabilityLevelSchema,
  lastCheckedAt: isoDateStringSchema,
  status: sourceStatusSchema,
});

export const sourceDocumentSchema = z.object({
  id: z.string().min(1),
  sourceId: z.string().min(1),
  title: z.string().min(1),
  url: z.string().url(),
  contentType: z.string().min(1),
  retrievedAt: isoDateStringSchema,
  version: z.string().min(1),
  checksum: z.string().optional(),
  status: sourceStatusSchema,
});

export const sourceChunkSchema = z.object({
  id: z.string().min(1),
  documentId: z.string().min(1),
  content: z.string().min(1),
  position: z.number().int().nonnegative(),
  metadata: z.record(z.string(), z.unknown()).default({}),
  sourceRefs: z.array(sourceReferenceSchema).min(1),
});

export const sourceReviewItemSchema = z.object({
  id: z.string().min(1),
  title: z.string().min(1),
  module: z.string().min(1),
  country: z.string().min(2),
  authority: z.string().min(1),
  candidateUrl: z.string().url(),
  status: sourceReviewStatusSchema,
  priority: sourceReviewPrioritySchema,
  notes: z.array(z.string().min(1)),
  relatedProcedureSlugs: z.array(z.string().min(1)),
  lastReviewedAt: isoDateStringSchema.optional(),
});

export type SourceType = z.infer<typeof sourceTypeSchema>;
export type ReliabilityLevel = z.infer<typeof reliabilityLevelSchema>;
export type SourceStatus = z.infer<typeof sourceStatusSchema>;
export type SourceReviewStatus = z.infer<typeof sourceReviewStatusSchema>;
export type SourceReviewPriority = z.infer<typeof sourceReviewPrioritySchema>;
export type OfficialSource = z.infer<typeof officialSourceSchema>;
export type SourceDocument = z.infer<typeof sourceDocumentSchema>;
export type SourceChunk = z.infer<typeof sourceChunkSchema>;
export type SourceReviewItem = z.infer<typeof sourceReviewItemSchema>;
