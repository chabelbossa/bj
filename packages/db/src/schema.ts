import { boolean, integer, jsonb, pgEnum, pgTable, text, timestamp } from "drizzle-orm/pg-core";

export const sourceTypeEnum = pgEnum("source_type", [
  "official",
  "semi_official",
  "partner",
  "demo",
]);

export const reliabilityLevelEnum = pgEnum("reliability_level", [
  "high",
  "medium",
  "low",
  "unknown",
]);

export const verificationStatusEnum = pgEnum("verification_status", [
  "verified",
  "partially_verified",
  "pending_verification",
  "demo_unverified",
]);

export const claimStatusEnum = pgEnum("claim_status", [
  "verified",
  "partially_verified",
  "unverified",
  "not_applicable",
]);

export const claimTypeEnum = pgEnum("claim_type", [
  "general",
  "official_channel",
  "cost",
  "duration",
  "required_document",
  "procedure_step",
  "eligibility",
  "warning",
]);

export const recordStatusEnum = pgEnum("record_status", [
  "active",
  "pending_review",
  "archived",
  "demo_unverified",
]);

export const opportunityStatusEnum = pgEnum("opportunity_status", [
  "draft",
  "open",
  "closed",
  "cancelled",
  "demo_unverified",
]);

export const officialSources = pgTable("official_sources", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  country: text("country").notNull(),
  institution: text("institution").notNull(),
  url: text("url").notNull(),
  sourceType: sourceTypeEnum("source_type").notNull(),
  reliabilityLevel: reliabilityLevelEnum("reliability_level").notNull(),
  lastCheckedAt: timestamp("last_checked_at", { mode: "date" }).notNull(),
  status: recordStatusEnum("status").notNull(),
  createdAt: timestamp("created_at", { mode: "date" }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { mode: "date" }).defaultNow().notNull(),
});

export const sourceDocuments = pgTable("source_documents", {
  id: text("id").primaryKey(),
  sourceId: text("source_id")
    .notNull()
    .references(() => officialSources.id),
  title: text("title").notNull(),
  url: text("url").notNull(),
  contentType: text("content_type").notNull(),
  retrievedAt: timestamp("retrieved_at", { mode: "date" }).notNull(),
  version: text("version").notNull(),
  checksum: text("checksum"),
  status: recordStatusEnum("status").notNull(),
});

export const sourceChunks = pgTable("source_chunks", {
  id: text("id").primaryKey(),
  documentId: text("document_id")
    .notNull()
    .references(() => sourceDocuments.id),
  content: text("content").notNull(),
  position: integer("position").notNull(),
  metadata: jsonb("metadata").$type<Record<string, unknown>>().default({}).notNull(),
  sourceRefs: jsonb("source_refs").$type<unknown[]>().default([]).notNull(),
});

export const procedures = pgTable("procedures", {
  id: text("id").primaryKey(),
  title: text("title").notNull(),
  slug: text("slug").notNull().unique(),
  country: text("country").notNull(),
  category: text("category").notNull(),
  aliases: jsonb("aliases").$type<string[]>().default([]).notNull(),
  targetUsers: jsonb("target_users").$type<string[]>().default([]).notNull(),
  summary: text("summary").notNull(),
  userNeed: text("user_need").notNull(),
  expectedOutcome: text("expected_outcome").notNull(),
  officialUrl: text("official_url"),
  estimatedDuration: text("estimated_duration"),
  officialCost: text("official_cost"),
  preparationHints: jsonb("preparation_hints").$type<string[]>().default([]).notNull(),
  pointsToVerify: jsonb("points_to_verify").$type<string[]>().default([]).notNull(),
  verifiedFacts: jsonb("verified_facts").$type<unknown[]>().default([]).notNull(),
  warnings: jsonb("warnings").$type<string[]>().default([]).notNull(),
  sources: jsonb("sources").$type<unknown[]>().default([]).notNull(),
  sourceStatusNote: text("source_status_note").notNull(),
  lastVerifiedAt: timestamp("last_verified_at", { mode: "date" }).notNull(),
  verificationStatus: verificationStatusEnum("verification_status").notNull(),
});

export const requiredDocuments = pgTable("required_documents", {
  id: text("id").primaryKey(),
  procedureId: text("procedure_id")
    .notNull()
    .references(() => procedures.id),
  name: text("name").notNull(),
  description: text("description").notNull(),
  required: boolean("required").notNull(),
  condition: text("condition"),
  sourceRefs: jsonb("source_refs").$type<unknown[]>().default([]).notNull(),
});

export const procedureSteps = pgTable("procedure_steps", {
  id: text("id").primaryKey(),
  procedureId: text("procedure_id")
    .notNull()
    .references(() => procedures.id),
  order: integer("step_order").notNull(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  sourceRefs: jsonb("source_refs").$type<unknown[]>().default([]).notNull(),
});

export const procedureClaims = pgTable("procedure_claims", {
  id: text("id").primaryKey(),
  procedureId: text("procedure_id")
    .notNull()
    .references(() => procedures.id),
  procedureSlug: text("procedure_slug").notNull(),
  type: claimTypeEnum("claim_type").notNull(),
  label: text("label").notNull(),
  value: text("value").notNull(),
  status: claimStatusEnum("status").notNull(),
  sourceRefs: jsonb("source_refs").$type<unknown[]>().default([]).notNull(),
  note: text("note"),
  sourceField: text("source_field"),
  createdAt: timestamp("created_at", { mode: "date" }).defaultNow().notNull(),
});

export const sourceReferences = pgTable("source_references", {
  id: text("id").primaryKey(),
  sourceId: text("source_id").references(() => officialSources.id),
  documentId: text("document_id").references(() => sourceDocuments.id),
  url: text("url").notNull(),
  title: text("title").notNull(),
  excerpt: text("excerpt"),
  retrievedAt: timestamp("retrieved_at", { mode: "date" }).notNull(),
  targetType: text("target_type").notNull(),
  targetId: text("target_id").notNull(),
});

export const checklists = pgTable("checklists", {
  id: text("id").primaryKey(),
  procedureId: text("procedure_id")
    .notNull()
    .references(() => procedures.id),
  createdAt: timestamp("created_at", { mode: "date" }).defaultNow().notNull(),
});

export const checklistItems = pgTable("checklist_items", {
  id: text("id").primaryKey(),
  checklistId: text("checklist_id")
    .notNull()
    .references(() => checklists.id),
  label: text("label").notNull(),
  status: text("status").notNull(),
  relatedDocumentId: text("related_document_id"),
  sourceRefs: jsonb("source_refs").$type<unknown[]>().default([]).notNull(),
});

export const assistantQueries = pgTable("assistant_queries", {
  id: text("id").primaryKey(),
  question: text("question").notNull(),
  answer: jsonb("answer").$type<Record<string, unknown>>().notNull(),
  confidence: text("confidence").notNull(),
  citations: jsonb("citations").$type<unknown[]>().default([]).notNull(),
  createdAt: timestamp("created_at", { mode: "date" }).defaultNow().notNull(),
});

export const sourceReviewItems = pgTable("source_review_items", {
  id: text("id").primaryKey(),
  title: text("title").notNull(),
  module: text("module").notNull(),
  country: text("country").notNull(),
  authority: text("authority").notNull(),
  candidateUrl: text("candidate_url").notNull(),
  status: text("status").notNull(),
  priority: text("priority").notNull(),
  notes: jsonb("notes").$type<string[]>().default([]).notNull(),
  relatedProcedureSlugs: jsonb("related_procedure_slugs").$type<string[]>().default([]).notNull(),
  lastReviewedAt: timestamp("last_reviewed_at", { mode: "date" }),
});

export const sourceReviewEvents = pgTable("source_review_events", {
  id: text("id").primaryKey(),
  reviewItemId: text("review_item_id")
    .notNull()
    .references(() => sourceReviewItems.id),
  status: text("status").notNull(),
  note: text("note").notNull(),
  reviewedAt: timestamp("reviewed_at", { mode: "date" }).notNull(),
  actor: text("actor").notNull(),
});

export const opportunities = pgTable("opportunities", {
  id: text("id").primaryKey(),
  title: text("title").notNull(),
  sourceUrl: text("source_url").notNull(),
  authority: text("authority").notNull(),
  country: text("country").notNull(),
  sector: text("sector").notNull(),
  deadline: timestamp("deadline", { mode: "date" }).notNull(),
  summary: text("summary").notNull(),
  requiredDocuments: jsonb("required_documents").$type<unknown[]>().default([]).notNull(),
  eligibility: jsonb("eligibility").$type<string[]>().default([]).notNull(),
  status: opportunityStatusEnum("status").notNull(),
});

export const auditLogs = pgTable("audit_logs", {
  id: text("id").primaryKey(),
  actorId: text("actor_id"),
  action: text("action").notNull(),
  targetType: text("target_type").notNull(),
  targetId: text("target_id"),
  metadata: jsonb("metadata").$type<Record<string, unknown>>().default({}).notNull(),
  createdAt: timestamp("created_at", { mode: "date" }).defaultNow().notNull(),
});
