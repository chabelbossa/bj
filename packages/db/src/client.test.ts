import { afterEach, describe, expect, it } from "vitest";

import { createDatabaseClient, getDataMode } from "./client";

const previousDataMode = process.env.DATA_MODE;
const previousDatabaseUrl = process.env.DATABASE_URL;

afterEach(() => {
  if (previousDataMode === undefined) {
    delete process.env.DATA_MODE;
  } else {
    process.env.DATA_MODE = previousDataMode;
  }

  if (previousDatabaseUrl === undefined) {
    delete process.env.DATABASE_URL;
  } else {
    process.env.DATABASE_URL = previousDatabaseUrl;
  }
});

describe("database client mode", () => {
  it("defaults to mock mode", () => {
    delete process.env.DATA_MODE;

    expect(getDataMode()).toBe("mock");
  });

  it("does not require DATABASE_URL in mock mode", async () => {
    process.env.DATA_MODE = "mock";
    delete process.env.DATABASE_URL;

    await expect(createDatabaseClient()).resolves.toBeNull();
  });

  it("requires DATABASE_URL only in postgres mode", async () => {
    process.env.DATA_MODE = "postgres";
    delete process.env.DATABASE_URL;

    await expect(createDatabaseClient()).rejects.toThrow("DATABASE_URL");
  });
});
