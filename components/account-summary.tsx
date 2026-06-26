"use client";

import { Loader2, RefreshCw, WalletCards } from "lucide-react";
import { useEffect, useState } from "react";
import { siteConfig } from "@/lib/site";

type WebsiteAccount = {
  profile?: {
    pseudonym: string;
    intensitySetting: string;
    updatedAt: string;
  } | null;
  wallet: {
    balance: number;
    updatedAt: string;
  };
  profileObjects: Array<{
    objectId: string;
    displayName: string;
    sourceSku?: string | null;
    acquiredAt: string;
  }>;
};

type AccountResponse = {
  ok?: boolean;
  account?: WebsiteAccount;
  message?: string;
};

function formatCredits(balance: number) {
  return `${balance.toLocaleString()} credits`;
}

export function AccountSummary() {
  const [account, setAccount] = useState<WebsiteAccount | null>(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  async function refreshAccount() {
    const accessToken = window.localStorage.getItem(siteConfig.accessTokenStorageKey);
    if (!accessToken) {
      setAccount(null);
      setMessage("Enter the shared Ascent account to see credits and profile objects.");
      return;
    }

    setLoading(true);
    setMessage(null);
    try {
      const response = await fetch("/api/account", {
        method: "GET",
        headers: {
          authorization: `Bearer ${accessToken}`,
        },
        cache: "no-store",
      });
      const body = (await response.json()) as AccountResponse;
      if (!response.ok || !body.account) {
        setAccount(null);
        setMessage(body.message ?? "The account relay did not return account state.");
        return;
      }
      setAccount(body.account);
    } catch {
      setAccount(null);
      setMessage("The account relay failed to answer.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    refreshAccount();
  }, []);

  return (
    <section className="glass-panel rounded-md p-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <WalletCards className="text-signal-red" />
          <h2 className="mt-4 font-display text-3xl text-white">Account state</h2>
          <p className="mt-3 text-signal-fog/72">
            Credits and profile objects resolve through the same private account used by the phone build.
          </p>
        </div>
        <button
          type="button"
          onClick={refreshAccount}
          disabled={loading}
          className="inline-flex items-center gap-2 border border-white/20 px-4 py-3 text-sm font-semibold text-white transition hover:border-white/45 disabled:cursor-wait disabled:opacity-60"
        >
          {loading ? <Loader2 size={16} className="animate-spin" /> : <RefreshCw size={16} />}
          Refresh
        </button>
      </div>

      {account ? (
        <div className="mt-6 grid gap-4 md:grid-cols-3">
          <div className="border border-white/10 p-4">
            <p className="text-xs uppercase tracking-[0.22em] text-signal-glass">Pseudonym</p>
            <p className="mt-3 text-2xl font-semibold text-white">{account.profile?.pseudonym ?? "Profile pending"}</p>
          </div>
          <div className="border border-white/10 p-4">
            <p className="text-xs uppercase tracking-[0.22em] text-signal-glass">Wallet</p>
            <p className="mt-3 text-2xl font-semibold text-white">{formatCredits(account.wallet.balance)}</p>
          </div>
          <div className="border border-white/10 p-4">
            <p className="text-xs uppercase tracking-[0.22em] text-signal-glass">Objects</p>
            <p className="mt-3 text-2xl font-semibold text-white">{account.profileObjects.length}</p>
          </div>
        </div>
      ) : null}

      {account?.profileObjects.length ? (
        <div className="mt-6 grid gap-3 md:grid-cols-2">
          {account.profileObjects.map((object) => (
            <article key={`${object.objectId}-${object.acquiredAt}`} className="border border-white/10 p-4">
              <p className="text-xs uppercase tracking-[0.18em] text-signal-red">{object.sourceSku ?? "account object"}</p>
              <h3 className="mt-2 text-xl font-semibold text-white">{object.displayName}</h3>
            </article>
          ))}
        </div>
      ) : null}

      {message ? <p className="mt-4 text-sm text-signal-gold">{message}</p> : null}
    </section>
  );
}
