import { describe, expect, it } from "vitest";

import { evaluateServicePublicDetail, servicePublicWatchlist } from "./sourceMonitor";

describe("source monitor", () => {
  it("accepts the current service-public snapshot shape", () => {
    const [casier] = servicePublicWatchlist;

    expect(casier).toBeDefined();

    const changes = evaluateServicePublicDetail(casier!, {
      overview: { status: "Actif" },
      eService: {
        delayTime: "72h",
        eApplicationFee: "1 900 FCFA",
        eRequiredDocuments:
          "Extrait d'acte de naissance sécurisé ou légalisé, Passeport et Preuve de séjour",
      },
    });

    expect(changes).toEqual([]);
  });

  it("reports changed public-service facts", () => {
    const [casier] = servicePublicWatchlist;

    expect(casier).toBeDefined();

    const changes = evaluateServicePublicDetail(casier!, {
      overview: { status: "Inactif" },
      eService: {
        delayTime: "7 jours",
        eApplicationFee: "2 500 FCFA",
        eRequiredDocuments: "Pièce différente",
      },
    });

    expect(changes.map((change) => change.field)).toEqual(["status", "fee", "delay", "documents"]);
  });
});
