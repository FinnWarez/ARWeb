import Image from "next/image";
import Link from "next/link";
import { AlertTriangle, FileCheck2, ShieldCheck, Smartphone } from "lucide-react";
import { AndroidDownloadButton } from "@/components/android-download-button";
import { androidRequirement, formatBytes, formatDownloadDate, getAndroidDownload } from "@/lib/download";

export const metadata = {
  title: "Download Android",
  description: "Download the latest public Ascent Android beta build.",
};

function Detail({ label, value }: { label: string; value: string }) {
  return (
    <div className="border-t border-white/10 py-4">
      <p className="text-xs uppercase tracking-[0.2em] text-signal-fog/52">{label}</p>
      <p className="mt-2 break-words text-sm font-semibold text-white">{value}</p>
    </div>
  );
}

export default function DownloadPage() {
  const android = getAndroidDownload();

  return (
    <main className="pb-24 pt-16">
      <section className="relative min-h-[70vh] overflow-hidden border-b border-white/10">
        <Image
          src="/images/generated/transmission-header.png"
          alt="A reflected relay workstation overlaid with mirror-layer signal traces."
          fill
          priority
          className="object-cover"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-signal-black via-signal-black/68 to-signal-black/18" />
        <div className="absolute inset-x-0 bottom-0 h-36 bg-gradient-to-t from-signal-black to-transparent" />
        <div className="relative mx-auto flex min-h-[calc(70vh-4rem)] max-w-7xl items-center px-5 py-16 md:px-8">
          <div className="max-w-3xl">
            <p className="mb-5 inline-flex items-center gap-2 border border-white/16 bg-black/30 px-3 py-2 text-xs uppercase tracking-[0.28em] text-signal-glass">
              <Smartphone size={14} /> Android beta
            </p>
            <h1 className="font-display text-5xl leading-[0.98] text-white md:text-7xl">Get the Android build.</h1>
            <p className="mt-7 max-w-2xl text-lg leading-8 text-signal-fog/82 md:text-xl">
              Install the phone surface, sign in with the same Ascent account used on the web, and keep the public identity separate from the account behind it.
            </p>
            <div className="mt-9 flex flex-col gap-3 sm:flex-row">
              {android.available ? (
                <AndroidDownloadButton downloadApiPath={android.downloadApiPath} />
              ) : (
                <span className="inline-flex items-center justify-center gap-2 border border-white/18 px-5 py-3 font-semibold text-signal-fog/58">
                  Download pending <AlertTriangle size={18} />
                </span>
              )}
              <Link href="/beta" className="inline-flex items-center justify-center gap-2 border border-white/18 px-5 py-3 font-semibold text-signal-fog transition hover:border-signal-glass">
                Beta access <ShieldCheck size={18} />
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto grid max-w-7xl gap-6 px-5 py-16 md:grid-cols-[1fr_0.78fr] md:px-8">
        <article className="glass-panel rounded-md p-6 md:p-8">
          <div className="mb-5 flex h-11 w-11 items-center justify-center border border-signal-glass/30 text-signal-glass">
            <FileCheck2 size={20} />
          </div>
          <h2 className="font-display text-3xl text-white">Latest Android release</h2>
          {android.available ? (
            <>
              <p className="mt-4 leading-7 text-signal-fog/72">
                Version {android.versionName} is available through the signed-in Ascent account boundary. Android may ask you to approve installs from your browser before opening the APK.
              </p>
              <div className="mt-6">
                <Detail label="Version code" value={String(android.versionCode)} />
                <Detail label="Published" value={formatDownloadDate(android.publishedAt)} />
                <Detail label="Device support" value={androidRequirement(android.minSdk)} />
                <Detail label="APK size" value={formatBytes(android.apkBytes)} />
                <Detail label="Release tag" value={android.tag} />
                <Detail label="Commit" value={android.shortCommitSha} />
                <Detail label="APK SHA-256" value={android.apkSha256} />
              </div>
              <div className="mt-7 flex flex-wrap gap-3">
                <AndroidDownloadButton downloadApiPath={android.downloadApiPath} compact />
              </div>
            </>
          ) : (
            <>
              <p className="mt-4 leading-7 text-signal-fog/72">
                {android.reason} The beta list remains open while the signed Android package is prepared.
              </p>
              <div className="mt-7">
                <Link href="/beta" className="inline-flex items-center gap-2 bg-signal-fog px-4 py-3 text-sm font-semibold text-signal-black transition hover:bg-white">
                  Request beta access <ShieldCheck size={17} />
                </Link>
              </div>
            </>
          )}
        </article>

        <aside className="glass-panel rounded-md p-6 md:p-8">
          <div className="mb-5 flex h-11 w-11 items-center justify-center border border-signal-red/35 text-signal-red">
            <ShieldCheck size={20} />
          </div>
          <h2 className="font-display text-3xl text-white">Install boundary</h2>
          <p className="mt-4 leading-7 text-signal-fog/72">
            Use the account-generated link on this page. Links expire after a short window; do not install forwarded APK files, edited packages, or builds without a matching checksum.
          </p>
          <p className="mt-4 leading-7 text-signal-fog/72">
            The app uses the same Cognito-backed account as the website. Your public Ascent identity remains pseudonymous inside the app.
          </p>
        </aside>
      </section>
    </main>
  );
}
