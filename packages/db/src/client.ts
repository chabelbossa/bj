export type DataMode = "mock" | "postgres";

export const getDataMode = (): DataMode => {
  const value = process.env.DATA_MODE ?? "mock";

  if (value === "postgres") {
    return "postgres";
  }

  return "mock";
};

export const createDatabaseClient = async () => {
  if (getDataMode() === "mock") {
    return null;
  }

  const databaseUrl = process.env.DATABASE_URL;

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
