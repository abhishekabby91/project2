"use client";

import Script from "next/script";
import { useEffect } from "react";
import { GA_MEASUREMENT_ID, analyticsEnabled, trackEvent } from "@/lib/analytics";
import { defaultState, readConsent } from "@/lib/consent";
import { site } from "@/content/site";

/**
 * Google Analytics 4, plus automatic conversion tracking for the actions that
 * matter on a professional services site.
 *
 * Renders nothing when `NEXT_PUBLIC_GA_MEASUREMENT_ID` is unset, so the default
 * build ships no third-party script at all.
 *
 * Conversions are caught by one delegated listener rather than an onClick on
 * every button. That means a client fork gets tracking on CTAs it adds later
 * without touching this file — which matters, because forks must not edit
 * `src/`. See CLAUDE.md.
 */
export function Analytics() {
  useEffect(() => {
    if (!analyticsEnabled) return;

    const onClick = (event: MouseEvent) => {
      // Consent Mode already suppresses storage, but there is no reason to
      // send an event the visitor declined to be measured by.
      const consent = readConsent() ?? defaultState();
      if (!consent.analytics) return;

      const link = (event.target as HTMLElement | null)?.closest?.("a");
      if (!link) return;
      const href = link.getAttribute("href") ?? "";

      if (href.startsWith("tel:")) {
        trackEvent("phone_click", { phone_number: href.replace("tel:", "") });
      } else if (href.startsWith("mailto:")) {
        trackEvent("email_click");
      } else if (href.includes("wa.me") || href.startsWith("https://api.whatsapp")) {
        // WhatsApp is the primary conversion path in this market.
        trackEvent("whatsapp_click", { page_path: window.location.pathname });
      } else if (href.startsWith("/book") || href.startsWith("/contact")) {
        // `link_text` shows which CTA on which page actually converts, which is
        // the input a CRO decision needs.
        trackEvent("booking_click", {
          link_text: (link.textContent ?? "").trim().slice(0, 60),
          page_path: window.location.pathname,
        });
      } else if (href.includes("google.com/maps")) {
        trackEvent("directions_click");
      }
    };

    document.addEventListener("click", onClick, { capture: true });
    return () => document.removeEventListener("click", onClick, { capture: true });
  }, []);

  if (!analyticsEnabled) return null;

  return (
    <>
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`}
        strategy="afterInteractive"
      />
      <Script id="ga4-init" strategy="afterInteractive">
        {`
          // dataLayer and gtag() are already defined by the Consent Mode
          // bootstrap in <head>, which ran before gtag.js loaded. Redefining
          // them here would discard the queued consent defaults.
          gtag('js', new Date());
          gtag('config', '${GA_MEASUREMENT_ID}', { anonymize_ip: true });
        `}
      </Script>
    </>
  );
}
