"use client";

import Link from "next/link";
import { useState } from "react";
import { Download, Loader2, LogIn } from "lucide-react";

type DownloadResponse = {
  ok?: boolean;
  message?: string;
  download?: {
    url?: string;
    expiresAt?: string;
    versionName?: string;
    versionCode?: number;
    tag?: string;
    apkSha256?: string;
    minSdk?: number;
  };
};

export function AndroidDownloadButton({ downloadApiPath, compact = false }: { downloadApiPath: string; compact?: boolean }) {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [needsAccount, setNeedsAccount] = useState(false);

  async function createLink() {
    setLoading(true);
    setMessage(null);
    setNeedsAccount(false);
    try {
      const response = await fetch(downloadApiPath, {
        method: "POST",
        cache: "no-store",
      });
      const body = (await response.json()) as DownloadResponse;
      if (response.status === 401) {
        setNeedsAccount(true);
        setMessage(body.message ?? "Enter the shared Ascent account before downloading.");
        return;
      }
      if (!response.ok || !body.download?.url) {
        setMessage(body.message ?? "The download link could not be created.");
        return;
      }
      const url = new URL(body.download.url);
      if (url.protocol !== "https:") {
        setMessage("The download link could not be verified.");
        return;
      }
      window.location.assign(url.toString());
    } catch {
      setMessage("The download link could not be created.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <span className="inline-flex flex-col gap-3">
      <button
        type="button"
        onClick={createLink}
        disabled={loading}
        className={[
          "inline-flex items-center justify-center gap-2 bg-signal-fog font-semibold text-signal-black transition hover:bg-white disabled:cursor-wait disabled:opacity-70",
          compact ? "px-4 py-3 text-sm" : "px-5 py-3",
        ].join(" ")}
      >
        {loading ? "Preparing link" : "Create download link"}
        {loading ? <Loader2 size={compact ? 17 : 18} className="animate-spin" /> : <Download size={compact ? 17 : 18} />}
      </button>
      {message ? (
        <span className="text-sm leading-6 text-signal-fog/70">
          {message}
          {needsAccount ? (
            <>
              {" "}
              <Link href="/account" className="inline-flex items-center gap-1 font-semibold text-signal-glass hover:text-white">
                Enter account <LogIn size={14} />
              </Link>
            </>
          ) : null}
        </span>
      ) : null}
    </span>
  );
}
