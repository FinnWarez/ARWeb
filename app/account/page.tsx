import { AccountActions } from "@/components/account-actions";

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
      <div className="mt-10">
        <AccountActions />
      </div>
    </main>
  );
}
