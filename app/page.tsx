import type { Metadata } from "next";
import SiteFrame from "@/components/SiteFrame";
import { getFrontPage, buildMetadata } from "@/lib/content";

// The WordPress front page (page id 7, "עמוד הבית") whose permalink is the site root "/".
export const dynamic = "force-static";

export function generateMetadata(): Metadata {
  return buildMetadata(getFrontPage().seo);
}

export default function HomePage() {
  return <SiteFrame page={getFrontPage()} />;
}
