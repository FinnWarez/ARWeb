import { NextResponse } from "next/server";
import { proxyToAscentAppSync } from "@/lib/backend";
import { isSameOriginRequest } from "@/lib/request-guard";
import { authorizationFromSession } from "@/lib/session";
import {
  AppSyncSignalContextData,
  buildWebsiteGenerationInput,
  requestGeneratedMissionsMutation,
  signalGenerationContextQuery,
} from "@/lib/signals";

type GeneratedMissionRequestData = {
  requestGeneratedMissions?: {
    generationRequestId: string;
    status: string;
    fallbackRecommended: boolean;
    createdAt: string;
    updatedAt: string;
  } | null;
};

export async function POST(request: Request) {
  if (!isSameOriginRequest(request)) {
    return NextResponse.json(
      {
        ok: false,
        message: "The Signal request is not allowed.",
      },
      { status: 403 },
    );
  }

  const authorization = authorizationFromSession(request);
  if (!authorization) {
    return NextResponse.json(
      {
        ok: false,
        message: "Enter the shared Ascent account before requesting Signals.",
      },
      { status: 401 },
    );
  }

  const contextResult = await proxyToAscentAppSync<AppSyncSignalContextData>(authorization, signalGenerationContextQuery, {});
  if (contextResult.status !== 200) {
    return NextResponse.json(contextResult.body, { status: contextResult.status });
  }

  const input = buildWebsiteGenerationInput(contextResult.body as AppSyncSignalContextData);
  const result = await proxyToAscentAppSync<GeneratedMissionRequestData>(authorization, requestGeneratedMissionsMutation, {
    input,
  });
  if (result.status !== 200) {
    return NextResponse.json(result.body, { status: result.status });
  }

  return NextResponse.json(
    {
      ok: true,
      request: (result.body as GeneratedMissionRequestData).requestGeneratedMissions,
    },
    { status: 200 },
  );
}
