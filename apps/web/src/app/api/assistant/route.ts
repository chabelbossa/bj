import { listSourceChunks, saveAssistantQuery } from "@/lib/data";
import { createCivicRag, createKeywordRetriever, resolveAiProvider } from "@dossierbj/rag";

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

  const answer = await Promise.all([
    listSourceChunks(),
    Promise.resolve(
      resolveAiProvider({
        AI_PROVIDER: process.env.AI_PROVIDER ?? "mock",
        OPENAI_API_KEY: process.env.OPENAI_API_KEY,
        OPENAI_BASE_URL: process.env.OPENAI_BASE_URL,
        OPENAI_MODEL: process.env.OPENAI_MODEL,
        OPENAI_TIMEOUT_MS: process.env.OPENAI_TIMEOUT_MS,
      }),
    ),
  ])
    .then(([chunks, provider]) =>
      createCivicRag({
        retriever: createKeywordRetriever(chunks),
        provider,
      }).answerQuestion({ question }),
    )
    .catch((error: unknown) => {
      if (
        error instanceof Error &&
        (error.message.includes("AI_PROVIDER") || error.message.includes("OPENAI_API_KEY"))
      ) {
        return Response.json(
          {
            error: "ai_provider_not_configured",
            message:
              "Le provider IA demandé n'est pas configuré. Utilisez AI_PROVIDER=mock ou configurez AI_PROVIDER=openai avec OPENAI_API_KEY.",
          },
          { status: 503 },
        );
      }

      if (error instanceof Error && error.message.includes("OpenAI Responses API")) {
        return Response.json(
          {
            error: "ai_provider_failed",
            message:
              "Le provider IA externe n'a pas pu répondre. Repassez temporairement en AI_PROVIDER=mock ou vérifiez la configuration OpenAI.",
          },
          { status: 502 },
        );
      }

      throw error;
    });

  if (answer instanceof Response) {
    return answer;
  }

  await saveAssistantQuery({ question, answer });

  return Response.json(answer);
}
