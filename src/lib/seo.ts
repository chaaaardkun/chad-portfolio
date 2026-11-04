import { content, fill, profile } from "@/lib/content";

/**
 * Canonical origin used for canonical URLs, Open Graph, sitemap and JSON-LD.
 * Set NEXT_PUBLIC_SITE_URL in production (e.g. https://yourdomain.com).
 */
function resolveSiteUrl(): string {
  const explicit = process.env.NEXT_PUBLIC_SITE_URL;
  const vercel = process.env.VERCEL_PROJECT_PRODUCTION_URL;
  const raw = explicit || (vercel ? `https://${vercel}` : "http://localhost:3001");
  return raw.replace(/\/+$/, "");
}

export const siteUrl = resolveSiteUrl();

const meta = content.site.metadata;

export const seo = {
  siteUrl,
  title: fill(meta.title, { name: profile.name }),
  description: meta.description,
  ogImageAlt: fill(meta.ogImageAlt, { name: profile.name }),
};

/** schema.org Person + WebSite graph for the home page. */
export function buildJsonLd() {
  const personId = `${siteUrl}/#person`;
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Person",
        "@id": personId,
        name: profile.name,
        alternateName: meta.alternateName,
        jobTitle: meta.jobTitle,
        description: meta.description,
        url: siteUrl,
        image: `${siteUrl}${profile.avatar}`,
        email: `mailto:${profile.email}`,
        address: { "@type": "PostalAddress", addressCountry: meta.country },
        sameAs: content.site.socialLinks.map((link) => link.href),
        knowsAbout: content.skills.items.map((skill) => skill.name),
      },
      {
        "@type": "WebSite",
        "@id": `${siteUrl}/#website`,
        url: siteUrl,
        name: seo.title,
        description: meta.description,
        inLanguage: "en",
        publisher: { "@id": personId },
      },
    ],
  };
}
