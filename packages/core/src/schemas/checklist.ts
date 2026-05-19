import { z } from "zod";

import { isoDateStringSchema, sourceReferenceSchema } from "./common";

export const checklistItemStatusSchema = z.enum(["todo", "in_progress", "done", "blocked"]);

export const checklistItemSchema = z.object({
  id: z.string().min(1),
  label: z.string().min(1),
  status: checklistItemStatusSchema,
  relatedDocumentId: z.string().min(1).optional(),
  sourceRefs: z.array(sourceReferenceSchema),
});

export const checklistSchema = z.object({
  id: z.string().min(1),
  procedureId: z.string().min(1),
  items: z.array(checklistItemSchema),
  createdAt: isoDateStringSchema,
});

export type ChecklistItemStatus = z.infer<typeof checklistItemStatusSchema>;
export type ChecklistItem = z.infer<typeof checklistItemSchema>;
export type Checklist = z.infer<typeof checklistSchema>;
