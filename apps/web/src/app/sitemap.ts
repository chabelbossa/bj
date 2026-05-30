import type { MetadataRoute } from "next";

import { listProcedures } from "@/lib/data";
import { siteConfig } from "@/lib/site";

const staticRoutes = [
  "",
  "/demarches",
  "/assistant",
  "/sources",
  "/sources/claims",
  "/sources/nouvelle",
  "/methode-verification",
  "/pulse",
  "/ao-radar",
  "/ux-lab",
  "/open-civic-kit",
];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const procedures = await listProcedures();
  const today = "2026-05-30";

  return [
    ...staticRoutes.map((route) => ({
      url: `${siteConfig.url}${route}`,
      lastModified: today,
      changeFrequency: "weekly" as const,
      priority: route === "" ? 1 : 0.7,
    })),
    ...procedures.map((procedure) => ({
      url: `${siteConfig.url}/demarches/${procedure.slug}`,
      lastModified: procedure.lastVerifiedAt,
      changeFrequency: "weekly" as const,
      priority: procedure.verificationStatus === "demo_unverified" ? 0.4 : 0.8,
    })),
  ];
}
