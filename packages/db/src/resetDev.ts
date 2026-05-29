import { createSqlClient } from "./client";

const sql = await createSqlClient();

try {
  await sql`drop schema if exists drizzle cascade`;
  await sql`drop schema if exists public cascade`;
  await sql`create schema public`;
  await sql`grant all on schema public to public`;
  console.log("DossierBJ dev database reset completed.");
} finally {
  await sql.end();
}
