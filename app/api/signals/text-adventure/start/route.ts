import { NextResponse } from "next/server";
import { proxyToAscentAppSync } from "@/lib/backend";
import { isSameOriginRequest } from "@/lib/request-guard";
import { authorizationFromSession } from "@/lib/session";
import {
  AppSyncTextAdventureSessionPayload,
  normalizeTextAdventureSessionPayload,
  readJsonRecord,
  readSafeId,
  startTextAdventureMutation,
} from "@/lib/signals";

type StartTextAdventureData = {
  startGeneratedTextAdventure?: AppSyncTextAdventureSessionPayload | null;
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
        message: "Enter the shared Ascent account before starting a Mission.",
      },
      { status: 401 },
    );
  }

  const body = await readJsonRecord(request);
  const generatedMissionInstanceId = readSafeId(body, "generatedMissionInstanceId");
  if (!generatedMissionInstanceId) {
    return NextResponse.json(
      {
        ok: false,
        message: "generatedMissionInstanceId is required.",
      },
      { status: 400 },
    );
  }

  const result = await proxyToAscentAppSync<StartTextAdventureData>(authorization, startTextAdventureMutation, {
    input: {
      generatedMissionInstanceId,
      clientRequestId: crypto.randomUUID(),
    },
  });
  if (result.status !== 200) {
    return NextResponse.json(result.body, { status: result.status });
  }

  const session = normalizeTextAdventureSessionPayload((result.body as StartTextAdventureData).startGeneratedTextAdventure);
  return NextResponse.json({ ok: true, session }, { status: 200 });
}
