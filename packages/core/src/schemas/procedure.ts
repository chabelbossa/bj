import { z } from "zod";

import { isoDateStringSchema, sourceReferenceSchema } from "./common";

export const verificationStatusSchema = z.enum([
  "verified",
  "partially_verified",
  "pending_verification",
  "demo_unverified",
]);

export const claimStatusSchema = z.enum([
  "verified",
  "partially_verified",
  "unverified",
  "not_applicable",
]);

export const procedureFactSchema = z.object({
  id: z.string().min(1),
  label: z.string().min(1),
  value: z.string().min(1),
  status: claimStatusSchema,
  sourceRefs: z.array(sourceReferenceSchema),
  note: z.string().optional(),
});

export const requiredDocumentSchema = z.object({
  id: z.string().min(1),
  name: z.string().min(1),
  description: z.string().min(1),
  required: z.boolean(),
  condition: z.string().optional(),
  sourceRefs: z.array(sourceReferenceSchema),
});

export const procedureStepSchema = z.object({
  id: z.string().min(1),
  order: z.number().int().positive(),
  title: z.string().min(1),
  description: z.string().min(1),
  sourceRefs: z.array(sourceReferenceSchema),
});

export const procedureSchema = z.object({
  id: z.string().min(1),
  title: z.string().min(1),
  slug: z.string().min(1),
  country: z.string().min(2),
  category: z.string().min(1),
  aliases: z.array(z.string().min(1)).default([]),
  targetUsers: z.array(z.string().min(1)),
  summary: z.string().min(1),
  userNeed: z.string().min(1),
  expectedOutcome: z.string().min(1),
  officialUrl: z.string().url().optional(),
  estimatedDuration: z.string().optional(),
  officialCost: z.string().optional(),
  requiredDocuments: z.array(requiredDocumentSchema),
  steps: z.array(procedureStepSchema),
  preparationHints: z.array(z.string().min(1)),
  pointsToVerify: z.array(z.string().min(1)),
  verifiedFacts: z.array(procedureFactSchema).default([]),
  warnings: z.array(z.string().min(1)),
  sources: z.array(sourceReferenceSchema),
  sourceStatusNote: z.string().min(1),
  lastVerifiedAt: isoDateStringSchema,
  verificationStatus: verificationStatusSchema,
});

export type VerificationStatus = z.infer<typeof verificationStatusSchema>;
export type ClaimStatus = z.infer<typeof claimStatusSchema>;
export type ProcedureFact = z.infer<typeof procedureFactSchema>;
export type RequiredDocument = z.infer<typeof requiredDocumentSchema>;
export type ProcedureStep = z.infer<typeof procedureStepSchema>;
export type Procedure = z.infer<typeof procedureSchema>;
