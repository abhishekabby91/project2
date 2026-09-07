import { site } from "@/content/site";

/**
 * A contact route that always works.
 *
 * The legal pages have to point somewhere a request actually arrives — a
 * privacy policy telling someone to email an address that bounces is not a
 * privacy policy. While `site.email` is null this renders the phone number
 * instead, so the sentence around it stays true either way.
 *
 * Phrase the surrounding sentence to suit both: "contact us on …" reads
 * correctly with an address or a number; "write to …" does not.
 */
export function ContactRoute() {
  if (site.email) {
    return <a href={`mailto:${site.email}`}>{site.email}</a>;
  }
  return <a href={`tel:${site.phoneHref}`}>{site.phone}</a>;
}
