export const metadata = {
  title: "Privacy",
  description: "Ascent privacy terms for the public web relay.",
};

export default function PrivacyPage() {
  return (
    <main className="mx-auto max-w-3xl px-5 pb-24 pt-32 leading-8 text-signal-fog/78 md:px-8">
      <h1 className="font-display text-5xl text-white">Privacy</h1>
      <p className="mt-8">ARWeb collects only the information needed to operate mailing list requests, beta access requests, account-linked credit purchases, and donation checkout handoff.</p>
      <p>Credits and profile objects are stored by stable Ascent player account ID. Public pseudonyms are separate from private account identifiers.</p>
      <p>Payment details are handled by Stripe Checkout. ARWeb and Ascent backend do not store raw card data.</p>
    </main>
  );
}
