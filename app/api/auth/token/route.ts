import { NextResponse } from "next/server";
import { setAccessTokenCookie } from "@/lib/session";
import { siteConfig } from "@/lib/site";

type TokenRequest = {
  code?: unknown;
  codeVerifier?: unknown;
  redirectUri?: unknown;
};

function cognitoBaseUrl() {
  const domain = process.env.NEXT_PUBLIC_COGNITO_DOMAIN || process.env.NEXT_PUBLIC_COGNITO_HOSTED_UI_URL || siteConfig.cognitoDomain || siteConfig.cognitoHostedUiUrl;
  if (!domain) return "";
  const withoutPath = domain.replace(/\/oauth2\/.*$/, "").replace(/\/$/, "");
  return withoutPath.startsWith("https://") ? withoutPath : `https://${withoutPath}`;
}

export async function POST(request: Request) {
  const baseUrl = cognitoBaseUrl();
  const clientId = process.env.NEXT_PUBLIC_COGNITO_USER_POOL_CLIENT_ID || siteConfig.cognitoUserPoolClientId;
  if (!baseUrl || !clientId) {
    return NextResponse.json(
      {
        ok: false,
        message: "The account relay is not configured yet.",
      },
      { status: 503 },
    );
  }

  const body = (await request.json()) as TokenRequest;
  if (typeof body.code !== "string" || typeof body.codeVerifier !== "string" || typeof body.redirectUri !== "string") {
    return NextResponse.json(
      {
        ok: false,
        message: "The account signal is incomplete.",
      },
      { status: 400 },
    );
  }

  let redirectUrl: URL;
  try {
    redirectUrl = new URL(body.redirectUri);
  } catch {
    return NextResponse.json(
      {
        ok: false,
        message: "The account callback URL is invalid.",
      },
      { status: 400 },
    );
  }
  const requestOrigin = new URL(request.url).origin;
  const configuredOrigin = process.env.NEXT_PUBLIC_SITE_URL ? new URL(process.env.NEXT_PUBLIC_SITE_URL).origin : requestOrigin;
  const allowedOrigins = new Set([requestOrigin, configuredOrigin]);
  if (!allowedOrigins.has(redirectUrl.origin) || redirectUrl.pathname !== "/auth/callback") {
    return NextResponse.json(
      {
        ok: false,
        message: "The account callback URL is not allowed.",
      },
      { status: 400 },
    );
  }

  const response = await fetch(`${baseUrl}/oauth2/token`, {
    method: "POST",
    headers: { "content-type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      grant_type: "authorization_code",
      client_id: clientId,
      code: body.code,
      redirect_uri: body.redirectUri,
      code_verifier: body.codeVerifier,
    }),
    cache: "no-store",
  });
  const tokenBody = (await response.json().catch(() => ({}))) as {
    access_token?: string;
    id_token?: string;
    token_type?: string;
    expires_in?: number;
    error_description?: string;
    error?: string;
  };

  if (!response.ok || !tokenBody.access_token) {
    return NextResponse.json(
      {
        ok: false,
        message: tokenBody.error_description ?? tokenBody.error ?? "The account signal was rejected.",
      },
      { status: response.ok ? 502 : response.status },
    );
  }

  const result = NextResponse.json(
    {
      ok: true,
      expiresIn: tokenBody.expires_in,
    },
    { status: 200 },
  );
  setAccessTokenCookie(result, tokenBody.access_token, tokenBody.expires_in);
  return result;
}
