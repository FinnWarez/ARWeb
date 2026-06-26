import { NextResponse } from "next/server";
import { proxyToAscentAppSync } from "@/lib/backend";
import { isSameOriginRequest } from "@/lib/request-guard";
import { authorizationFromSession } from "@/lib/session";
import {
  advanceTextAdventureMutation,
  AppSyncTextAdventureSessionPayload,
  normalizeTextAdventureSessionPayload,
  readJsonRecord,
  readSafeId,
} from "@/lib/signals";

type AdvanceTextAdventureData = {
  advanceGeneratedTextAdventure?: AppSyncTextAdventureSessionPayload | null;
};

export async function POST(request: Request) {
  if (!isSameOriginRequest(request)) {
    return NextResponse.json(
      {
        ok: false,
        message: "The Text Adventure request is not allowed.",
      },
      { status: 403 },
    );
  }

  const authorization = authorizationFromSession(request);
  if (!authorization) {
    return NextResponse.json(
      {
        ok: false,
        message: "Enter the shared Ascent account before advancing a Mission.",
      },
      { status: 401 },
    );
  }

  const body = await readJsonRecord(request);
  const sessionId = readSafeId(body, "sessionId");
  const stepId = readSafeId(body, "stepId");
  const choiceId = readSafeId(body, "choiceId");
  const clientRequestId = readSafeId(body, "clientRequestId") ?? crypto.randomUUID();
  if (!sessionId || !stepId || !choiceId) {
    return NextResponse.json(
      {
        ok: false,
        message: "sessionId, stepId, and choiceId are required.",
      },
      { status: 400 },
    );
  }

  const result = await proxyToAscentAppSync<AdvanceTextAdventureData>(authorization, advanceTextAdventureMutation, {
    input: {
      sessionId,
      stepId,
      choiceId,
      clientRequestId,
    },
  });
  if (result.status !== 200) {
    return NextResponse.json(result.body, { status: result.status });
  }

  const session = normalizeTextAdventureSessionPayload((result.body as AdvanceTextAdventureData).advanceGeneratedTextAdventure);
  return NextResponse.json({ ok: true, session }, { status: 200 });
}
