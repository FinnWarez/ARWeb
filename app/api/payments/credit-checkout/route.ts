import { NextResponse } from "next/server";
import { proxyToAscentAppSync } from "@/lib/backend";

type CreditCheckoutData = {
  createCreditCheckoutSession?: {
    checkoutSessionId: string;
    stripeSessionId?: string | null;
    url?: string | null;
    amountCents: number;
    currency: string;
    status: string;
  } | null;
};

const createCreditCheckoutMutation = /* GraphQL */ `
  mutation CreateCreditCheckoutSession($input: CreateCreditCheckoutInput!) {
    createCreditCheckoutSession(input: $input) {
      checkoutSessionId
      stripeSessionId
      url
      amountCents
      currency
      status
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
      stripeSessionId: session?.stripeSessionId,
      url: session?.url,
      amountCents: session?.amountCents,
      currency: session?.currency,
      status: session?.status,
    },
    { status: 200 },
  );
}
