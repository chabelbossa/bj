import { demoProcedures } from "../seed";
import type { Procedure, SourceChunk } from "../schemas";
import { getProcedureClaimsBySlug } from "../procedures/claims";

export const createProcedureSourceChunks = (
  procedures: Procedure[] = demoProcedures,
): SourceChunk[] =>
  procedures.map((procedure, index) => {
    const claims = getProcedureClaimsBySlug(procedure.slug, procedures);

    return {
      id: `procedure-chunk-${procedure.slug}`,
      documentId: procedure.sources[0]?.documentId ?? "demo-source-document-to-connect",
      content: [
        procedure.title,
        procedure.category,
        procedure.summary,
        procedure.userNeed,
        procedure.expectedOutcome,
        procedure.estimatedDuration,
        procedure.officialCost,
        ...procedure.aliases,
        ...procedure.targetUsers,
        ...procedure.sources.map((source) => `${source.title} ${source.excerpt ?? ""}`),
        ...procedure.verifiedFacts.map((fact) => `${fact.label} ${fact.value} ${fact.note ?? ""}`),
        ...claims.map((claim) => `${claim.type} ${claim.label} ${claim.value} ${claim.note ?? ""}`),
        ...procedure.requiredDocuments.map(
          (document) => `${document.name} ${document.description} ${document.condition ?? ""}`,
        ),
        ...procedure.steps.map((step) => `${step.title} ${step.description}`),
        ...procedure.pointsToVerify,
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
        aliases: procedure.aliases,
        verificationStatus: procedure.verificationStatus,
        demo: procedure.verificationStatus === "demo_unverified",
        facts: procedure.verifiedFacts.map((fact) => ({
          label: fact.label,
          value: fact.value,
          status: fact.status,
        })),
        claims: claims.map((claim) => ({
          label: claim.label,
          value: claim.value,
          type: claim.type,
          status: claim.status,
        })),
      },
      sourceRefs: procedure.sources,
    };
  });
