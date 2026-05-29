export const siteConfig = {
  name: process.env.NEXT_PUBLIC_APP_NAME ?? "DossierBJ",
  url: process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000",
  disclaimer:
    "DossierBJ est un assistant indépendant. Vérifiez toujours les informations critiques auprès des plateformes officielles.",
};

export const navItems = [
  { href: "/", label: "Accueil" },
  { href: "/demarches", label: "Démarches" },
  { href: "/sources", label: "Sources" },
  { href: "/methode-verification", label: "Méthode" },
  { href: "/assistant", label: "Assistant" },
  { href: "/pulse", label: "Pulse" },
  { href: "/ux-lab", label: "UX Lab" },
  { href: "/open-civic-kit", label: "OpenCivic Kit" },
] as const;
