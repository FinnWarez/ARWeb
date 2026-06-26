import { BetaSignupForm } from "@/components/beta-signup-form";

export const metadata = {
  title: "Beta Access",
  description: "Request access to the Ascent beta signal.",
};

export default function BetaPage() {
  return (
    <main className="mx-auto grid max-w-7xl gap-8 px-5 pb-24 pt-32 md:grid-cols-[0.9fr_1fr] md:px-8">
      <section>
        <p className="text-sm uppercase tracking-[0.26em] text-signal-glass">Beta channel</p>
        <h1 className="mt-4 font-display text-5xl text-white md:text-7xl">Some doors need witnesses.</h1>
        <p className="mt-6 text-lg leading-8 text-signal-fog/75">
          The early build needs testers who can hear a signal without forcing it into a single shape. Android first. Web relay beside it.
        </p>
      </section>
      <section className="glass-panel rounded-md p-6 md:p-8">
        <BetaSignupForm />
      </section>
    </main>
  );
}
