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
    <div style={{ maxWidth: 1200, margin: "0 auto", padding: "64px 24px" }}>
      {/* Page header */}
      <div style={{ maxWidth: 600, marginBottom: 32 }}>
        <span
          style={{
            display: "inline-flex",
            alignItems: "center",
            background: "var(--primary)",
            color: "var(--on-primary)",
            fontFamily: "var(--font-sans)",
            fontSize: 12,
            fontWeight: 500,
            letterSpacing: "1.5px",
            textTransform: "uppercase",
            padding: "4px 12px",
            borderRadius: "var(--radius-pill)",
            marginBottom: 20,
          }}
        >
          CivicRAG
        </span>
        <h1
          style={{
            fontFamily: "var(--font-serif)",
            fontSize: "clamp(28px, 4vw, 36px)",
            fontWeight: 400,
            lineHeight: 1.15,
            letterSpacing: 0,
            color: "var(--ink)",
            margin: "0 0 14px",
          }}
        >
          Assistant sourcé local
        </h1>
        <p
          style={{
            fontFamily: "var(--font-sans)",
            fontSize: 15,
            lineHeight: 1.7,
            color: "var(--muted)",
            margin: 0,
          }}
        >
          Cette interface utilise CivicRAG avec un provider IA local contrôlé. Les sources viennent
          du corpus seedé ou de PostgreSQL selon le mode actif.
        </p>
      </div>

      <div style={{ marginBottom: 32 }}>
        <TrustNotice compact />
      </div>

      <div>
        <AssistantPanel initialQuestion={initialQuestion} />
      </div>
    </div>
  );
}
