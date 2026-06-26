import Image from "next/image";
import Link from "next/link";
import { transmissions } from "@/lib/transmissions";

export const metadata = {
  title: "Transmissions",
  description: "Development transmissions from the Relay Maintainer.",
};

export default function TransmissionsPage() {
  return (
    <main className="mx-auto max-w-7xl px-5 pb-24 pt-32 md:px-8">
      <div className="overflow-hidden rounded-md border border-white/10">
        <Image src="/images/generated/transmission-header.png" alt="A reflected relay workstation with abstract mirror-layer maps." width={1792} height={1024} className="h-72 w-full object-cover md:h-[28rem]" priority />
      </div>
      <p className="mt-10 text-sm uppercase tracking-[0.26em] text-signal-red">Relay notes</p>
      <h1 className="mt-4 font-display text-5xl text-white md:text-7xl">Written from the maintenance room.</h1>
      <div className="mt-10 grid gap-5 md:grid-cols-3">
        {transmissions.map((post) => (
          <Link key={post.slug} href={`/transmissions/${post.slug}`} className="glass-panel rounded-md p-5 transition hover:border-signal-glass/45">
            <p className="text-xs uppercase tracking-[0.22em] text-signal-glass">{post.signal} / {post.publishedAt}</p>
            <h2 className="mt-4 font-display text-2xl text-white">{post.title}</h2>
            <p className="mt-4 leading-7 text-signal-fog/72">{post.excerpt}</p>
          </Link>
        ))}
      </div>
    </main>
  );
}
