import { NextResponse } from "next/server";
import { proxyToAscentAppSync } from "@/lib/backend";
import { authorizationFromSession } from "@/lib/session";
import {
  AppSyncTextAdventureSessionPayload,
  normalizeTextAdventureSessionPayload,
  textAdventureSessionQuery,
} from "@/lib/signals";

type TextAdventureSessionData = {
  getGeneratedTextAdventureSession?: AppSyncTextAdventureSessionPayload | null;
};

export async function GET(request: Request) {
  const authorization = authorizationFromSession(request);
  if (!authorization) {
    return NextResponse.json(
      {
        ok: false,
        message: "Enter the shared Ascent account before reading a Mission session.",
      },
      { status: 401 },
    );
  }

  const sessionId = safeQueryId(request, "sessionId");
  if (!sessionId) {
    return NextResponse.json(
      {
        ok: false,
        message: "sessionId is required.",
      },
      { status: 400 },
    );
  }

  const result = await proxyToAscentAppSync<TextAdventureSessionData>(authorization, textAdventureSessionQuery, {
    sessionId,
  });
  if (result.status !== 200) {
    return NextResponse.json(result.body, { status: result.status });
  }

  const session = normalizeTextAdventureSessionPayload((result.body as TextAdventureSessionData).getGeneratedTextAdventureSession);
  return NextResponse.json({ ok: true, session }, { status: 200 });
}

function safeQueryId(request: Request, fieldName: string) {
  const value = new URL(request.url).searchParams.get(fieldName)?.trim();
  return value && /^[A-Za-z0-9_.:-]{3,180}$/.test(value) ? value : null;
}
