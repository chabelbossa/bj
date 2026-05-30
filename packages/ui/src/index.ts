export const cn = (...classes: Array<string | false | null | undefined>) =>
  classes.filter(Boolean).join(" ");

export const OPEN_CIVIC_KIT_STATUS = "mvp-consumed";

export type CivicTone = "verified" | "warning" | "neutral";

export const formatFcfa = (amount: number) =>
  new Intl.NumberFormat("fr-BJ", {
    maximumFractionDigits: 0,
  }).format(amount) + " FCFA";

export const verificationTone = (status: string): CivicTone => {
  if (status === "verified") {
    return "verified";
  }

  if (status === "partially_verified" || status === "needs_human_review") {
    return "warning";
  }

  return "neutral";
};

export const openCivicKitManifest = {
  packageName: "@dossierbj/ui",
  status: OPEN_CIVIC_KIT_STATUS,
  publicHelpers: ["cn", "formatFcfa", "verificationTone"],
  designPrinciples: [
    "source-first",
    "independent-platform-disclaimer",
    "no-personal-document-storage",
  ],
} as const;
