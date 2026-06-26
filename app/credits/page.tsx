import Image from "next/image";
import { PricingCards } from "@/components/pricing-cards";
import { creditTiers } from "@/lib/site";

export const metadata = {
  title: "Credits",
  description: "Account-bound Ascent credits and profile objects for Chapter chain progression.",
};

export default function CreditsPage() {
  return (
    <main className="mx-auto max-w-7xl px-5 pb-24 pt-32 md:px-8">
      <p className="text-sm uppercase tracking-[0.26em] text-signal-red">Credit signal</p>
      <h1 className="mt-4 font-display text-5xl text-white md:text-7xl">The marks follow the account.</h1>
      <p className="mt-6 max-w-3xl text-lg leading-8 text-signal-fog/75">
        The website and the phone read the same identity. Credits attach to that identity and remain available when Chapter-chain gates begin asking for stranger proof.
      </p>
      <div className="my-10 overflow-hidden rounded-md border border-white/10">
        <Image src="/images/generated/tier-artifacts.png" alt="Four Ascent credit tier artifacts on a reflective surface." width={1792} height={1024} className="h-72 w-full object-cover md:h-[28rem]" />
      </div>
      <PricingCards tiers={creditTiers} />
    </main>
  );
}
