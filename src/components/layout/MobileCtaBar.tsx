"use client";

import { useEffect, useState } from "react";
import { site, whatsappLink } from "@/content/site";
import { copy } from "@/content/copy";
import { Icon } from "@/components/ui/Icon";
import { cn } from "@/lib/utils";

/**
 * Sticky mobile action bar. WhatsApp leads because that is how this market
 * actually books — the call button is the fallback, not the other way round.
 *
 * Appears past the hero so it doesn't compete with the hero's own buttons, and
 * stands down while the cookie banner occupies the same corner.
 */
export function MobileCtaBar() {
  const [visible, setVisible] = useState(false);
  const [pageCta, setPageCta] = useState(false);

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 520);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // A page may raise its own bar with more to say — a package page puts the
  // price in it. Sliding this one out of view is not enough: an off-screen bar
  // that still takes focus gives a keyboard user two bars and one of them
  // invisible. So it comes out of the tree instead.
  useEffect(() => {
    const root = document.documentElement;
    const read = () => setPageCta(root.dataset.pageCta === "true");
    read();
    const observer = new MutationObserver(read);
    observer.observe(root, { attributes: true, attributeFilter: ["data-page-cta"] });
    return () => observer.disconnect();
  }, []);

  if (pageCta) return null;

  return (
    <div
      className={cn(
        "no-print fixed inset-x-0 bottom-0 z-40 border-t border-line bg-surface/95 backdrop-blur transition-transform duration-300 lg:hidden",
        visible ? "translate-y-0" : "translate-y-full",
        "[html[data-consent-open]_&]:translate-y-full",
      )}
      aria-hidden={!visible}
    >
      <div
        className="grid grid-cols-2 gap-2 p-3"
        style={{ paddingBottom: "calc(0.75rem + env(safe-area-inset-bottom))" }}
      >
        <a
          href={`tel:${site.phoneHref}`}
          tabIndex={visible ? undefined : -1}
          className="inline-flex items-center justify-center gap-2 rounded-brand border border-line px-4 py-3 text-sm font-semibold text-primary"
        >
          <Icon name="phone" className="h-4 w-4" />
          {copy.cta.callShort}
        </a>
        <a
          href={whatsappLink()}
          data-conversion="whatsapp_click"
          rel="noopener noreferrer"
          target="_blank"
          tabIndex={visible ? undefined : -1}
          className="inline-flex items-center justify-center gap-2 rounded-brand bg-accent px-4 py-3 text-sm font-semibold text-accent-fg"
        >
          <Icon name="whatsapp" className="h-4 w-4" />
          {copy.cta.whatsappShort}
        </a>
      </div>
    </div>
  );
}
