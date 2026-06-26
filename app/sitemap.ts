import type { MetadataRoute } from "next";
import { siteConfig } from "@/lib/site";
import { transmissions } from "@/lib/transmissions";

export default function sitemap(): MetadataRoute.Sitemap {
  const staticRoutes = ["", "/credits", "/beta", "/account", "/transmissions", "/privacy", "/terms", "/safety"];
  return [
    ...staticRoutes.map((route) => ({ url: `${siteConfig.url}${route}`, lastModified: new Date("2026-06-26") })),
    ...transmissions.map((post) => ({
      url: `${siteConfig.url}/transmissions/${post.slug}`,
      lastModified: new Date(post.publishedAt),
    })),
  ];
}
