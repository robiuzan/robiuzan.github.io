// Post-snapshot transforms applied to content/site.json (run after scripts/scrape.mjs).
//
// Contact form: the source uses Contact Form 7, which AJAX-submits to the WordPress REST
// API. After the migration there is no WordPress backend, so we re-point every CF7 form to
// FormSubmit.co (a static-site form service — no backend, emails submissions to the owner)
// and strip the CF7 scripts so they don't hijack the native submit. The markup/styling is
// kept intact for visual fidelity.

import { readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { parse } from "node-html-parser";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const FILE = join(ROOT, "content", "site.json");
const FORM_ENDPOINT = "https://formsubmit.co/robiuzan@gmail.com";

// FormSubmit config (hidden inputs) + a honeypot for spam. `email` field becomes reply-to.
const HIDDEN =
  `<input type="hidden" name="_subject" value="פנייה חדשה מהאתר – שלושה מנעולנים">` +
  `<input type="hidden" name="_template" value="table">` +
  `<input type="hidden" name="_captcha" value="false">` +
  `<input type="text" name="_honey" tabindex="-1" autocomplete="off" aria-hidden="true" style="position:absolute;left:-9999px;width:1px;height:1px;overflow:hidden">`;

const isCf7Script = (s) =>
  s.kind === "src" ? /contact-form-7|\/cf7\.js/.test(s.url) : /\bwpcf7\b/.test(s.code || "");

const site = JSON.parse(readFileSync(FILE, "utf8"));
let formsFixed = 0;
let scriptsRemoved = 0;

for (const page of site.pages) {
  const before = page.scripts.length;
  page.scripts = page.scripts.filter((s) => !isCf7Script(s));
  scriptsRemoved += before - page.scripts.length;

  if (!/wpcf7/.test(page.bodyHtml)) continue;
  const root = parse(page.bodyHtml, {
    blockTextElements: { script: true, style: true, noscript: true, pre: true },
  });
  let changed = false;
  for (const form of root.querySelectorAll("form")) {
    if (!/wpcf7/.test(form.getAttribute("class") || "")) continue;
    form.setAttribute("action", FORM_ENDPOINT);
    form.setAttribute("method", "POST");
    // remove CF7 internal hidden inputs
    for (const input of form.querySelectorAll("input")) {
      if ((input.getAttribute("name") || "").startsWith("_wpcf7")) input.remove();
    }
    // friendlier field names for the notification email (FormSubmit treats `email` as reply-to)
    const nameInput = form.querySelector('input[name="form-name"]');
    if (nameInput) nameInput.setAttribute("name", "name");
    const emailInput = form.querySelector('input[name="form-email"]');
    if (emailInput) emailInput.setAttribute("name", "email");
    // prepend FormSubmit config (idempotent — skip if already present)
    if (!form.querySelector('input[name="_subject"]')) form.set_content(HIDDEN + form.innerHTML);
    formsFixed += 1;
    changed = true;
  }
  if (changed) page.bodyHtml = root.toString();
}

writeFileSync(FILE, JSON.stringify(site, null, 2), "utf8");
console.log(`transform: re-pointed ${formsFixed} CF7 form(s) → FormSubmit; removed ${scriptsRemoved} CF7 script(s).`);
