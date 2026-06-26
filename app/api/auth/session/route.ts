import { NextResponse } from "next/server";
import { authorizationFromSession, clearAccessTokenCookie } from "@/lib/session";

export async function GET(request: Request) {
  return NextResponse.json(
    {
      ok: true,
      authenticated: Boolean(authorizationFromSession(request)),
    },
    { status: 200 },
  );
}

export async function DELETE() {
  const response = NextResponse.json({ ok: true }, { status: 200 });
  clearAccessTokenCookie(response);
  return response;
}
