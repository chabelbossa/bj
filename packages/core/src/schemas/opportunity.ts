import { z } from "zod";

import { requiredDocumentSchema } from "./procedure";

export const opportunityStatusSchema = z.enum([
  "draft",
  "open",
  "closed",
  "cancelled",
  "demo_unverified",
]);

export const opportunitySchema = z.object({
  id: z.string().min(1),
  title: z.string().min(1),
  sourceUrl: z.string().url(),
  authority: z.string().min(1),
  country: z.string().min(2),
  sector: z.string().min(1),
  deadline: z.string().min(1),
  summary: z.string().min(1),
  requiredDocuments: z.array(requiredDocumentSchema),
  eligibility: z.array(z.string().min(1)),
  status: opportunityStatusSchema,
});

export type OpportunityStatus = z.infer<typeof opportunityStatusSchema>;
export type Opportunity = z.infer<typeof opportunitySchema>;
