import {
  createProcedureSourceChunks,
  createProcedureClaims,
  createSourceReviewEvents,
  demoProcedures,
  demoSourceReviewItems,
  officialSources,
  sourceDocuments,
} from "@dossierbj/core";

import { createSqlClient } from "./client";

const toDate = (value: string | undefined) => (value ? new Date(value) : null);

const sql = await createSqlClient();

try {
  await sql.begin(async (tx) => {
    const toJson = (value: unknown): Parameters<typeof tx.json>[0] =>
      JSON.parse(JSON.stringify(value)) as Parameters<typeof tx.json>[0];

    for (const source of officialSources) {
      await tx`
        insert into official_sources (
          id, name, country, institution, url, source_type, reliability_level, last_checked_at, status
        ) values (
          ${source.id}, ${source.name}, ${source.country}, ${source.institution}, ${source.url},
          ${source.sourceType}, ${source.reliabilityLevel}, ${toDate(source.lastCheckedAt)}, ${source.status}
        )
        on conflict (id) do update set
          name = excluded.name,
          country = excluded.country,
          institution = excluded.institution,
          url = excluded.url,
          source_type = excluded.source_type,
          reliability_level = excluded.reliability_level,
          last_checked_at = excluded.last_checked_at,
          status = excluded.status,
          updated_at = now()
      `;
    }

    for (const document of sourceDocuments) {
      await tx`
        insert into source_documents (
          id, source_id, title, url, content_type, retrieved_at, version, checksum, status
        ) values (
          ${document.id}, ${document.sourceId}, ${document.title}, ${document.url},
          ${document.contentType}, ${toDate(document.retrievedAt)}, ${document.version},
          ${document.checksum ?? null}, ${document.status}
        )
        on conflict (id) do update set
          source_id = excluded.source_id,
          title = excluded.title,
          url = excluded.url,
          content_type = excluded.content_type,
          retrieved_at = excluded.retrieved_at,
          version = excluded.version,
          checksum = excluded.checksum,
          status = excluded.status
      `;
    }

    for (const procedure of demoProcedures) {
      await tx`
        insert into procedures (
          id, title, slug, country, category, aliases, target_users, summary,
          user_need, expected_outcome, official_url, estimated_duration, official_cost,
          preparation_hints, points_to_verify, verified_facts, warnings, sources,
          source_status_note, last_verified_at, verification_status
        ) values (
          ${procedure.id}, ${procedure.title}, ${procedure.slug}, ${procedure.country},
          ${procedure.category}, ${tx.json(procedure.aliases)}, ${tx.json(procedure.targetUsers)},
          ${procedure.summary}, ${procedure.userNeed}, ${procedure.expectedOutcome},
          ${procedure.officialUrl ?? null}, ${procedure.estimatedDuration ?? null},
          ${procedure.officialCost ?? null}, ${tx.json(procedure.preparationHints)},
          ${tx.json(procedure.pointsToVerify)}, ${tx.json(procedure.verifiedFacts)},
          ${tx.json(procedure.warnings)}, ${tx.json(procedure.sources)}, ${procedure.sourceStatusNote},
          ${toDate(procedure.lastVerifiedAt)}, ${procedure.verificationStatus}
        )
        on conflict (id) do update set
          title = excluded.title,
          slug = excluded.slug,
          country = excluded.country,
          category = excluded.category,
          aliases = excluded.aliases,
          target_users = excluded.target_users,
          summary = excluded.summary,
          user_need = excluded.user_need,
          expected_outcome = excluded.expected_outcome,
          official_url = excluded.official_url,
          estimated_duration = excluded.estimated_duration,
          official_cost = excluded.official_cost,
          preparation_hints = excluded.preparation_hints,
          points_to_verify = excluded.points_to_verify,
          verified_facts = excluded.verified_facts,
          warnings = excluded.warnings,
          sources = excluded.sources,
          source_status_note = excluded.source_status_note,
          last_verified_at = excluded.last_verified_at,
          verification_status = excluded.verification_status
      `;

      for (const document of procedure.requiredDocuments) {
        await tx`
          insert into required_documents (
            id, procedure_id, name, description, required, condition, source_refs
          ) values (
            ${document.id}, ${procedure.id}, ${document.name}, ${document.description},
            ${document.required}, ${document.condition ?? null}, ${tx.json(document.sourceRefs)}
          )
          on conflict (id) do update set
            procedure_id = excluded.procedure_id,
            name = excluded.name,
            description = excluded.description,
            required = excluded.required,
            condition = excluded.condition,
            source_refs = excluded.source_refs
        `;
      }

      for (const step of procedure.steps) {
        await tx`
          insert into procedure_steps (
            id, procedure_id, step_order, title, description, source_refs
          ) values (
            ${step.id}, ${procedure.id}, ${step.order}, ${step.title}, ${step.description},
            ${tx.json(step.sourceRefs)}
          )
          on conflict (id) do update set
            procedure_id = excluded.procedure_id,
            step_order = excluded.step_order,
            title = excluded.title,
            description = excluded.description,
            source_refs = excluded.source_refs
        `;
      }

      for (const sourceRef of procedure.sources) {
        await tx`
          insert into source_references (
            id, source_id, document_id, url, title, excerpt, retrieved_at, target_type, target_id
          ) values (
            ${`${procedure.id}-${sourceRef.sourceId}-${sourceRef.documentId ?? sourceRef.url}`},
            ${sourceRef.sourceId}, ${sourceRef.documentId ?? null}, ${sourceRef.url},
            ${sourceRef.title}, ${sourceRef.excerpt ?? null}, ${toDate(sourceRef.retrievedAt)},
            ${"procedure"}, ${procedure.id}
          )
          on conflict (id) do update set
            source_id = excluded.source_id,
            document_id = excluded.document_id,
            url = excluded.url,
            title = excluded.title,
            excerpt = excluded.excerpt,
            retrieved_at = excluded.retrieved_at,
            target_type = excluded.target_type,
            target_id = excluded.target_id
        `;
      }
    }

    for (const claim of createProcedureClaims(demoProcedures)) {
      await tx`
        insert into procedure_claims (
          id, procedure_id, procedure_slug, claim_type, label, value, status, source_refs,
          note, source_field
        ) values (
          ${claim.id}, ${claim.procedureId}, ${claim.procedureSlug}, ${claim.type},
          ${claim.label}, ${claim.value}, ${claim.status}, ${tx.json(claim.sourceRefs)},
          ${claim.note ?? null}, ${claim.sourceField ?? null}
        )
        on conflict (id) do update set
          procedure_id = excluded.procedure_id,
          procedure_slug = excluded.procedure_slug,
          claim_type = excluded.claim_type,
          label = excluded.label,
          value = excluded.value,
          status = excluded.status,
          source_refs = excluded.source_refs,
          note = excluded.note,
          source_field = excluded.source_field
      `;
    }

    for (const chunk of createProcedureSourceChunks(demoProcedures)) {
      await tx`
        insert into source_chunks (
          id, document_id, content, position, metadata, source_refs
        ) values (
          ${chunk.id}, ${chunk.documentId}, ${chunk.content}, ${chunk.position},
          ${tx.json(toJson(chunk.metadata))}, ${tx.json(chunk.sourceRefs)}
        )
        on conflict (id) do update set
          document_id = excluded.document_id,
          content = excluded.content,
          position = excluded.position,
          metadata = excluded.metadata,
          source_refs = excluded.source_refs
      `;
    }

    for (const item of demoSourceReviewItems) {
      await tx`
        insert into source_review_items (
          id, title, module, country, authority, candidate_url, status, priority,
          notes, related_procedure_slugs, last_reviewed_at
        ) values (
          ${item.id}, ${item.title}, ${item.module}, ${item.country}, ${item.authority},
          ${item.candidateUrl}, ${item.status}, ${item.priority}, ${tx.json(item.notes)},
          ${tx.json(item.relatedProcedureSlugs)}, ${toDate(item.lastReviewedAt)}
        )
        on conflict (id) do update set
          title = excluded.title,
          module = excluded.module,
          country = excluded.country,
          authority = excluded.authority,
          candidate_url = excluded.candidate_url,
          status = excluded.status,
          priority = excluded.priority,
          notes = excluded.notes,
          related_procedure_slugs = excluded.related_procedure_slugs,
          last_reviewed_at = excluded.last_reviewed_at
      `;
    }

    for (const event of createSourceReviewEvents(demoSourceReviewItems)) {
      await tx`
        insert into source_review_events (
          id, review_item_id, status, note, reviewed_at, actor
        ) values (
          ${event.id}, ${event.reviewItemId}, ${event.status}, ${event.note},
          ${toDate(event.reviewedAt)}, ${event.actor}
        )
        on conflict (id) do update set
          review_item_id = excluded.review_item_id,
          status = excluded.status,
          note = excluded.note,
          reviewed_at = excluded.reviewed_at,
          actor = excluded.actor
      `;
    }
  });

  console.log("DossierBJ seed completed.");
} finally {
  await sql.end();
}
