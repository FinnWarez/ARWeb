"use client";

import { ArrowRight, Loader2 } from "lucide-react";
import { useState } from "react";
import { siteConfig } from "@/lib/site";

type Tier = {
  sku: string;
  name: string;
  price: string;
  credits: number;
  object: string;
  body: string;
  cta: string;
};

export function PricingCards({ tiers }: { tiers: readonly Tier[] }) {
  const [pendingSku, setPendingSku] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  async function beginCheckout(sku: string) {
    setPendingSku(sku);
    setMessage(null);
    try {
      const accessToken = window.localStorage.getItem(siteConfig.accessTokenStorageKey);
      const response = await fetch("/api/payments/credit-checkout", {
        method: "POST",
        headers: {
          "content-type": "application/json",
          ...(accessToken ? { authorization: `Bearer ${accessToken}` } : {}),
        },
        body: JSON.stringify({ sku }),
      });
      const body = (await response.json()) as { url?: string; message?: string };
      if (response.ok && body.url) {
        window.location.href = body.url;
        return;
      }
      setMessage(body.message ?? "The checkout signal is not open yet.");
    } catch {
      setMessage("The checkout signal failed to resolve.");
    } finally {
      setPendingSku(null);
    }
  }

  return (
    <div>
      <div className="grid gap-4 md:grid-cols-4">
        {tiers.map((tier) => (
          <article key={tier.sku} className="glass-panel rounded-md p-5">
            <p className="text-xs uppercase tracking-[0.22em] text-signal-glass">{tier.object}</p>
            <h3 className="mt-4 font-display text-3xl text-white">{tier.name}</h3>
            <div className="mt-4 flex items-end gap-2">
              <span className="text-3xl font-semibold text-white">{tier.price}</span>
              <span className="pb-1 text-sm text-signal-fog/58">{tier.credits.toLocaleString()} credits</span>
            </div>
            <p className="mt-4 min-h-28 leading-7 text-signal-fog/72">{tier.body}</p>
            <button
              type="button"
              onClick={() => beginCheckout(tier.sku)}
              disabled={pendingSku === tier.sku}
              className="mt-6 inline-flex w-full items-center justify-center gap-2 bg-white/92 px-4 py-3 text-sm font-semibold text-signal-black transition hover:bg-white disabled:cursor-wait disabled:opacity-70"
              aria-label={`${tier.cta} for ${tier.name}`}
            >
              {pendingSku === tier.sku ? <Loader2 size={16} className="animate-spin" /> : <ArrowRight size={16} />}
              {tier.cta}
            </button>
          </article>
        ))}
      </div>
      {message ? <p className="mt-4 text-sm text-signal-gold">{message}</p> : null}
    </div>
  );
}
