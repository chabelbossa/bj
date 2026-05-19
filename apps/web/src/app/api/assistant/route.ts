import { answerWithConfiguredRag } from "@dossierbj/rag";

export async function POST(request: Request) {
  const body = (await request.json().catch(() => null)) as { question?: unknown } | null;
  const question = typeof body?.question === "string" ? body.question.trim() : "";

  if (!question) {
    return Response.json(
      {
        error: "question_required",
        message: "La question est obligatoire.",
      },
      { status: 400 },
    );
  }

  const answer = await answerWithConfiguredRag(question, {
    AI_PROVIDER: process.env.AI_PROVIDER ?? "mock",
  }).catch((error: unknown) => {
    if (error instanceof Error && error.message.includes("AI_PROVIDER")) {
      return Response.json(
        {
          error: "ai_provider_not_enabled",
          message:
            "Seul AI_PROVIDER=mock est activé dans ce MVP. Aucun provider payant n'est appelé.",
        },
        { status: 501 },
      );
    }

    throw error;
  });

  if (answer instanceof Response) {
    return answer;
  }

  return Response.json(answer);
}
