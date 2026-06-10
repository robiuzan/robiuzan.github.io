/**
 * Shape of an authored page in `content/enriched/<id>.mjs` (each file `export default` this).
 * Documentation/type-checking only — the data is plain `.mjs` consumed by scripts/enrich.mjs
 * at build time (the Next app renders the resulting site.json, not these modules).
 */
export type PageKind = "service" | "brand-key" | "location" | "core";

export interface RelatedLink {
  label: string;
  href: string; // existing route path, e.g. "/services/שכפול-מפתח-מאזדה/"
}

export interface FeatureCard {
  title: string;
  text: string;
}

export interface PricingRow {
  service: string;
  price: string; // pre-formatted, e.g. "200 – 350 ₪"
}

export interface FaqItem {
  q: string;
  a: string;
}

export interface EnrichedPage {
  id: number; // matches SitePage.id in content/site.json
  kind: PageKind;
  keyword: string; // primary keyword == page title (decoded)
  brand?: string; // brand-key pages
  city?: string; // location pages → schema areaServed

  seo: { title: string; description: string };
  hero: { h1: string; tagline: string };
  intro: { heading: string; paragraphs: string[]; outro?: string[] };
  pricing: PricingRow[];
  advantages?: { caption?: string; intro?: string; features?: FeatureCard[] };
  faq: { subtitle?: string; items: FaqItem[] };
  related: { services: RelatedLink[]; locations: RelatedLink[] };
  cta: { heading: string; body?: string };
}
