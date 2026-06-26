"use client";

import { Loader2 } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { siteConfig } from "@/lib/site";

type TokenResponse = {
  accessToken?: string;
  idToken?: string;
  expiresIn?: number;
  message?: string;
};

export function AuthCallback() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [message, setMessage] = useState("Resolving account signal.");

  useEffect(() => {
    async function exchangeCode() {
      const code = searchParams.get("code");
      const state = searchParams.get("state");
      const expectedState = window.localStorage.getItem(siteConfig.oauthStateStorageKey);
      const codeVerifier = window.localStorage.getItem(siteConfig.pkceVerifierStorageKey);

      if (!code || !state || !expectedState || state !== expectedState || !codeVerifier) {
        setMessage("The account signal could not be verified. Start from the account page again.");
        return;
      }

      try {
        const response = await fetch("/api/auth/token", {
          method: "POST",
          headers: { "content-type": "application/json" },
          body: JSON.stringify({
            code,
            codeVerifier,
            redirectUri: `${window.location.origin}/auth/callback`,
          }),
        });
        const body = (await response.json()) as TokenResponse;

        if (!response.ok || !body.accessToken) {
          setMessage(body.message ?? "The account signal was rejected.");
          return;
        }

        window.localStorage.setItem(siteConfig.accessTokenStorageKey, body.accessToken);
        if (body.idToken) {
          window.localStorage.setItem(siteConfig.idTokenStorageKey, body.idToken);
        }
        if (body.expiresIn) {
          window.localStorage.setItem(siteConfig.tokenExpiryStorageKey, String(Date.now() + body.expiresIn * 1000 - 60_000));
        }
        window.localStorage.removeItem(siteConfig.oauthStateStorageKey);
        window.localStorage.removeItem(siteConfig.pkceVerifierStorageKey);
        router.replace("/account");
      } catch {
        setMessage("The account relay failed to answer.");
      }
    }

    exchangeCode();
  }, [router, searchParams]);

  return (
    <main className="mx-auto flex min-h-[70vh] max-w-3xl flex-col justify-center px-5 pb-24 pt-32 md:px-8">
      <div className="glass-panel rounded-md p-8">
        <Loader2 className="animate-spin text-signal-glass" />
        <h1 className="mt-5 font-display text-4xl text-white">Account relay</h1>
        <p className="mt-4 leading-7 text-signal-fog/72">{message}</p>
      </div>
    </main>
  );
}
