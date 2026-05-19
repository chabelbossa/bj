import { demoProcedures, type SourceChunk } from "@dossierbj/core";

import { createKeywordRetriever } from "./keywordRetriever";

export const createMockSourceChunks = (): SourceChunk[] =>
  demoProcedures.map((procedure, index) => ({
    id: `demo-chunk-${procedure.slug}`,
    documentId: procedure.sources[0]?.documentId ?? "demo-source-document-to-connect",
    content: [
      procedure.title,
      procedure.category,
      procedure.summary,
      procedure.estimatedDuration,
      procedure.officialCost,
      ...procedure.targetUsers,
      ...procedure.sources.map((source) => `${source.title} ${source.excerpt ?? ""}`),
      ...procedure.verifiedFacts.map((fact) => `${fact.label} ${fact.value} ${fact.note ?? ""}`),
      ...procedure.requiredDocuments.map((document) => document.description),
      ...procedure.steps.map((step) => `${step.title} ${step.description}`),
      ...procedure.warnings,
    ]
      .filter(Boolean)
      .join(" "),
    position: index,
    metadata: {
      procedureId: procedure.id,
      title: procedure.title,
      slug: procedure.slug,
      category: procedure.category,
      verificationStatus: procedure.verificationStatus,
      demo: procedure.verificationStatus === "demo_unverified",
      facts: procedure.verifiedFacts.map((fact) => ({
        label: fact.label,
        value: fact.value,
        status: fact.status,
      })),
    },
    sourceRefs: procedure.sources,
  }));

export const mockRetriever = createKeywordRetriever(createMockSourceChunks());
