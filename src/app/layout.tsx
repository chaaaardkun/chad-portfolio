import type { Metadata } from "next";
import { Be_Vietnam_Pro, Figtree } from "next/font/google";
import { content, fill, profile } from "@/lib/content";
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

export const metadata: Metadata = {
  title: fill(content.site.metadata.title, { name: profile.name }),
  description: content.site.metadata.description,
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
        {children}
      </body>
    </html>
  );
}
