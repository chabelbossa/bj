CREATE TYPE "public"."opportunity_status" AS ENUM('draft', 'open', 'closed', 'cancelled', 'demo_unverified');--> statement-breakpoint
CREATE TYPE "public"."record_status" AS ENUM('active', 'pending_review', 'archived', 'demo_unverified');--> statement-breakpoint
CREATE TYPE "public"."reliability_level" AS ENUM('high', 'medium', 'low', 'unknown');--> statement-breakpoint
CREATE TYPE "public"."source_type" AS ENUM('official', 'semi_official', 'partner', 'demo');--> statement-breakpoint
CREATE TYPE "public"."verification_status" AS ENUM('verified', 'partially_verified', 'pending_verification', 'demo_unverified');--> statement-breakpoint
CREATE TABLE "assistant_queries" (
	"id" text PRIMARY KEY NOT NULL,
	"question" text NOT NULL,
	"answer" jsonb NOT NULL,
	"confidence" text NOT NULL,
	"citations" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "audit_logs" (
	"id" text PRIMARY KEY NOT NULL,
	"actor_id" text,
	"action" text NOT NULL,
	"target_type" text NOT NULL,
	"target_id" text,
	"metadata" jsonb DEFAULT '{}'::jsonb NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "checklist_items" (
	"id" text PRIMARY KEY NOT NULL,
	"checklist_id" text NOT NULL,
	"label" text NOT NULL,
	"status" text NOT NULL,
	"related_document_id" text,
	"source_refs" jsonb DEFAULT '[]'::jsonb NOT NULL
);
--> statement-breakpoint
CREATE TABLE "checklists" (
	"id" text PRIMARY KEY NOT NULL,
	"procedure_id" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "official_sources" (
	"id" text PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"country" text NOT NULL,
	"institution" text NOT NULL,
	"url" text NOT NULL,
	"source_type" "source_type" NOT NULL,
	"reliability_level" "reliability_level" NOT NULL,
	"last_checked_at" timestamp NOT NULL,
	"status" "record_status" NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "opportunities" (
	"id" text PRIMARY KEY NOT NULL,
	"title" text NOT NULL,
	"source_url" text NOT NULL,
	"authority" text NOT NULL,
	"country" text NOT NULL,
	"sector" text NOT NULL,
	"deadline" timestamp NOT NULL,
	"summary" text NOT NULL,
	"required_documents" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"eligibility" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"status" "opportunity_status" NOT NULL
);
--> statement-breakpoint
CREATE TABLE "procedure_steps" (
	"id" text PRIMARY KEY NOT NULL,
	"procedure_id" text NOT NULL,
	"step_order" integer NOT NULL,
	"title" text NOT NULL,
	"description" text NOT NULL,
	"source_refs" jsonb DEFAULT '[]'::jsonb NOT NULL
);
--> statement-breakpoint
CREATE TABLE "procedures" (
	"id" text PRIMARY KEY NOT NULL,
	"title" text NOT NULL,
	"slug" text NOT NULL,
	"country" text NOT NULL,
	"category" text NOT NULL,
	"aliases" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"target_users" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"summary" text NOT NULL,
	"user_need" text NOT NULL,
	"expected_outcome" text NOT NULL,
	"official_url" text,
	"estimated_duration" text,
	"official_cost" text,
	"preparation_hints" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"points_to_verify" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"verified_facts" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"warnings" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"sources" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"source_status_note" text NOT NULL,
	"last_verified_at" timestamp NOT NULL,
	"verification_status" "verification_status" NOT NULL,
	CONSTRAINT "procedures_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE "required_documents" (
	"id" text PRIMARY KEY NOT NULL,
	"procedure_id" text NOT NULL,
	"name" text NOT NULL,
	"description" text NOT NULL,
	"required" boolean NOT NULL,
	"condition" text,
	"source_refs" jsonb DEFAULT '[]'::jsonb NOT NULL
);
--> statement-breakpoint
CREATE TABLE "source_chunks" (
	"id" text PRIMARY KEY NOT NULL,
	"document_id" text NOT NULL,
	"content" text NOT NULL,
	"position" integer NOT NULL,
	"metadata" jsonb DEFAULT '{}'::jsonb NOT NULL,
	"source_refs" jsonb DEFAULT '[]'::jsonb NOT NULL
);
--> statement-breakpoint
CREATE TABLE "source_documents" (
	"id" text PRIMARY KEY NOT NULL,
	"source_id" text NOT NULL,
	"title" text NOT NULL,
	"url" text NOT NULL,
	"content_type" text NOT NULL,
	"retrieved_at" timestamp NOT NULL,
	"version" text NOT NULL,
	"checksum" text,
	"status" "record_status" NOT NULL
);
--> statement-breakpoint
CREATE TABLE "source_references" (
	"id" text PRIMARY KEY NOT NULL,
	"source_id" text,
	"document_id" text,
	"url" text NOT NULL,
	"title" text NOT NULL,
	"excerpt" text,
	"retrieved_at" timestamp NOT NULL,
	"target_type" text NOT NULL,
	"target_id" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE "source_review_events" (
	"id" text PRIMARY KEY NOT NULL,
	"review_item_id" text NOT NULL,
	"status" text NOT NULL,
	"note" text NOT NULL,
	"reviewed_at" timestamp NOT NULL,
	"actor" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE "source_review_items" (
	"id" text PRIMARY KEY NOT NULL,
	"title" text NOT NULL,
	"module" text NOT NULL,
	"country" text NOT NULL,
	"authority" text NOT NULL,
	"candidate_url" text NOT NULL,
	"status" text NOT NULL,
	"priority" text NOT NULL,
	"notes" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"related_procedure_slugs" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"last_reviewed_at" timestamp
);
--> statement-breakpoint
ALTER TABLE "checklist_items" ADD CONSTRAINT "checklist_items_checklist_id_checklists_id_fk" FOREIGN KEY ("checklist_id") REFERENCES "public"."checklists"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "checklists" ADD CONSTRAINT "checklists_procedure_id_procedures_id_fk" FOREIGN KEY ("procedure_id") REFERENCES "public"."procedures"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "procedure_steps" ADD CONSTRAINT "procedure_steps_procedure_id_procedures_id_fk" FOREIGN KEY ("procedure_id") REFERENCES "public"."procedures"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "required_documents" ADD CONSTRAINT "required_documents_procedure_id_procedures_id_fk" FOREIGN KEY ("procedure_id") REFERENCES "public"."procedures"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "source_chunks" ADD CONSTRAINT "source_chunks_document_id_source_documents_id_fk" FOREIGN KEY ("document_id") REFERENCES "public"."source_documents"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "source_documents" ADD CONSTRAINT "source_documents_source_id_official_sources_id_fk" FOREIGN KEY ("source_id") REFERENCES "public"."official_sources"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "source_references" ADD CONSTRAINT "source_references_source_id_official_sources_id_fk" FOREIGN KEY ("source_id") REFERENCES "public"."official_sources"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "source_references" ADD CONSTRAINT "source_references_document_id_source_documents_id_fk" FOREIGN KEY ("document_id") REFERENCES "public"."source_documents"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "source_review_events" ADD CONSTRAINT "source_review_events_review_item_id_source_review_items_id_fk" FOREIGN KEY ("review_item_id") REFERENCES "public"."source_review_items"("id") ON DELETE no action ON UPDATE no action;