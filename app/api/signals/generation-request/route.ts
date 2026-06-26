import { NextResponse } from "next/server";
import { proxyToAscentAppSync } from "@/lib/backend";
import { authorizationFromSession } from "@/lib/session";
import { generatedMissionRequestQuery } from "@/lib/signals";

type GeneratedMissionRequestData = {
  getMyGeneratedMissionRequest?: {
    generationRequestId: string;
    status: string;
    fallbackRecommended: boolean;
    createdAt: string;
    updatedAt: string;
  } | null;
};

export async function GET(request: Request) {
  const authorization = authorizationFromSession(request);
  if (!authorization) {
    return NextResponse.json(
      {
        ok: false,
        message: "Enter the shared Ascent account before reading Signal requests.",
      },
      { status: 401 },
    );
  }

  const generationRequestId = safeQueryId(request, "generationRequestId");
  if (!generationRequestId) {
    return NextResponse.json(
      {
        ok: false,
        message: "generationRequestId is required.",
      },
      { status: 400 },
    );
  }

  const result = await proxyToAscentAppSync<GeneratedMissionRequestData>(authorization, generatedMissionRequestQuery, {
    generationRequestId,
  });
  if (result.status !== 200) {
    return NextResponse.json(result.body, { status: result.status });
  }

  return NextResponse.json(
    {
      ok: true,
      request: (result.body as GeneratedMissionRequestData).getMyGeneratedMissionRequest,
    },
    { status: 200 },
  );
}

function safeQueryId(request: Request, fieldName: string) {
  const value = new URL(request.url).searchParams.get(fieldName)?.trim();
  return value && /^[A-Za-z0-9_.:-]{3,180}$/.test(value) ? value : null;
}
