import { saveClaimReviewNote } from "@/lib/data";

export async function POST(request: Request) {
  const body = (await request.json().catch(() => null)) as {
    claimId?: unknown;
    procedureSlug?: unknown;
    note?: unknown;
  } | null;
  const claimId = typeof body?.claimId === "string" ? body.claimId.trim() : "";
  const procedureSlug =
    typeof body?.procedureSlug === "string" ? body.procedureSlug.trim() : undefined;
  const note = typeof body?.note === "string" ? body.note.trim() : "";

  if (!claimId || !note || note.length > 4_000) {
    return Response.json(
      {
        error: "invalid_claim_review_note",
        message: "La note de revue est vide ou invalide.",
      },
      { status: 400 },
    );
  }

  const result = await saveClaimReviewNote({ claimId, procedureSlug, note });

  return Response.json(result);
}
