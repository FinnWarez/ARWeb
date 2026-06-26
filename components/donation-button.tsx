"use client";

import { Heart, Loader2 } from "lucide-react";
import { useState } from "react";

export function DonationButton() {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  async function donate() {
    setLoading(true);
    setMessage(null);
    try {
      const response = await fetch("/api/payments/donation-checkout", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ source: "home_donation" }),
      });
      const body = (await response.json()) as { url?: string; message?: string };
      if (response.ok && body.url) {
        window.location.href = body.url;
        return;
      }
      setMessage(body.message ?? "Donation channel is not open yet.");
    } catch {
      setMessage("Donation channel failed to resolve.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <span className="inline-flex flex-col gap-2">
      <button type="button" onClick={donate} disabled={loading} className="inline-flex items-center gap-2 bg-signal-fog px-4 py-3 text-sm font-semibold text-signal-black disabled:opacity-70">
        {loading ? <Loader2 size={17} className="animate-spin" /> : <Heart size={17} />}
        Support the Transmission
      </button>
      {message ? <span className="text-sm text-signal-gold">{message}</span> : null}
    </span>
  );
}
