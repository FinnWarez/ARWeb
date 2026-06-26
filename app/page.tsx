import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Download, Mail, Radio, Shield, Sparkles } from "lucide-react";
import { BetaSignupForm } from "@/components/beta-signup-form";
import { MailingListForm } from "@/components/mailing-list-form";
import { PricingCards } from "@/components/pricing-cards";
import { DonationButton } from "@/components/donation-button";
import { creditTiers, siteConfig } from "@/lib/site";
import { transmissions } from "@/lib/transmissions";

export default function HomePage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "VideoGame",
    name: "Ascent",
    url: siteConfig.url,
    genre: ["Location-based AR", "ARG", "Multiplayer story"],
    description: siteConfig.description,
  };

  return (
    <main>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <section className="scanline relative min-h-[92vh] overflow-hidden pt-16">
        <Image
          src="/images/generated/mirror-city-hero.png"
          alt="A fictional mirror city overlaid with signal traces and reflected streets."
          fill
          priority
          className="object-cover"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-signal-black via-signal-black/58 to-signal-black/12" />
        <div className="absolute inset-x-0 bottom-0 h-44 bg-gradient-to-t from-signal-black to-transparent" />
        <div className="relative mx-auto flex min-h-[calc(92vh-4rem)] max-w-7xl items-center px-5 py-20 md:px-8">
          <div className="max-w-3xl">
            <p className="mb-5 inline-flex items-center gap-2 border border-white/16 bg-black/30 px-3 py-2 text-xs uppercase tracking-[0.28em] text-signal-glass">
              <Radio size={14} /> Mirror channel unstable
            </p>
            <h1 className="font-display text-5xl leading-[0.98] text-white md:text-7xl">
              The city has started answering back.
            </h1>
            <p className="mt-7 max-w-2xl text-lg leading-8 text-signal-fog/82 md:text-xl">
              Ascent is the public face of a private signal: Chapter missions, mirror traces, digital tags, and a relay that sometimes sounds like it was built from the other side.
            </p>
            <div className="mt-9 flex flex-col gap-3 sm:flex-row">
              <Link href="/beta" className="inline-flex items-center justify-center gap-2 bg-signal-fog px-5 py-3 font-semibold text-signal-black transition hover:bg-white">
                Request Beta Access <ArrowRight size={18} />
              </Link>
              <Link href="/transmissions" className="inline-flex items-center justify-center gap-2 border border-white/18 px-5 py-3 font-semibold text-signal-fog transition hover:border-signal-glass">
                Read the Relay <Sparkles size={18} />
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto grid max-w-7xl gap-6 px-5 py-20 md:grid-cols-3 md:px-8">
        {[
          ["Red Choir", "A signal repeated until the street remembers the shape of a voice."],
          ["Glass Cartographers", "A map drawn over the evidence before the event admits it happened."],
          ["Quiet Signal", "A missing line, a delay, a pattern that becomes visible by refusing to arrive."],
        ].map(([title, body]) => (
          <article key={title} className="glass-panel rounded-md p-6">
            <h2 className="font-display text-2xl text-white">{title}</h2>
            <p className="mt-4 leading-7 text-signal-fog/72">{body}</p>
          </article>
        ))}
      </section>

      <section className="mx-auto max-w-7xl px-5 py-8 md:px-8" id="credits">
        <div className="mb-8 max-w-3xl">
          <p className="text-sm uppercase tracking-[0.26em] text-signal-red">Credit signal</p>
          <h2 className="mt-3 font-display text-4xl text-white md:text-5xl">Marks that follow the account.</h2>
          <p className="mt-5 text-lg leading-8 text-signal-fog/75">
            Credits belong to the same Ascent identity used on the phone. Spend them later on Chapter-chain gates, profile objects, and stranger forms of progression when the relay permits.
          </p>
        </div>
        <div className="mb-7 overflow-hidden rounded-md border border-white/10">
          <Image src="/images/generated/tier-artifacts.png" alt="Four symbolic Ascent credit tier artifacts." width={1792} height={1024} className="h-56 w-full object-cover md:h-80" />
        </div>
        <PricingCards tiers={creditTiers} />
      </section>

      <section className="mx-auto grid max-w-7xl gap-6 px-5 py-20 md:grid-cols-[1fr_1fr] md:px-8">
        <div className="glass-panel rounded-md p-6 md:p-8">
          <div className="mb-4 flex h-11 w-11 items-center justify-center border border-signal-glass/30 text-signal-glass">
            <Mail size={20} />
          </div>
          <h2 className="font-display text-3xl text-white">Join the quiet list.</h2>
          <p className="mt-4 leading-7 text-signal-fog/72">Low-frequency notes from the Relay Maintainer. No flood. No chorus unless the room requires it.</p>
          <MailingListForm />
        </div>
        <div className="glass-panel rounded-md p-6 md:p-8">
          <div className="mb-4 flex h-11 w-11 items-center justify-center border border-signal-red/35 text-signal-red">
            <Shield size={20} />
          </div>
          <h2 className="font-display text-3xl text-white">Request beta access.</h2>
          <p className="mt-4 leading-7 text-signal-fog/72">The first testers become instruments in the calibration: phone, city, profile, and whatever the Mirror returns.</p>
          <BetaSignupForm />
        </div>
      </section>

      <section className="mx-auto grid max-w-7xl gap-6 px-5 py-10 md:grid-cols-[0.9fr_1.1fr] md:px-8">
        <div>
          <p className="text-sm uppercase tracking-[0.26em] text-signal-glass">Relay notes</p>
          <h2 className="mt-3 font-display text-4xl text-white">Development transmissions.</h2>
          <p className="mt-5 leading-7 text-signal-fog/72">
            Written by the one maintaining the door while pretending the door is software.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <DonationButton />
            <Link href={siteConfig.appDownloadUrl} className="inline-flex items-center gap-2 border border-white/18 px-4 py-3 text-sm font-semibold text-signal-fog hover:border-signal-glass">
              <Download size={17} /> Find the build
            </Link>
          </div>
        </div>
        <div className="grid gap-4">
          {transmissions.slice(0, 3).map((post) => (
            <Link key={post.slug} href={`/transmissions/${post.slug}`} className="glass-panel block rounded-md p-5 transition hover:border-signal-glass/45">
              <p className="text-xs uppercase tracking-[0.22em] text-signal-red">{post.signal} / {post.readTime}</p>
              <h3 className="mt-3 font-display text-2xl text-white">{post.title}</h3>
              <p className="mt-3 text-signal-fog/72">{post.excerpt}</p>
            </Link>
          ))}
        </div>
      </section>
    </main>
  );
}
