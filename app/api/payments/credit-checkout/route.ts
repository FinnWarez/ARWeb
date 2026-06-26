import { NextResponse } from "next/server";
import { proxyToAscentAppSync } from "@/lib/backend";

type CreditCheckoutData = {
  createCreditCheckoutSession?: {
    checkoutSessionId: string;
    url?: string | null;
  } | null;
};

const createCreditCheckoutMutation = /* GraphQL */ `
  mutation CreateCreditCheckoutSession($input: CreateCreditCheckoutInput!) {
    createCreditCheckoutSession(input: $input) {
      checkoutSessionId
      url
    }
  }
`;

export async function POST(request: Request) {
  const payload = await request.json();
  const authorization = request.headers.get("authorization");
  if (!authorization) {
    return NextResponse.json(
      {
        ok: false,
        message: "Enter the shared Ascent account before opening a credit gate.",
      },
      { status: 401 },
    );
  }

  const result = await proxyToAscentAppSync<CreditCheckoutData>(authorization, createCreditCheckoutMutation, {
    input: payload,
  });

  if (result.status !== 200) {
    return NextResponse.json(result.body, { status: result.status });
  }

  const session = (result.body as CreditCheckoutData).createCreditCheckoutSession;
  return NextResponse.json(
    {
      ok: true,
      checkoutSessionId: session?.checkoutSessionId,
      url: session?.url,
    },
    { status: 200 },
  );
}
