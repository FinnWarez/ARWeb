"use client";

import { Loader2, LogIn, LogOut, Smartphone } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { beginCognitoSignIn, beginCognitoSignOut, hasAuthConfig, hasStoredAccessToken } from "@/lib/auth";
import { siteConfig } from "@/lib/site";

export function AccountActions() {
  const [signedIn, setSignedIn] = useState(false);
  const [pending, setPending] = useState<"signin" | "signout" | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    setSignedIn(hasStoredAccessToken());
  }, []);

  async function signIn() {
    setPending("signin");
    setMessage(null);
    try {
      await beginCognitoSignIn();
    } catch (error) {
      setPending(null);
      setMessage(error instanceof Error ? error.message : "Account relay is not configured yet.");
    }
  }

  function signOut() {
    setPending("signout");
    beginCognitoSignOut();
    setSignedIn(false);
    setPending(null);
  }

  return (
    <div className="grid gap-4 md:grid-cols-2">
      <div className="glass-panel rounded-md p-6 transition hover:border-signal-glass/45">
        {signedIn ? <LogOut className="text-signal-glass" /> : <LogIn className="text-signal-glass" />}
        <h2 className="mt-5 font-display text-3xl text-white">{signedIn ? "Account linked" : "Enter account"}</h2>
        <p className="mt-3 min-h-20 leading-7 text-signal-fog/72">
          {signedIn
            ? "This browser is holding the account token used by credit gates."
            : "Open the same Cognito-backed identity used by the phone."}
        </p>
        <div className="mt-6 flex flex-wrap gap-3">
          {signedIn ? (
            <button
              type="button"
              onClick={signOut}
              disabled={pending === "signout"}
              className="inline-flex items-center gap-2 bg-white/92 px-4 py-3 text-sm font-semibold text-signal-black transition hover:bg-white disabled:cursor-wait disabled:opacity-70"
            >
              {pending === "signout" ? <Loader2 size={16} className="animate-spin" /> : <LogOut size={16} />}
              Leave account
            </button>
          ) : (
            <button
              type="button"
              onClick={signIn}
              disabled={pending === "signin" || !hasAuthConfig()}
              className="inline-flex items-center gap-2 bg-white/92 px-4 py-3 text-sm font-semibold text-signal-black transition hover:bg-white disabled:cursor-not-allowed disabled:opacity-60"
            >
              {pending === "signin" ? <Loader2 size={16} className="animate-spin" /> : <LogIn size={16} />}
              Enter account
            </button>
          )}
        </div>
        {message ? <p className="mt-4 text-sm text-signal-gold">{message}</p> : null}
        {!hasAuthConfig() ? <p className="mt-4 text-sm text-signal-gold">Account relay is waiting for deployment settings.</p> : null}
      </div>

      <Link href={siteConfig.appDownloadUrl} className="glass-panel rounded-md p-6 transition hover:border-signal-red/45">
        <Smartphone className="text-signal-red" />
        <h2 className="mt-5 font-display text-3xl text-white">Find the build</h2>
        <p className="mt-3 leading-7 text-signal-fog/72">Install the phone surface when the beta gate opens for your device.</p>
      </Link>
    </div>
  );
}
