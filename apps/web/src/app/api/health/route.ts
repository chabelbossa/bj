export async function GET() {
  return Response.json({
    status: "ok",
    app: process.env.NEXT_PUBLIC_APP_NAME ?? "DossierBJ",
    dataMode: process.env.DATA_MODE ?? "mock",
    aiProvider: process.env.AI_PROVIDER ?? "mock",
  });
}
