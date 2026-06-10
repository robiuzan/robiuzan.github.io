import type { Metadata } from "next";
import "./globals.css";
import SiteAssets from "@/components/SiteAssets";
import { getSite } from "@/lib/content";

const site = getSite();
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
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  // Hebrew / RTL document root — matches the WordPress source exactly.
  return (
    <html lang="he" dir="rtl">
      <body className="rtl wp-theme-gogo">
        <SiteAssets />
        {children}
      </body>
    </html>
  );
}
