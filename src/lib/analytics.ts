/**
 * Analytics helpers.
 *
 * Every function here is a no-op when no measurement ID is configured, so the
 * site runs identically with analytics off — which is the default, and the
 * correct state for a staging review.
 */

declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: (...args: unknown[]) => void;
  }
}

export const GA_MEASUREMENT_ID = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID ?? "";

export const analyticsEnabled = Boolean(GA_MEASUREMENT_ID);

/**
 * The conversions worth measuring here. Kept short on purpose: a handful of
 * events that map to a booking beats fifty that map to curiosity.
 *
 * WhatsApp leads because in this market it is the booking, not a step toward
 * one.
 */
export type ConversionEvent =
  | "whatsapp_click"
  | "booking_click"
  | "phone_click"
  | "email_click"
  | "enquiry_form_submit"
  | "package_view"
  | "directions_click";

export function trackEvent(
  event: ConversionEvent,
  params: Record<string, string | number | undefined> = {},
) {
  if (typeof window === "undefined" || !window.gtag) return;
  window.gtag("event", event, params);
}
