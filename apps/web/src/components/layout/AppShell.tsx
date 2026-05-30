import type { ReactNode } from "react";

import { getDataHealth } from "@/lib/data";

import { Footer } from "./Footer";
import { Header } from "./Header";

const getRuntimeLabels = async () => {
  const aiLabel = process.env.AI_PROVIDER === "openai" ? "IA OpenAI" : "IA locale";

  try {
    const health = await getDataHealth();

    if (health.dataMode === "postgres" && health.database.reachable) {
      return {
        dataLabel: "PostgreSQL",
        footerLabel: `Base PostgreSQL active · sources officielles partielles · ${aiLabel}`,
      };
    }

    if (health.dataMode === "postgres") {
      return {
        dataLabel: "Postgres hors ligne",
        footerLabel: `PostgreSQL configuré · connexion à vérifier · ${aiLabel}`,
      };
    }
  } catch {
    // Keep the shell renderable even if local environment variables are incomplete.
  }

  return {
    dataLabel: "Local",
    footerLabel: `Mode local · sources partielles · ${aiLabel}`,
  };
};

export async function AppShell({ children }: { children: ReactNode }) {
  const runtime = await getRuntimeLabels();

  return (
    <div
      style={{
        display: "flex",
        minHeight: "100dvh",
        flexDirection: "column",
        background: "var(--canvas)",
      }}
    >
      <Header dataLabel={runtime.dataLabel} />
      <main style={{ flex: 1 }}>{children}</main>
      <Footer runtimeLabel={runtime.footerLabel} />
    </div>
  );
}
