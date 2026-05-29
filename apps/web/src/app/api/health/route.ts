import { getDataHealth } from "@/lib/data";

export async function GET() {
  const health = await getDataHealth();

  return Response.json({
    status: "ok",
    app: process.env.NEXT_PUBLIC_APP_NAME ?? "DossierBJ",
    dataMode: health.dataMode,
    database: health.database,
    aiProvider: process.env.AI_PROVIDER ?? "mock",
  });
}
