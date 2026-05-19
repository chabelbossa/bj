import { AssistantPanel } from "@/components/assistant/AssistantPanel";
import { TrustNotice } from "@/components/ui/TrustNotice";

export const metadata = {
  title: "Assistant",
};

type AssistantPageProps = {
  searchParams: Promise<{
    q?: string | string[];
  }>;
};

export default async function AssistantPage({ searchParams }: AssistantPageProps) {
  const params = await searchParams;
  const query = Array.isArray(params.q) ? params.q[0] : params.q;
  const initialQuestion = query ? `Quelles informations vérifier pour : ${query} ?` : undefined;

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:py-12">
      <div className="max-w-3xl">
        <p className="text-sm font-semibold uppercase tracking-[0.08em] text-brand-strong">
          CivicRAG
        </p>
        <h1 className="mt-3 text-3xl font-bold sm:text-4xl">Assistant sourcé en mode mock</h1>
        <p className="mt-4 leading-7 text-muted">
          Cette interface teste la structure de réponse : citations, confiance, informations
          manquantes et vérification officielle recommandée.
        </p>
      </div>
      <div className="mt-6">
        <TrustNotice compact />
      </div>
      <div className="mt-8">
        <AssistantPanel initialQuestion={initialQuestion} />
      </div>
    </div>
  );
}
