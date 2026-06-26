import { NextResponse } from "next/server";
import { proxyToAscentBackend } from "@/lib/backend";

export async function POST(request: Request) {
  const payload = await request.json();
  const result = await proxyToAscentBackend("/payments/donation-checkout", payload);
  return NextResponse.json(result.body, { status: result.status });
}
