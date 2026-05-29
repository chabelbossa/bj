import { existsSync, readFileSync } from "node:fs";
import { dirname, join } from "node:path";

import { defineConfig } from "drizzle-kit";

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

export default defineConfig({
  schema: "./src/schema.ts",
  out: "./src/migrations",
  dialect: "postgresql",
  dbCredentials: {
    url:
      normalizeEnvValue("DATABASE_URL", process.env.DATABASE_URL) ??
      readEnvValueFromFile("DATABASE_URL") ??
      "",
  },
});
