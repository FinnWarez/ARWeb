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
  const allowedOrigins = allowedRequestOrigins(request);
  const origin = request.headers.get("origin");
  if (origin) {
    return allowedOrigins.has(origin);
  }

  const referer = request.headers.get("referer");
  if (!referer) {
    return true;
  }

  try {
    return allowedOrigins.has(new URL(referer).origin);
  } catch {
    return false;
  }
}

function allowedRequestOrigins(request: Request) {
  const origins = new Set<string>();
  addOrigin(origins, request.url);
  addOrigin(origins, process.env.NEXT_PUBLIC_SITE_URL);

  for (const value of (process.env.ASCENT_ALLOWED_SITE_ORIGINS ?? "").split(",")) {
    addOrigin(origins, value);
  }

  const forwardedHost = firstForwardedValue(request.headers.get("x-forwarded-host")) ?? request.headers.get("host");
  if (forwardedHost) {
    const forwardedProto = firstForwardedValue(request.headers.get("x-forwarded-proto")) ?? new URL(request.url).protocol.replace(":", "");
    addOrigin(origins, `${forwardedProto}://${forwardedHost}`);
  }

  return origins;
}

function addOrigin(origins: Set<string>, value?: string | null) {
  if (!value) return;
  try {
    origins.add(new URL(value).origin);
  } catch {
    // Ignore invalid deployment metadata rather than weakening the origin check.
  }
}

function firstForwardedValue(value: string | null) {
  return value?.split(",")[0]?.trim() || null;
}
