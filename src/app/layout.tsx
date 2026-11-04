import type { Metadata, Viewport } from "next";
import { Be_Vietnam_Pro, Figtree } from "next/font/google";
import { content, profile } from "@/lib/content";
import { buildJsonLd, seo, siteUrl } from "@/lib/seo";
import "./globals.scss";

// Figtree is a variable font, so it needs no weight list. Be Vietnam Pro is
// static: 400 body, 600 and 700 match the weights used in the stylesheets.
const figtree = Figtree({
  variable: "--font-figtree",
  subsets: ["latin"],
});

const beVietnamPro = Be_Vietnam_Pro({
  variable: "--font-be-vietnam-pro",
  subsets: ["latin"],
  weight: ["400", "600", "700"],
});

const siteName = profile.name;

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: { default: seo.title, template: `%s | ${siteName}` },
  description: seo.description,
  applicationName: siteName,
  keywords: content.site.metadata.keywords,
  authors: [{ name: siteName, url: siteUrl }],
  creator: siteName,
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    url: "/",
    siteName,
    title: seo.title,
    description: seo.description,
    locale: content.site.metadata.locale,
    // The image itself comes from app/opengraph-image.tsx.
  },
  twitter: {
    card: "summary_large_image",
    title: seo.title,
    description: seo.description,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-image-preview": "large", "max-snippet": -1, "max-video-preview": -1 },
  },
  formatDetection: { email: false, address: false, telephone: false },
};

export const viewport: Viewport = {
  themeColor: content.site.metadata.themeColor,
  colorScheme: "dark",
};

// Runs before first paint. Flags the session intro as pending unless it already
// played this session (sessionStorage may throw, in which case it plays every
// load). The failsafe clears the flag if hydration never completes it.
// Key must match STORAGE_KEY in components/organisms/Loader/Loader.tsx.
const introScript = `try{if(!sessionStorage.getItem("portfolio:intro-played"))document.documentElement.dataset.intro="pending"}catch(e){document.documentElement.dataset.intro="pending"}setTimeout(function(){delete document.documentElement.dataset.intro},8000)`;

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${figtree.variable} ${beVietnamPro.variable}`} suppressHydrationWarning>
      <body>
        <script dangerouslySetInnerHTML={{ __html: introScript }} />
        <script
          type="application/ld+json"
          // "<" is escaped so profile content can never close the script tag.
          dangerouslySetInnerHTML={{ __html: JSON.stringify(buildJsonLd()).replace(/</g, "\\u003c") }}
        />
        {children}
      </body>
    </html>
  );
}
