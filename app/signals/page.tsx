import { SignalStream } from "@/components/signal-stream";

export const metadata = {
  title: "Signals",
  description: "Play remote-safe Ascent Signals through the shared account.",
};

export default function SignalsPage() {
  return (
    <main className="pb-24">
      <section
        className="min-h-[34rem] bg-cover bg-center px-5 pt-32 md:px-8"
        style={{
          backgroundImage:
            "linear-gradient(180deg, rgba(5, 7, 10, 0.42), rgba(5, 7, 10, 0.82)), url('/images/generated/transmission-header.png')",
        }}
      >
        <div className="mx-auto max-w-7xl">
          <p className="text-sm uppercase tracking-[0.26em] text-signal-red">Shared account</p>
          <h1 className="mt-4 max-w-4xl font-display text-5xl text-white md:text-7xl">Signal Stream</h1>
          <p className="mt-6 max-w-3xl text-lg leading-8 text-signal-fog/78">
            Complete a remote Mission here and the phone build will read the same progression when it next signs in.
          </p>
        </div>
      </section>

      <section className="mx-auto -mt-24 max-w-7xl px-5 md:px-8">
        <SignalStream />
      </section>
    </main>
  );
}
