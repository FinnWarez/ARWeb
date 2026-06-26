import Image from "next/image";
import { notFound } from "next/navigation";
import { getTransmission, transmissions } from "@/lib/transmissions";
import { siteConfig } from "@/lib/site";

export function generateStaticParams() {
  return transmissions.map((post) => ({ slug: post.slug }));
}

type TransmissionPageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: TransmissionPageProps) {
  const { slug } = await params;
  const post = getTransmission(slug);
  if (!post) return {};
  return {
    title: post.title,
    description: post.excerpt,
    openGraph: {
      title: post.title,
      description: post.excerpt,
      images: ["/images/generated/transmission-header.png"],
    },
  };
}

export default async function TransmissionPage({ params }: TransmissionPageProps) {
  const { slug } = await params;
  const post = getTransmission(slug);
  if (!post) notFound();

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: post.excerpt,
    datePublished: post.publishedAt,
    author: { "@type": "Person", name: "The Relay Maintainer" },
    image: `${siteConfig.url}/images/generated/transmission-header.png`,
  };

  return (
    <main className="mx-auto max-w-4xl px-5 pb-24 pt-32 md:px-8">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <Image src="/images/generated/transmission-header.png" alt="A reflected relay workstation with abstract mirror-layer maps." width={1792} height={1024} className="mb-10 h-64 w-full rounded-md object-cover md:h-96" priority />
      <p className="text-sm uppercase tracking-[0.26em] text-signal-red">{post.signal} / {post.readTime}</p>
      <h1 className="mt-4 font-display text-5xl text-white md:text-7xl">{post.title}</h1>
      <p className="mt-5 text-signal-fog/62">{post.publishedAt} / The Relay Maintainer</p>
      <article className="mt-10 space-y-7 text-lg leading-8 text-signal-fog/78">
        {post.body.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
      </article>
    </main>
  );
}
