"use client";

import { Loader2, Send } from "lucide-react";
import { FormEvent, useState } from "react";

export function BetaSignupForm() {
  const [status, setStatus] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setStatus(null);
    const form = new FormData(event.currentTarget);
    const payload = Object.fromEntries(form.entries());
    try {
      const response = await fetch("/api/website/beta-signup", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(payload),
      });
      const body = (await response.json()) as { message?: string };
      setStatus(body.message ?? (response.ok ? "Beta request logged." : "Beta request not accepted."));
      if (response.ok) event.currentTarget.reset();
    } catch {
      setStatus("The beta channel did not answer.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={submit} className="mt-6 grid gap-3">
      <label className="grid gap-2 text-sm text-signal-fog/72">
        Email
        <input name="email" type="email" required className="border border-white/14 bg-black/28 px-4 py-3 text-white outline-none focus:border-signal-glass" />
      </label>
      <label className="grid gap-2 text-sm text-signal-fog/72">
        Pseudonym
        <input name="pseudonym" minLength={2} maxLength={32} className="border border-white/14 bg-black/28 px-4 py-3 text-white outline-none focus:border-signal-glass" />
      </label>
      <label className="grid gap-2 text-sm text-signal-fog/72">
        Device path
        <select name="platformInterest" className="border border-white/14 bg-black/28 px-4 py-3 text-white outline-none focus:border-signal-glass">
          <option value="ANDROID">Android</option>
          <option value="WEB">Web relay</option>
          <option value="BOTH">Both</option>
        </select>
      </label>
      <label className="grid gap-2 text-sm text-signal-fog/72">
        Notes
        <textarea name="notes" maxLength={800} rows={4} className="border border-white/14 bg-black/28 px-4 py-3 text-white outline-none focus:border-signal-glass" />
      </label>
      <button type="submit" disabled={loading} className="inline-flex items-center justify-center gap-2 bg-signal-red px-4 py-3 font-semibold text-white disabled:opacity-70">
        {loading ? <Loader2 size={17} className="animate-spin" /> : <Send size={17} />}
        Request access
      </button>
      {status ? <p className="text-sm text-signal-gold">{status}</p> : null}
    </form>
  );
}
