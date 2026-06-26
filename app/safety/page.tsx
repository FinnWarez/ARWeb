export const metadata = {
  title: "Safety",
  description: "Ascent safety boundaries for public and beta play.",
};

export default function SafetyPage() {
  return (
    <main className="mx-auto max-w-3xl px-5 pb-24 pt-32 leading-8 text-signal-fog/78 md:px-8">
      <h1 className="font-display text-5xl text-white">Safety</h1>
      <p className="mt-8">Ascent uses fictional Chapters, Mirror language, and unresolved transmission framing. These surfaces are story devices, not instructions to investigate or confront real people or institutions.</p>
      <p>Play stays bounded to lawful, consent-based, public, low-risk activity. The app must not request exact home addresses, private routines, or sensitive personal attributes for routing.</p>
      <p>When the phone build uses location, camera, AR, or map features, those surfaces must be permissioned, bounded, and fail closed when safety checks do not pass.</p>
    </main>
  );
}
