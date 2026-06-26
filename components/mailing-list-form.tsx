"use client";

import { Loader2, Send } from "lucide-react";
import { FormEvent, useState } from "react";

export function MailingListForm() {
  const [status, setStatus] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setStatus(null);
    const form = new FormData(event.currentTarget);
    const payload = Object.fromEntries(form.entries());
    try {
      const response = await fetch("/api/website/signup", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(payload),
      });
      const body = (await response.json()) as { message?: string };
      setStatus(body.message ?? (response.ok ? "Signal received." : "Signal not accepted."));
      if (response.ok) event.currentTarget.reset();
    } catch {
      setStatus("The list is not listening right now.");
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
      <input type="hidden" name="source" value="home_mailing_list" />
      <button type="submit" disabled={loading} className="inline-flex items-center justify-center gap-2 bg-signal-glass px-4 py-3 font-semibold text-signal-black disabled:opacity-70">
        {loading ? <Loader2 size={17} className="animate-spin" /> : <Send size={17} />}
        Join the list
      </button>
      {status ? <p className="text-sm text-signal-gold">{status}</p> : null}
    </form>
  );
}
