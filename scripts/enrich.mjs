/**
 * Enrich build step (runs after scrape + transform). For every authored page in
 * content/enriched/<id>.mjs it renders the gogo-classed content (lib/enrich/render.mjs),
 * replaces that page's <main> body, sets seo.title/description, and builds the JSON-LD
 * schema (BreadcrumbList + Service + FAQPage; LocalBusiness on the homepage). Also decodes
 * every page.title (fixes the Peugeot &#8217; entity). Idempotent: always rebuilds <main>
 * from the authored data, so `npm run snapshot` is safely repeatable.
 *
 * Run: node scripts/enrich.mjs   (chained into `npm run snapshot`)
 */
import { readFileSync, writeFileSync, readdirSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import he from "he";
import { renderContentBlocks } from "../lib/enrich/render.mjs";
import { parse } from "node-html-parser";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const SITE = join(ROOT, "content", "site.json");
const ENRICHED = join(ROOT, "content", "enriched");
const ORIGIN = "https://3locksmiths.co.il";
const LB_ID = `${ORIGIN}/#LocalBusiness`;

const CITIES = ["תל אביב", "חיפה", "ירושלים", "ראשון לציון", "פתח תקווה", "נתניה", "חולון",
  "רמת גן", "גבעתיים", "בת ים", "באר שבע", "כפר סבא", "רעננה", "חדרה", "קריות"];

const site = JSON.parse(readFileSync(SITE, "utf8"));
const byId = new Map(site.pages.map((p) => [p.id, p]));

// --- Peugeot/entity fix: decode every page.title ---
for (const p of site.pages) p.title = he.decode(p.title || "");

// --- load authored modules ---
const files = readdirSync(ENRICHED).filter((f) => /^\d+\.mjs$/.test(f));
const enriched = [];
for (const f of files) {
  const mod = await import(pathToFileURL(join(ENRICHED, f)).href);
  if (mod.default && typeof mod.default.id === "number") enriched.push(mod.default);
  else console.warn(`  ! ${f}: missing default export with numeric id`);
}

// --- schema builders ---
const J = (o) => JSON.stringify(o);
const abs = (page) => page.seo?.canonical || `${ORIGIN}${page.path}`;

function breadcrumbSchema(data, page) {
  const list = [{ name: "בית", item: `${ORIGIN}/` }];
  if (data.kind === "location") list.push({ name: "אזורי שירות", item: `${ORIGIN}/אזורי-שירות/` });
  else if (data.kind === "service" || data.kind === "brand-key") list.push({ name: "שירותים", item: `${ORIGIN}/services` });
  list.push({ name: data.keyword, item: abs(page) });
  return J({
    "@context": "https://schema.org", "@type": "BreadcrumbList",
    itemListElement: list.map((c, i) => ({ "@type": "ListItem", position: i + 1, name: c.name, item: c.item })),
  });
}

function serviceSchema(data, page) {
  if (data.kind === "core") return null;
  return J({
    "@context": "https://schema.org", "@type": "Service",
    serviceType: data.keyword, name: data.keyword,
    description: data.seo?.description || "",
    provider: { "@id": LB_ID },
    areaServed: data.kind === "location" && data.city
      ? { "@type": "City", name: data.city }
      : { "@type": "Country", name: "IL" },
    url: abs(page),
  });
}

function faqSchema(data) {
  if (!data.faq?.items?.length) return null;
  return J({
    "@context": "https://schema.org", "@type": "FAQPage",
    mainEntity: data.faq.items.map((it) => ({
      "@type": "Question", name: it.q,
      acceptedAnswer: { "@type": "Answer", text: `<p>${it.a}</p>` },
    })),
  });
}

function localBusinessSchema() {
  return J({
    "@context": "https://schema.org", "@type": ["LocalBusiness", "Locksmith"], "@id": LB_ID,
    name: "שלושה מנעולנים", url: `${ORIGIN}/`, telephone: "+972-55-6601006",
    email: "robiuzan@gmail.com", image: `${ORIGIN}/wp-content/uploads/2025/04/157336036_m.jpg`,
    priceRange: "₪₪",
    openingHoursSpecification: [
      { "@type": "OpeningHoursSpecification", dayOfWeek: ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday"], opens: "08:00", closes: "18:00" },
      { "@type": "OpeningHoursSpecification", dayOfWeek: "Saturday", opens: "08:00", closes: "17:00" },
    ],
    areaServed: CITIES.map((c) => ({ "@type": "City", name: c })),
  });
}

// --- inject ---
let injected = 0;
const problems = [];
for (const data of enriched) {
  const page = byId.get(data.id);
  if (!page) { problems.push(`id ${data.id}: not in site.json`); continue; }

  const inner = renderContentBlocks(data);
  const root = parse(page.bodyHtml, { blockTextElements: { script: true, style: true, noscript: true, pre: true } });
  const main = root.querySelector("main.page-template-builder") || root.querySelector("main");
  if (!main) { problems.push(`id ${data.id}: no <main>`); continue; }
  main.setAttribute("data-enriched", "1");
  main.set_content(`<div class="content-blocks">${inner}</div>`);
  page.bodyHtml = root.toString();

  // SEO
  page.seo = page.seo || {};
  if (data.seo?.title) page.seo.title = data.seo.title;
  if (data.seo?.description) page.seo.description = data.seo.description;

  // schema
  page.jsonLd = [breadcrumbSchema(data, page), serviceSchema(data, page), faqSchema(data)].filter(Boolean);

  // assertions
  const h1count = (page.bodyHtml.match(/<h1[\s>]/g) || []).length;
  if (h1count !== 1) problems.push(`id ${data.id}: expected 1 <h1>, found ${h1count}`);
  for (const s of page.jsonLd) { try { JSON.parse(s); } catch { problems.push(`id ${data.id}: invalid JSON-LD`); } }
  injected++;
}

// LocalBusiness on the homepage (id 7), keep its existing schema.
const home = byId.get(7);
if (home) {
  const existing = (home.jsonLd || []).filter((s) => !s.includes('"@id":"' + LB_ID + '"'));
  home.jsonLd = [localBusinessSchema(), ...existing];
}

writeFileSync(SITE, JSON.stringify(site, null, 2), "utf8");
console.log(`enrich: injected ${injected}/${enriched.length} pages, schema set, titles decoded.`);
if (problems.length) {
  console.error(`\nENRICH PROBLEMS (${problems.length}):`);
  for (const p of problems) console.error("  ! " + p);
  process.exit(1);
}
