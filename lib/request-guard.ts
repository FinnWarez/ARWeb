export function isSameOriginRequest(request: Request) {
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
