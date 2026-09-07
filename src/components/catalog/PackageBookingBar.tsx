"use client";

import { useEffect } from "react";
import { site, whatsappLink, formatPrice } from "@/content/site";
import { copy } from "@/content/copy";
import { Icon } from "@/components/ui/Icon";
import type { DecorPackage } from "@/content/types";

/**
 * The mobile booking bar on a package page.
 *
 * Carries the price, which the site-wide bar cannot — on a product page the
 * number is half the reason anyone taps. It stands the generic bar down while
 * it is mounted, using the same `data-` marker on <html> that the consent
 * dialog already uses, so there are never two bars stacked in the same corner.
 */
export function PackageBookingBar({ pkg }: { pkg: DecorPackage }) {
  useEffect(() => {
    document.documentElement.dataset.pageCta = "true";
    return () => {
      delete document.documentElement.dataset.pageCta;
    };
  }, []);

  return (
    <div
      className="no-print fixed inset-x-0 bottom-0 z-40 border-t border-line bg-surface/95 backdrop-blur lg:hidden [html[data-consent-open]_&]:translate-y-full"
      style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
    >
      <div className="flex items-center gap-3 p-3">
        <p className="min-w-0 flex-1 leading-tight">
          <span className="block text-[0.6875rem] uppercase tracking-wide text-ink-muted">
            {copy.packages.priceFromLabel}
          </span>
          <span className="block truncate text-lg font-semibold text-primary">
            {formatPrice(pkg.priceFrom)}
          </span>
        </p>
        <a
          href={`tel:${site.phoneHref}`}
          aria-label={copy.cta.call}
          className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-brand border border-line text-primary"
        >
          <Icon name="phone" className="h-4 w-4" />
        </a>
        <a
          href={whatsappLink(pkg.name)}
          data-conversion="whatsapp_click"
          rel="noopener noreferrer"
          target="_blank"
          className="inline-flex shrink-0 items-center gap-2 rounded-brand bg-accent px-4 py-3 text-sm font-semibold text-accent-fg"
        >
          <Icon name="whatsapp" className="h-4 w-4" />
          {copy.cta.whatsappShort}
        </a>
      </div>
    </div>
  );
}
