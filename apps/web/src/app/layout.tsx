import type { Metadata } from "next";

import { AppShell } from "@/components/layout/AppShell";
import { siteConfig } from "@/lib/site";
import "@/styles/globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    default: "DossierBJ - Assistant documentaire indépendant",
    template: "%s | DossierBJ",
  },
  description:
    "DossierBJ aide à comprendre, préparer et suivre des démarches à partir de sources vérifiables.",
  keywords: [
    "DossierBJ",
    "Bénin",
    "démarches administratives",
    "service-public.bj",
    "civictech",
    "open source",
  ],
  authors: [{ name: "DossierBJ contributors" }],
  creator: "DossierBJ contributors",
  publisher: "DossierBJ",
  manifest: "/manifest.webmanifest",
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    locale: "fr_BJ",
    url: "/",
    siteName: "DossierBJ",
    title: "DossierBJ - Assistant documentaire indépendant",
    description:
      "Un MVP civictech open source pour préparer des démarches au Bénin avec sources, citations et base PostgreSQL optionnelle.",
  },
  twitter: {
    card: "summary",
    title: "DossierBJ - Assistant documentaire indépendant",
    description:
      "Démarches, citations, checklists et assistant CivicRAG local pour tester une civictech béninoise frugale.",
  },
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
