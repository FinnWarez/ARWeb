import type { Metadata } from "next";
import Link from "next/link";
import "./globals.css";
import { siteConfig } from "@/lib/site";

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    default: siteConfig.title,
    template: "%s | Ascent",
  },
  description: siteConfig.description,
  openGraph: {
    title: siteConfig.title,
    description: siteConfig.description,
    url: siteConfig.url,
    siteName: "Ascent",
    images: [{ url: "/images/generated/transmission-header.png", width: 1792, height: 1024, alt: "A reflected relay workstation overlaid with mirror-layer signal traces." }],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: siteConfig.title,
    description: siteConfig.description,
    images: ["/images/generated/transmission-header.png"],
  },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>
        <div className="min-h-screen signal-grid">
          <header className="fixed left-0 right-0 top-0 z-50 border-b border-white/10 bg-signal-black/78 backdrop-blur-xl">
            <nav className="mx-auto flex h-16 max-w-7xl items-center justify-between px-5 md:px-8" aria-label="Primary">
              <Link href="/" className="font-display text-xl tracking-[0.18em] text-signal-fog">
                ASCENT
              </Link>
              <div className="hidden items-center gap-7 text-sm text-signal-fog/78 md:flex">
                <Link href="/credits">Credits</Link>
                <Link href="/beta">Beta</Link>
                <Link href="/transmissions">Transmissions</Link>
                <Link href="/account">Account</Link>
              </div>
            </nav>
          </header>
          {children}
          <footer className="border-t border-white/10 px-5 py-8 text-sm text-signal-fog/62 md:px-8">
            <div className="mx-auto flex max-w-7xl flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <p>Signal maintained by the Relay.</p>
              <div className="flex gap-5">
                <Link href="/safety">Safety</Link>
                <Link href="/terms">Terms</Link>
                <Link href="/privacy">Privacy</Link>
              </div>
            </div>
          </footer>
        </div>
      </body>
    </html>
  );
}
