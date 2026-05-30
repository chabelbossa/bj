import { sourceCandidateDraftSchema } from "@dossierbj/core";

import { saveSourceCandidateDraft } from "@/lib/data";

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  const parsed = sourceCandidateDraftSchema.safeParse(body);

  if (!parsed.success) {
    return Response.json(
      {
        error: "invalid_source_candidate",
        message: "Le brouillon source est incomplet ou invalide.",
      },
      { status: 400 },
    );
  }

  const result = await saveSourceCandidateDraft(parsed.data);

  return Response.json(result);
}
