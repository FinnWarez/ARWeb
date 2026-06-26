import { NextResponse } from "next/server";
import { proxyToAscentAppSync } from "@/lib/backend";
import { authorizationFromSession } from "@/lib/session";
import { AppSyncSignalsData, normalizeSignalStream, signalsQuery } from "@/lib/signals";

export async function GET(request: Request) {
  const authorization = authorizationFromSession(request);
  if (!authorization) {
    return NextResponse.json(
      {
        ok: false,
        message: "Enter the shared Ascent account before reading the Signal Stream.",
      },
      { status: 401 },
    );
  }

  const result = await proxyToAscentAppSync<AppSyncSignalsData>(authorization, signalsQuery, {
    limit: 8,
    receiptLimit: 4,
  });
  if (result.status !== 200) {
    return NextResponse.json(result.body, { status: result.status });
  }

  return NextResponse.json(
    {
      ok: true,
      stream: normalizeSignalStream(result.body as AppSyncSignalsData),
    },
    { status: 200 },
  );
}
