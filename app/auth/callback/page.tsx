import { Suspense } from "react";
import { AuthCallback } from "@/components/auth-callback";

export const metadata = {
  title: "Account Relay",
  description: "Resolve the shared Ascent account signal.",
};

export default function AuthCallbackPage() {
  return (
    <Suspense
      fallback={
        <main className="mx-auto flex min-h-[70vh] max-w-3xl flex-col justify-center px-5 pb-24 pt-32 md:px-8">
          <div className="glass-panel rounded-md p-8">
            <h1 className="font-display text-4xl text-white">Account relay</h1>
          </div>
        </main>
      }
    >
      <AuthCallback />
    </Suspense>
  );
}
