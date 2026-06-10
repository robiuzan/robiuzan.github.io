@AGENTS.md

# 3locksmiths.co.il — WordPress → Next.js 1:1 Migration

This project is a **pixel-perfect 1:1 migration** of an existing WordPress site to a modern
React stack. It is **NOT** a redesign. Every decision is judged against one question:
*"Does this match the live WordPress source exactly?"*

## Stack
- **Next.js 16.2.9** (App Router) — ⚠️ breaking changes vs. older Next; read `node_modules/next/dist/docs/` before touching routing/metadata/image APIs.
- **React 19**
- **TypeScript** (strict)
- **Tailwind CSS v4** — CSS-first config via `@theme` in `app/globals.css` (there is **no** `tailwind.config.ts` by default). Brand colors/fonts go in the `@theme` block.
- Data source: WordPress REST API at `${NEXT_PUBLIC_WP_URL}/wp-json/wp/v2/`.
- Rendering strategy: **SSG** (`generateStaticParams` + static `fetch`).

## Primary Directive — Strict 1:1 Replication
- Replicate the source WordPress site exactly: **design, content, layout, URL/permalink structure, metadata, and internal links.**
- Content is fetched from `/wp-json/wp/v2/` (pages, posts, media, menus). **No invented content, no creative liberties.**
- Preserve the exact **H1 → H2 → H3** heading hierarchy from the source HTML.
- Preserve **internal links** exactly (same slugs/paths as WordPress permalinks).

## RTL & Localization (mandatory)
- Document root: `<html lang="he" dir="rtl">`.
- Locale: Hebrew / Israel (`he-IL`). Phone numbers, dates, currency follow Israeli conventions.
- Use **logical/RTL-aware Tailwind utilities**: `ps-*`/`pe-*` (not `pl-*`/`pr-*`), `ms-*`/`me-*`, `start-*`/`end-*`, `text-start`/`text-end`, and `space-x-reverse` where needed.
- Layout and text flow must mirror the Hebrew source perfectly (right-to-left).

## Code Style
- **Strict TypeScript.** No `any` in committed code. Model all WordPress structures with explicit interfaces (`WP_Page`, `WP_Post`, `WP_Media`, `WP_MenuItem`, etc.) — see `lib/wp.ts`.
- Keep UI modular: extract repeatable elements (header, footer, nav, contact form, floating WhatsApp button, service cards) into `/components`.
- Match the source's existing visual conventions; do not introduce new design patterns.

## ⚠️ Actual source architecture (discovered) & migration approach
The source is **NOT** a Gutenberg/block site. It is a **custom theme `gogo`** (`/wp-content/themes/gogo/`)
with a server-side page builder + heavy custom jQuery. Consequences:
- The REST API returns **empty `content.rendered`** for all 7 inner pages, and `acf` is empty. The design +
  content is rendered by theme PHP from post-meta the REST API does **not** expose.
- **Therefore the page bodies are sourced from the LIVE rendered HTML**, not REST content. REST is still used for
  the page list (slugs/permalinks/titles), media, and structure.
- Structure per page: `<header class="template-header">`, `<nav class="nav-bottom">`/`<nav class="nav-side">`,
  `<main class="page-template-builder">`, `<section class="section-header-banner">`, `<footer class="footer">`.
- Interactive features rely on jQuery: `nav.js` (mobile menu), `owl.carousel`, `magnific-popup` (CF7 contact
  **popup** — `/contact` itself 404s), `calculator.js` (price calc), `quiz.js`, `marquee`, `fancybox`, `matchHeight`.

**Chosen approach — Faithful HTML+CSS port (user-approved):**
- Scrape each live page; extract `header` / `main` / `footer`; render via `dangerouslySetInnerHTML` (React treats it
  as opaque so the original jQuery can safely enhance it).
- **Vendor the original assets locally** under `public/` mirrored at their original paths (`/wp-content/...`) so the
  same absolute URLs resolve: theme + plugin CSS, theme JS, icon fonts, and referenced upload images. Rewrite the
  `https://3locksmiths.co.il` origin → relative in scraped HTML/head.
- Load **jQuery + the theme JS** via `next/script` (afterInteractive) to reproduce interactions exactly.
- Google Fonts (**Alexandria, Rubik, Poppins**) via the original `<link>` to Google's CDN, matching the source.
- **Tailwind preflight is DISABLED** (import utilities only) — the global reset would clobber the theme CSS and break
  fidelity. The ported content is styled by the original theme CSS, not Tailwind.
- Decode HTML entities (`he`) for titles coming back from the API where needed.
- `html-react-parser` remains available if specific nodes later need to become React components.

## SEO / Metadata
- Use `generateMetadata` to emit `<title>`, `<meta name="description">`, and canonical URLs **identical** to the WordPress source (prefer Yoast/RankMath fields if exposed in the REST payload, else fall back to `title`/`excerpt`).
- Never change URLs — the canonical and route paths must equal the WP permalink.

## Images
- `next.config.ts` → `images.remotePatterns` must allow the WordPress domain so `<Image>` can load media directly from WP.

## Build gate
- `npm run build` must pass with **zero** TypeScript/compile errors and `generateStaticParams` must successfully generate all routes before any phase is considered done.
