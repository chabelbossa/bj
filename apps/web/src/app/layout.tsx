import type { Metadata } from "next";

import { AppShell } from "@/components/layout/AppShell";
import "@/styles/globals.css";

export const metadata: Metadata = {
  title: {
    default: "DossierBJ - Assistant documentaire indépendant",
    template: "%s | DossierBJ",
  },
  description:
    "DossierBJ aide à comprendre, préparer et suivre des démarches à partir de sources vérifiables.",
  manifest: "/manifest.webmanifest",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr" suppressHydrationWarning>
      <body style={{ fontFamily: "var(--font-sans)" }}>
        <AppShell>{children}</AppShell>
      </body>
    </html>
  );
}
