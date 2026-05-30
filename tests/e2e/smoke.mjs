import { spawn } from "node:child_process";
import { once } from "node:events";

const rootUrl = (port) => `http://127.0.0.1:${port}`;
const port = Number(process.env.E2E_PORT ?? 3107);
const dataMode = process.env.DATA_MODE ?? "mock";
const aiProvider = process.env.AI_PROVIDER ?? "mock";
const timeoutMs = Number(process.env.E2E_TIMEOUT_MS ?? 45_000);
const startedAt = Date.now();
let logs = "";

const devServer = spawn(
  "pnpm",
  [
    "--filter",
    "@dossierbj/web",
    "exec",
    "next",
    "dev",
    "--hostname",
    "127.0.0.1",
    "--port",
    String(port),
  ],
  {
    cwd: new URL("../..", import.meta.url),
    env: {
      ...process.env,
      AI_PROVIDER: aiProvider,
      DATA_MODE: dataMode,
      NEXT_PUBLIC_APP_URL: rootUrl(port),
      NEXT_TELEMETRY_DISABLED: "1",
    },
    detached: true,
    stdio: ["ignore", "pipe", "pipe"],
  },
);

const appendLog = (chunk) => {
  logs += chunk.toString();
  logs = logs.slice(-8_000);
};

devServer.stdout.on("data", appendLog);
devServer.stderr.on("data", appendLog);

const signalServerGroup = (signal) => {
  if (devServer.pid && !devServer.killed) {
    try {
      process.kill(-devServer.pid, signal);
    } catch {
      try {
        devServer.kill(signal);
      } catch {
        // The dev server is already stopped.
      }
    }
  }
};

const stopServer = () => signalServerGroup("SIGTERM");

const stopServerAndWait = async () => {
  if (devServer.exitCode !== null) {
    return;
  }

  signalServerGroup("SIGTERM");

  const exited = await Promise.race([
    once(devServer, "exit").then(() => true),
    sleep(3_000).then(() => false),
  ]);

  if (!exited) {
    signalServerGroup("SIGKILL");
  }
};

process.on("exit", stopServer);
process.on("SIGINT", () => {
  stopServer();
  process.exit(130);
});
process.on("SIGTERM", () => {
  stopServer();
  process.exit(143);
});

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const fetchText = async (path, options) => {
  const response = await fetch(`${rootUrl(port)}${path}`, options);
  const text = await response.text();

  return { response, text };
};

const waitForServer = async () => {
  while (Date.now() - startedAt < timeoutMs) {
    if (devServer.exitCode !== null) {
      throw new Error(`Next dev exited early with code ${devServer.exitCode}\n${logs}`);
    }

    try {
      const { response } = await fetchText("/api/health");

      if (response.ok) {
        return;
      }
    } catch {
      await sleep(400);
    }
  }

  throw new Error(`Timed out waiting for Next dev on ${rootUrl(port)}\n${logs}`);
};

const assertIncludes = (text, expected, label) => {
  const missing = expected.filter((item) => !text.includes(item));

  if (missing.length > 0) {
    throw new Error(`${label} is missing: ${missing.join(", ")}`);
  }
};

const checkPage = async (path, expected) => {
  const { response, text } = await fetchText(path);

  if (!response.ok) {
    throw new Error(`${path} returned ${response.status}`);
  }

  assertIncludes(text, expected, path);

  return { path, status: response.status, ok: true };
};

const checkHealth = async () => {
  const { response, text } = await fetchText("/api/health");

  if (!response.ok) {
    throw new Error(`/api/health returned ${response.status}`);
  }

  const health = JSON.parse(text);

  if (health.dataMode !== dataMode) {
    throw new Error(`Expected dataMode=${dataMode}, received ${health.dataMode}`);
  }

  if (health.aiProvider !== aiProvider) {
    throw new Error(`Expected aiProvider=${aiProvider}, received ${health.aiProvider}`);
  }

  if (dataMode === "postgres" && health.database?.active !== true) {
    throw new Error("Expected postgres database to be active in health response");
  }

  return { path: "/api/health", status: response.status, dataMode: health.dataMode, ok: true };
};

const checkAssistant = async () => {
  const { response, text } = await fetchText("/api/assistant", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ question: "Quels sont les frais de création d'entreprise ?" }),
  });

  if (!response.ok) {
    throw new Error(`/api/assistant returned ${response.status}: ${text}`);
  }

  const answer = JSON.parse(text);
  const requiredKeys = ["answer", "citations", "confidence", "missingInfo", "disclaimer"];
  const missingKeys = requiredKeys.filter((key) => !(key in answer));

  if (missingKeys.length > 0) {
    throw new Error(`/api/assistant missing keys: ${missingKeys.join(", ")}`);
  }

  if (!Array.isArray(answer.citations)) {
    throw new Error("/api/assistant citations must be an array");
  }

  if (!answer.disclaimer.includes("indépendante")) {
    throw new Error("/api/assistant disclaimer must mention platform independence");
  }

  return {
    path: "/api/assistant",
    status: response.status,
    citations: answer.citations.length,
    ok: true,
  };
};

const checkEditorialApis = async () => {
  const sourceCandidate = await fetchText("/api/source-candidates", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({
      id: "source-candidate-smoke-test-2026-05-30",
      title: "Source smoke",
      module: "DossierBJ Core",
      country: "BJ",
      authority: "Institution smoke",
      candidateUrl: "https://example.org/source-smoke",
      priority: "medium",
      relatedProcedureSlugs: ["creation-entreprise"],
      notes: ["Smoke test"],
      createdAt: "2026-05-30",
    }),
  });

  if (!sourceCandidate.response.ok) {
    throw new Error(`/api/source-candidates returned ${sourceCandidate.response.status}`);
  }

  const claimNote = await fetchText("/api/claim-review-notes", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({
      claimId: "claim-smoke",
      procedureSlug: "creation-entreprise",
      note: "Smoke note",
    }),
  });

  if (!claimNote.response.ok) {
    throw new Error(`/api/claim-review-notes returned ${claimNote.response.status}`);
  }

  return { path: "/api/editorial", status: 200, ok: true };
};

try {
  await waitForServer();

  const results = [
    await checkHealth(),
    await checkPage("/demarches", ["Démarches", "Création d'entreprise", "partiellement vérifiée"]),
    await checkPage("/demarches/creation-entreprise", [
      "Création d'entreprise",
      "Ce qui reste à vérifier",
      "Sources et citations",
      "Checklist",
    ]),
    await checkPage("/sources", [
      "Sources à vérifier",
      "Couverture du corpus",
      "Revoir les claims",
      "Proposer une source candidate",
    ]),
    await checkPage("/sources/claims", [
      "Claims à revoir",
      "Filtres de revue",
      "Limite volontaire",
    ]),
    await checkPage("/sources/nouvelle", [
      "Proposer une source candidate",
      "Brouillons locaux",
      "Règle de validation",
    ]),
    await checkPage("/sources/source-review-business-creation", [
      "Claims liés à cette revue",
      "Prêt pour vérification ?",
      "Historique",
    ]),
    await checkPage("/pulse", ["Observatoire public léger", "Services suivis"]),
    await checkPage("/ao-radar", ["Pilote appels d", "Checklist de pré-soumission"]),
    await checkPage("/open-civic-kit", ["Manifest public", "formatFcfa"]),
    await checkAssistant(),
    await checkEditorialApis(),
  ];

  console.log(JSON.stringify({ dataMode, aiProvider, results }, null, 2));
} catch (error) {
  console.error(error instanceof Error ? error.message : error);
  console.error(logs);
  process.exitCode = 1;
} finally {
  await stopServerAndWait();
}
