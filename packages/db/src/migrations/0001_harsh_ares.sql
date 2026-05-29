CREATE TYPE "public"."claim_status" AS ENUM('verified', 'partially_verified', 'unverified', 'not_applicable');--> statement-breakpoint
CREATE TYPE "public"."claim_type" AS ENUM('general', 'official_channel', 'cost', 'duration', 'required_document', 'procedure_step', 'eligibility', 'warning');--> statement-breakpoint
CREATE TABLE "procedure_claims" (
	"id" text PRIMARY KEY NOT NULL,
	"procedure_id" text NOT NULL,
	"procedure_slug" text NOT NULL,
	"claim_type" "claim_type" NOT NULL,
	"label" text NOT NULL,
	"value" text NOT NULL,
	"status" "claim_status" NOT NULL,
	"source_refs" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"note" text,
	"source_field" text,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "procedure_claims" ADD CONSTRAINT "procedure_claims_procedure_id_procedures_id_fk" FOREIGN KEY ("procedure_id") REFERENCES "public"."procedures"("id") ON DELETE no action ON UPDATE no action;