import { existsSync, readFileSync } from "node:fs";
import { dirname, join } from "node:path";

export type DataMode = "mock" | "postgres";

const normalizeEnvValue = (key: string, value: string | undefined) => {
  if (!value) {
    return undefined;
  }

  let normalized = value.trim();

  for (let attempt = 0; attempt < 3; attempt += 1) {
    normalized = normalized.replace(/^["']|["']$/gu, "").trim();

    if (!normalized.startsWith(`${key}=`)) {
      break;
    }

    normalized = normalized.slice(key.length + 1).trim();
  }

  return normalized.length > 0 ? normalized : undefined;
};

const readEnvValueFromFile = (key: string) => {
  try {
    let currentDir = process.cwd();

    for (let depth = 0; depth < 6; depth += 1) {
      const filePath = join(currentDir, ".env.local");

      if (existsSync(filePath)) {
        const match = readFileSync(filePath, "utf8")
          .split(/\r?\n/u)
          .map((line) => line.trim())
          .map((line) => line.match(new RegExp(`^${key}\\s*=\\s*(.+)$`, "u"))?.[1])
          .find((value): value is string => Boolean(value));

        if (match) {
          return normalizeEnvValue(key, match);
        }
      }

      const parent = dirname(currentDir);

      if (parent === currentDir) {
        break;
      }

      currentDir = parent;
    }
  } catch {
    return undefined;
  }

  return undefined;
};

const shouldIgnoreEnvFile = () =>
  process.env.DOSSIERBJ_IGNORE_ENV_FILE === "true" ||
  (process.env.VITEST === "true" && process.env.RUN_POSTGRES_TESTS !== "true");

const getEnvValue = (key: string) =>
  normalizeEnvValue(
    key,
    process.env[key] ?? (shouldIgnoreEnvFile() ? undefined : readEnvValueFromFile(key)),
  );

export const getDataMode = (): DataMode => {
  const value = getEnvValue("DATA_MODE") ?? "mock";

  if (value === "postgres") {
    return "postgres";
  }

  return "mock";
};

export const createDatabaseClient = async () => {
  if (getDataMode() === "mock") {
    return null;
  }

  const databaseUrl = getEnvValue("DATABASE_URL");

  if (!databaseUrl) {
    throw new Error("DATABASE_URL is required when DATA_MODE=postgres.");
  }

  const [{ default: postgres }, { drizzle }] = await Promise.all([
    import("postgres"),
    import("drizzle-orm/postgres-js"),
  ]);

  const sql = postgres(databaseUrl);

  return drizzle(sql);
};

export const requireDatabaseUrl = () => {
  const databaseUrl = getEnvValue("DATABASE_URL");

  if (!databaseUrl) {
    throw new Error("DATABASE_URL is required when DATA_MODE=postgres or running DB scripts.");
  }

  return databaseUrl;
};

export const createSqlClient = async () => {
  const databaseUrl = requireDatabaseUrl();
  const { default: postgres } = await import("postgres");

  return postgres(databaseUrl, {
    max: 1,
  });
};

export const checkDatabaseConnection = async () => {
  if (getDataMode() === "mock") {
    return {
      mode: "mock" as const,
      active: false,
      reachable: null,
    };
  }

  const sql = await createSqlClient();

  try {
    await sql`select 1`;

    return {
      mode: "postgres" as const,
      active: true,
      reachable: true,
    };
  } catch {
    return {
      mode: "postgres" as const,
      active: true,
      reachable: false,
    };
  } finally {
    await sql.end();
  }
};
