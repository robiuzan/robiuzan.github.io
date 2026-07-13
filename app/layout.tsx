import type { Metadata } from "next";
import "./globals.css";
import "./enrich.css";
import SiteAssets from "@/components/SiteAssets";
import { getSite } from "@/lib/content";
import { type SiteManifest } from "@ishub/site-kit";
import { gtmHeadSnippet, gtmNoScriptSrc } from "@ishub/site-kit/analytics";
import siteManifest from "@/site.config.json";

const site = getSite();

/** Normalized per-site manifest (single source of truth for NAP/identity/analytics). */
const manifest = siteManifest as unknown as SiteManifest;

/** Shared GTM loader — inert (renders nothing) until analytics.gtmId is set in the manifest. */
const gtmHead = gtmHeadSnippet(manifest.analytics?.gtmId);
const gtmNoScript = gtmNoScriptSrc(manifest.analytics?.gtmId);
const iconLink = site.assets.headLinks.find(
  (l) => (l.rel ?? "").includes("icon") && !(l.rel ?? "").includes("apple"),
);
const appleLink = site.assets.headLinks.find((l) => (l.rel ?? "").includes("apple"));

// Base metadata shared by every route. Per-page title/description/canonical/robots are
// supplied by each route's generateMetadata() and merged over this by Next.js.
export const metadata: Metadata = {
  metadataBase: new URL(site.wpUrl),
  icons: {
    icon: iconLink?.href,
    apple: appleLink?.href,
  },
  // Google Search Console site verification → <meta name="google-site-verification" ...>
  verification: {
    google: "ifGKeC-eWQKeDqM1qDUOgGmDODCTE1vSalAmg7bGmEI",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  // Hebrew / RTL document root — matches the WordPress source exactly.
  return (
    <html lang="he" dir="rtl">
      <body className="rtl wp-theme-gogo">
        {gtmNoScript && (
          <noscript>
            <iframe
              src={gtmNoScript}
              height="0"
              width="0"
              style={{ display: "none", visibility: "hidden" }}
              title="gtm"
            />
          </noscript>
        )}
        {gtmHead && <script id="gtm-init" dangerouslySetInnerHTML={{ __html: gtmHead }} />}
        <SiteAssets />
        {children}
      </body>
    </html>
  );
}
