import type { MetadataRoute } from "next";
import { siteUrl } from "@/lib/seo";

// Single-page site: the section anchors are not separate URLs, so only the root is listed.
export default function sitemap(): MetadataRoute.Sitemap {
  return [{ url: siteUrl, changeFrequency: "monthly", priority: 1 }];
}
