"use client";

/**
 * Faithfully replays the page's original scripts (jQuery → theme libs → inline config →
 * init: nav.js, owl.carousel, magnific-popup CF7 popup, calculator.js, quiz.js, marquee,
 * fancybox, scripts.js) IN DOCUMENT ORDER, after the ported DOM is mounted.
 *
 * The body markup is injected via dangerouslySetInnerHTML (React treats it as opaque), so
 * this jQuery code enhances it exactly as it did on the live WordPress site. Scripts run
 * sequentially: `src` scripts await load before the next runs; inline scripts execute in
 * place. A window guard makes it run once (also safe under React StrictMode double-invoke).
 */
import { useEffect } from "react";
import type { ScriptItem } from "@/lib/content";

declare global {
  interface Window {
    __gogoScriptsStarted?: boolean;
  }
}

export default function ThemeScripts({ scripts }: { scripts: ScriptItem[] }) {
  useEffect(() => {
    if (window.__gogoScriptsStarted) return;
    window.__gogoScriptsStarted = true;

    let i = 0;
    const run = (): void => {
      if (i >= scripts.length) return;
      const item = scripts[i];
      i += 1;
      const el = document.createElement("script");
      if (item.type) el.type = item.type;

      if (item.kind === "src") {
        el.src = item.url;
        el.async = false;
        el.addEventListener("load", run);
        el.addEventListener("error", run);
        document.body.appendChild(el);
      } else {
        try {
          el.text = item.code;
          document.body.appendChild(el);
        } catch {
          /* a malformed inline snippet must not halt the rest of the sequence */
        }
        run();
      }
    };
    run();
  }, [scripts]);

  return null;
}
