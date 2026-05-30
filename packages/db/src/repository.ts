import { eq } from "drizzle-orm";

import {
  createProcedureClaims,
  createProcedureSourceChunks,
  createSourceReviewEvents,
  demoProcedures,
  demoSourceReviewItems,
  getProcedureCategoriesFromList,
  getProcedureTargetUsersFromList,
  getSourceValidationSummary,
  officialSources as mockOfficialSources,
  pilotOpportunities,
  searchProcedureList,
  sourceDocuments as mockSourceDocuments,
  summarizeClaimCoverage,
  validateSourceIntegrity,
  type OfficialSource,
  type Opportunity,
  type Procedure,
  type ProcedureClaim,
  type ProcedureSearchFilters,
  type SourceReference,
  type SourceChunk,
  type SourceCandidateDraft,
  type SourceDocument,
  type SourceReviewEvent,
  type SourceReviewItem,
} from "@dossierbj/core";

import { checkDatabaseConnection, createDatabaseClient, getDataMode } from "./client";
import * as schema from "./schema";

const toIsoDate = (value: Date | string | null | undefined) => {
  if (!value) {
    return undefined;
  }

  if (typeof value === "string") {
    return value.slice(0, 10);
  }

  return value.toISOString().slice(0, 10);
};

const asArray = <T>(value: unknown, fallback: T[] = []): T[] =>
  Array.isArray(value) ? (value as T[]) : fallback;

type PersistedAssistantAnswer = {
  answer: string;
  citations: SourceReference[];
  confidence: "low" | "medium" | "high";
  missingInfo: string[];
  disclaimer: string;
  suggestedOfficialVerification: string;
};

export type ClaimReviewNoteInput = {
  claimId: string;
  procedureSlug?: string;
  note: string;
};

const readProceduresFromPostgres = async (): Promise<Procedure[]> => {
  const db = await createDatabaseClient();

  if (!db) {
    return demoProcedures;
  }

  const [procedureRows, documentRows, stepRows] = await Promise.all([
    db.select().from(schema.procedures),
    db.select().from(schema.requiredDocuments),
    db.select().from(schema.procedureSteps),
  ]);

  return procedureRows.map((row) => ({
    id: row.id,
    title: row.title,
    slug: row.slug,
    country: row.country,
    category: row.category,
    aliases: row.aliases,
    targetUsers: row.targetUsers,
    summary: row.summary,
    userNeed: row.userNeed,
    expectedOutcome: row.expectedOutcome,
    officialUrl: row.officialUrl ?? undefined,
    estimatedDuration: row.estimatedDuration ?? undefined,
    officialCost: row.officialCost ?? undefined,
    requiredDocuments: documentRows
      .filter((document) => document.procedureId === row.id)
      .map((document) => ({
        id: document.id,
        name: document.name,
        description: document.description,
        required: document.required,
        condition: document.condition ?? undefined,
        sourceRefs: asArray(document.sourceRefs),
      })),
    steps: stepRows
      .filter((step) => step.procedureId === row.id)
      .sort((a, b) => a.order - b.order)
      .map((step) => ({
        id: step.id,
        order: step.order,
        title: step.title,
        description: step.description,
        sourceRefs: asArray(step.sourceRefs),
      })),
    preparationHints: row.preparationHints,
    pointsToVerify: row.pointsToVerify,
    verifiedFacts: asArray(row.verifiedFacts),
    warnings: row.warnings,
    sources: asArray(row.sources),
    sourceStatusNote: row.sourceStatusNote,
    lastVerifiedAt: toIsoDate(row.lastVerifiedAt) ?? "2026-05-19",
    verificationStatus: row.verificationStatus,
  }));
};

export const listProcedures = async () => {
  if (getDataMode() === "mock") {
    return demoProcedures;
  }

  return readProceduresFromPostgres();
};

export const getProcedureBySlug = async (slug: string) => {
  const procedures = await listProcedures();

  return procedures.find((procedure) => procedure.slug === slug);
};

export const searchProcedureData = async (filters: ProcedureSearchFilters = {}) => {
  const procedures = await listProcedures();

  return searchProcedureList(procedures, filters);
};

export const getProcedureFilterData = async () => {
  const procedures = await listProcedures();

  return {
    categories: getProcedureCategoriesFromList(procedures),
    targets: getProcedureTargetUsersFromList(procedures),
  };
};

export const listProcedureClaims = async (): Promise<ProcedureClaim[]> => {
  if (getDataMode() === "mock") {
    return createProcedureClaims(demoProcedures);
  }

  const db = await createDatabaseClient();

  if (!db) {
    return createProcedureClaims(demoProcedures);
  }

  const rows = await db.select().from(schema.procedureClaims);

  return rows.map((row) => ({
    id: row.id,
    procedureId: row.procedureId,
    procedureSlug: row.procedureSlug,
    type: row.type,
    label: row.label,
    value: row.value,
    status: row.status,
    sourceRefs: asArray(row.sourceRefs),
    note: row.note ?? undefined,
    sourceField: row.sourceField ?? undefined,
  }));
};

export const getProcedureClaimsBySlug = async (slug: string): Promise<ProcedureClaim[]> => {
  if (getDataMode() === "mock") {
    return createProcedureClaims(demoProcedures).filter((claim) => claim.procedureSlug === slug);
  }

  const db = await createDatabaseClient();

  if (!db) {
    return createProcedureClaims(demoProcedures).filter((claim) => claim.procedureSlug === slug);
  }

  const rows = await db
    .select()
    .from(schema.procedureClaims)
    .where(eq(schema.procedureClaims.procedureSlug, slug));

  return rows.map((row) => ({
    id: row.id,
    procedureId: row.procedureId,
    procedureSlug: row.procedureSlug,
    type: row.type,
    label: row.label,
    value: row.value,
    status: row.status,
    sourceRefs: asArray(row.sourceRefs),
    note: row.note ?? undefined,
    sourceField: row.sourceField ?? undefined,
  }));
};

export const getClaimCoverageData = async () => {
  const claims = await listProcedureClaims();

  return summarizeClaimCoverage(claims);
};

export const listOpportunities = async (): Promise<Opportunity[]> => {
  if (getDataMode() === "mock") {
    return pilotOpportunities;
  }

  const db = await createDatabaseClient();

  if (!db) {
    return pilotOpportunities;
  }

  const rows = await db.select().from(schema.opportunities);

  return rows.map((row) => ({
    id: row.id,
    title: row.title,
    sourceUrl: row.sourceUrl,
    authority: row.authority,
    country: row.country,
    sector: row.sector,
    deadline: toIsoDate(row.deadline) ?? "",
    summary: row.summary,
    requiredDocuments: asArray(row.requiredDocuments),
    eligibility: row.eligibility,
    status: row.status,
  }));
};

export const listOfficialSources = async (): Promise<OfficialSource[]> => {
  if (getDataMode() === "mock") {
    return mockOfficialSources;
  }

  const db = await createDatabaseClient();

  if (!db) {
    return mockOfficialSources;
  }

  const rows = await db.select().from(schema.officialSources);

  return rows.map((row) => ({
    id: row.id,
    name: row.name,
    country: row.country,
    institution: row.institution,
    url: row.url,
    sourceType: row.sourceType,
    reliabilityLevel: row.reliabilityLevel,
    lastCheckedAt: toIsoDate(row.lastCheckedAt) ?? "2026-05-19",
    status: row.status,
  }));
};

export const listSourceDocuments = async (): Promise<SourceDocument[]> => {
  if (getDataMode() === "mock") {
    return mockSourceDocuments;
  }

  const db = await createDatabaseClient();

  if (!db) {
    return mockSourceDocuments;
  }

  const rows = await db.select().from(schema.sourceDocuments);

  return rows.map((row) => ({
    id: row.id,
    sourceId: row.sourceId,
    title: row.title,
    url: row.url,
    contentType: row.contentType,
    retrievedAt: toIsoDate(row.retrievedAt) ?? "2026-05-19",
    version: row.version,
    checksum: row.checksum ?? undefined,
    status: row.status,
  }));
};

export const listSourceReviewItems = async (): Promise<SourceReviewItem[]> => {
  if (getDataMode() === "mock") {
    return demoSourceReviewItems;
  }

  const db = await createDatabaseClient();

  if (!db) {
    return demoSourceReviewItems;
  }

  const rows = await db.select().from(schema.sourceReviewItems);

  return rows.map((row) => ({
    id: row.id,
    title: row.title,
    module: row.module,
    country: row.country,
    authority: row.authority,
    candidateUrl: row.candidateUrl,
    status: row.status as SourceReviewItem["status"],
    priority: row.priority as SourceReviewItem["priority"],
    notes: row.notes,
    relatedProcedureSlugs: row.relatedProcedureSlugs,
    lastReviewedAt: toIsoDate(row.lastReviewedAt),
  }));
};

export const getSourceReviewSummaryData = async () => {
  const reviewItems = await listSourceReviewItems();

  return {
    total: reviewItems.length,
    highPriority: reviewItems.filter((item) => item.priority === "high").length,
    toConnect: reviewItems.filter((item) => item.status === "to_connect").length,
    verified: reviewItems.filter((item) => item.status === "verified").length,
    needsHumanReview: reviewItems.filter((item) => item.status === "needs_human_review").length,
  };
};

export const listSourceChunks = async (): Promise<SourceChunk[]> => {
  if (getDataMode() === "mock") {
    return createProcedureSourceChunks(demoProcedures);
  }

  const db = await createDatabaseClient();

  if (!db) {
    return createProcedureSourceChunks(demoProcedures);
  }

  const rows = await db.select().from(schema.sourceChunks);

  return rows.map((row) => ({
    id: row.id,
    documentId: row.documentId,
    content: row.content,
    position: row.position,
    metadata: row.metadata,
    sourceRefs: asArray(row.sourceRefs),
  }));
};

export const saveAssistantQuery = async ({
  question,
  answer,
}: {
  question: string;
  answer: PersistedAssistantAnswer;
}) => {
  if (getDataMode() !== "postgres") {
    return;
  }

  const db = await createDatabaseClient();

  if (!db) {
    return;
  }

  await db.insert(schema.assistantQueries).values({
    id: `assistant-query-${Date.now()}-${Math.random().toString(36).slice(2)}`,
    question,
    answer,
    confidence: answer.confidence,
    citations: answer.citations,
  });
};

export const saveSourceCandidateDraft = async (draft: SourceCandidateDraft) => {
  if (getDataMode() !== "postgres") {
    return { persisted: false, reason: "DATA_MODE is not postgres" };
  }

  const db = await createDatabaseClient();

  if (!db) {
    return { persisted: false, reason: "database unavailable" };
  }

  await db.insert(schema.auditLogs).values({
    id: `audit-source-candidate-${draft.id}-${Date.now()}`,
    actorId: "local-editor",
    action: "source_candidate_draft.created",
    targetType: "source_candidate_draft",
    targetId: draft.id,
    metadata: JSON.parse(JSON.stringify(draft)) as Record<string, unknown>,
  });

  return { persisted: true };
};

export const saveClaimReviewNote = async (input: ClaimReviewNoteInput) => {
  if (getDataMode() !== "postgres") {
    return { persisted: false, reason: "DATA_MODE is not postgres" };
  }

  const db = await createDatabaseClient();

  if (!db) {
    return { persisted: false, reason: "database unavailable" };
  }

  await db.insert(schema.auditLogs).values({
    id: `audit-claim-note-${input.claimId}-${Date.now()}`,
    actorId: "local-editor",
    action: "claim_review_note.saved",
    targetType: "procedure_claim",
    targetId: input.claimId,
    metadata: {
      note: input.note,
      procedureSlug: input.procedureSlug,
    },
  });

  return { persisted: true };
};

export const getSourceValidationData = async () => {
  const [procedures, reviewItems, claims] = await Promise.all([
    listProcedures(),
    listSourceReviewItems(),
    listProcedureClaims(),
  ]);
  const issues = validateSourceIntegrity({ procedures, reviewItems, claims });

  return {
    issues,
    summary: getSourceValidationSummary(issues),
  };
};

export const getDataHealth = async () => {
  const database = await checkDatabaseConnection();

  return {
    dataMode: getDataMode(),
    database,
  };
};

export const getAssistantQueryCount = async () => {
  if (getDataMode() !== "postgres") {
    return 0;
  }

  const db = await createDatabaseClient();

  if (!db) {
    return 0;
  }

  const rows = await db.select({ id: schema.assistantQueries.id }).from(schema.assistantQueries);

  return rows.length;
};

export const getSourceReviewItemById = async (id: string) => {
  const items = await listSourceReviewItems();

  return items.find((item) => item.id === id);
};

export const getSourceReviewEventsByItemId = async (id: string): Promise<SourceReviewEvent[]> => {
  if (getDataMode() !== "postgres") {
    return createSourceReviewEvents(demoSourceReviewItems).filter(
      (event) => event.reviewItemId === id,
    );
  }

  const db = await createDatabaseClient();

  if (!db) {
    return createSourceReviewEvents(demoSourceReviewItems).filter(
      (event) => event.reviewItemId === id,
    );
  }

  const rows = await db
    .select()
    .from(schema.sourceReviewEvents)
    .where(eq(schema.sourceReviewEvents.reviewItemId, id));

  return rows.map((row) => ({
    id: row.id,
    reviewItemId: row.reviewItemId,
    status: row.status as SourceReviewEvent["status"],
    note: row.note,
    reviewedAt: toIsoDate(row.reviewedAt) ?? "2026-05-19",
    actor: row.actor,
  }));
};
