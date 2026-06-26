import { NextResponse } from "next/server";
import { proxyToAscentAppSync } from "@/lib/backend";

type WebsiteAccountData = {
  getMyWebsiteAccount?: {
    profile?: {
      playerId: string;
      pseudonym: string;
      avatarStyle?: string | null;
      havenId?: string | null;
      havenTagId?: string | null;
      intensitySetting: string;
      consentVersion: string;
      createdAt: string;
      updatedAt: string;
    } | null;
    wallet: {
      playerId: string;
      balance: number;
      updatedAt: string;
    };
    profileObjects: Array<{
      objectId: string;
      displayName: string;
      sourceSku?: string | null;
      sourceRefId: string;
      acquiredAt: string;
    }>;
  };
};

const getMyWebsiteAccountQuery = /* GraphQL */ `
  query GetMyWebsiteAccount {
    getMyWebsiteAccount {
      profile {
        playerId
        pseudonym
        avatarStyle
        havenId
        havenTagId
        intensitySetting
        consentVersion
        createdAt
        updatedAt
      }
      wallet {
        playerId
        balance
        updatedAt
      }
      profileObjects {
        objectId
        displayName
        sourceSku
        sourceRefId
        acquiredAt
      }
    }
  }
`;

export async function GET(request: Request) {
  const authorization = request.headers.get("authorization");
  if (!authorization) {
    return NextResponse.json(
      {
        ok: false,
        message: "Enter the shared Ascent account before reading account state.",
      },
      { status: 401 },
    );
  }

  const result = await proxyToAscentAppSync<WebsiteAccountData>(authorization, getMyWebsiteAccountQuery, {});
  if (result.status !== 200) {
    return NextResponse.json(result.body, { status: result.status });
  }

  return NextResponse.json(
    {
      ok: true,
      account: (result.body as WebsiteAccountData).getMyWebsiteAccount,
    },
    { status: 200 },
  );
}
