import Link from "next/link";
import { LogIn, Smartphone } from "lucide-react";
import { siteConfig } from "@/lib/site";

export const metadata = {
  title: "Account",
  description: "Use the same Ascent account on the website and Android build.",
};

export default function AccountPage() {
  return (
    <main className="mx-auto max-w-5xl px-5 pb-24 pt-32 md:px-8">
      <p className="text-sm uppercase tracking-[0.26em] text-signal-red">Same identity</p>
      <h1 className="mt-4 font-display text-5xl text-white md:text-7xl">One account. Two surfaces.</h1>
      <p className="mt-6 max-w-3xl text-lg leading-8 text-signal-fog/75">
        The web relay and phone build use the same Ascent identity. Credits, beta state, and profile objects resolve through that account, not through the name you show the street.
      </p>
      <div className="mt-10 grid gap-4 md:grid-cols-2">
        <Link href={siteConfig.cognitoHostedUiUrl || "/beta"} className="glass-panel rounded-md p-6 transition hover:border-signal-glass/45">
          <LogIn className="text-signal-glass" />
          <h2 className="mt-5 font-display text-3xl text-white">Enter account</h2>
          <p className="mt-3 leading-7 text-signal-fog/72">Open the same Cognito-backed identity used by the phone.</p>
        </Link>
        <Link href={siteConfig.appDownloadUrl} className="glass-panel rounded-md p-6 transition hover:border-signal-red/45">
          <Smartphone className="text-signal-red" />
          <h2 className="mt-5 font-display text-3xl text-white">Find the build</h2>
          <p className="mt-3 leading-7 text-signal-fog/72">Install the phone surface when the beta gate opens for your device.</p>
        </Link>
      </div>
    </main>
  );
}
