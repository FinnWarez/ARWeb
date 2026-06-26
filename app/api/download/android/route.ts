import { NextResponse } from "next/server";
import { proxyToAscentAppSync } from "@/lib/backend";
import { authorizationFromSession } from "@/lib/session";

type AndroidDownloadData = {
  createAndroidDownloadLink?: {
    url: string;
    expiresAt: string;
    versionName: string;
    versionCode: number;
    tag: string;
    apkSha256: string;
    minSdk: number;
  };
};

const createAndroidDownloadLinkMutation = /* GraphQL */ `
  mutation CreateAndroidDownloadLink {
    createAndroidDownloadLink {
      url
      expiresAt
      versionName
      versionCode
      tag
      apkSha256
      minSdk
    }
  }
`;

export async function POST(request: Request) {
  if (!isSameOriginRequest(request)) {
    return NextResponse.json(
      {
        ok: false,
        message: "The download link request is not allowed.",
      },
      { status: 403 },
    );
  }

  const authorization = authorizationFromSession(request);
  if (!authorization) {
    return NextResponse.json(
      {
        ok: false,
        message: "Enter the shared Ascent account before downloading.",
      },
      { status: 401 },
    );
  }

  const result = await proxyToAscentAppSync<AndroidDownloadData>(authorization, createAndroidDownloadLinkMutation, {});
  if (result.status !== 200) {
    return NextResponse.json(
      {
        ok: false,
        message: "The download link could not be created.",
      },
      { status: result.status === 401 || result.status === 403 ? result.status : 502 },
    );
  }
  const download = (result.body as AndroidDownloadData).createAndroidDownloadLink;
  if (!download?.url) {
    return NextResponse.json(
      {
        ok: false,
        message: "The download link could not be created.",
      },
      { status: 502 },
    );
  }

  return NextResponse.json(
    {
      ok: true,
      download,
    },
    { status: 200 },
  );
}

function isSameOriginRequest(request: Request) {
  const requestOrigin = new URL(request.url).origin;
  const origin = request.headers.get("origin");
  if (origin) {
    return origin === requestOrigin;
  }

  const referer = request.headers.get("referer");
  if (!referer) {
    return true;
  }

  try {
    return new URL(referer).origin === requestOrigin;
  } catch {
    return false;
  }
}
