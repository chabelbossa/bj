import type { VerificationStatus } from "../schemas";

export const formatVerificationStatus = (status: VerificationStatus) => {
  const labels: Record<VerificationStatus, string> = {
    verified: "Vérifié",
    partially_verified: "Partiellement vérifié",
    pending_verification: "Vérification en attente",
    demo_unverified: "Données de démonstration non officielles",
  };

  return labels[status];
};

export const formatFcfa = (amount: number) =>
  new Intl.NumberFormat("fr-BJ", {
    style: "currency",
    currency: "XOF",
    maximumFractionDigits: 0,
  }).format(amount);
