import type { MetadataRoute } from "next";
import { content, profile } from "@/lib/content";
import { seo } from "@/lib/seo";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: seo.title,
    short_name: profile.name,
    description: seo.description,
    start_url: "/",
    display: "browser",
    background_color: content.site.metadata.themeColor,
    theme_color: content.site.metadata.themeColor,
    icons: [{ src: "/logo/favicon.svg", sizes: "any", type: "image/svg+xml" }],
  };
}
