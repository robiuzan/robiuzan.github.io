import type { MetadataRoute } from "next";

export const dynamic = "force-static";

// Static /robots.txt — allow all crawling and point to the sitemap.
export default function robots(): MetadataRoute.Robots {
  return {
    rules: [{ userAgent: "*", allow: "/" }],
    sitemap: "https://3locksmiths.co.il/sitemap.xml",
    host: "https://3locksmiths.co.il",
  };
}
