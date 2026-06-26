import { NextResponse } from "next/server";

export function accessTokenCookieName() {
  return process.env.ASCENT_ACCESS_TOKEN_COOKIE_NAME || (process.env.NODE_ENV === "production" ? "__Host-ascent_access" : "ascent_access");
}

export function authorizationFromSession(request: Request) {
  const cookieToken = cookieValue(request.headers.get("cookie"), accessTokenCookieName());
  return cookieToken ? `Bearer ${cookieToken}` : null;
}

export function setAccessTokenCookie(response: NextResponse, accessToken: string, expiresIn: number | undefined) {
  response.cookies.set({
    name: accessTokenCookieName(),
    value: accessToken,
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: Math.max(60, (expiresIn ?? 3600) - 60),
  });
}

export function clearAccessTokenCookie(response: NextResponse) {
  response.cookies.set({
    name: accessTokenCookieName(),
    value: "",
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 0,
  });
}

function cookieValue(cookieHeader: string | null, name: string) {
  if (!cookieHeader) return null;
  const prefix = `${name}=`;
  const cookie = cookieHeader
    .split(";")
    .map((part) => part.trim())
    .find((part) => part.startsWith(prefix));
  return cookie ? decodeURIComponent(cookie.slice(prefix.length)) : null;
}
