import { siteConfig } from "@/lib/site";
import { transmissions } from "@/lib/transmissions";

export function GET() {
  const items = transmissions.map((post) => `
    <item>
      <title>${escapeXml(post.title)}</title>
      <link>${siteConfig.url}/transmissions/${post.slug}</link>
      <guid>${siteConfig.url}/transmissions/${post.slug}</guid>
      <pubDate>${new Date(post.publishedAt).toUTCString()}</pubDate>
      <description>${escapeXml(post.excerpt)}</description>
    </item>`).join("");
  const body = `<?xml version="1.0" encoding="UTF-8" ?>
  <rss version="2.0">
    <channel>
      <title>Ascent Transmissions</title>
      <link>${siteConfig.url}/transmissions</link>
      <description>${escapeXml(siteConfig.description)}</description>
      ${items}
    </channel>
  </rss>`;
  return new Response(body, { headers: { "content-type": "application/rss+xml; charset=utf-8" } });
}

function escapeXml(value: string): string {
  return value.replace(/[<>&'"]/g, (char) => ({
    "<": "&lt;",
    ">": "&gt;",
    "&": "&amp;",
    "'": "&apos;",
    "\"": "&quot;",
  }[char] ?? char));
}
