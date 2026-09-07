import { unverifiedClaims } from "@/content/verification";

/**
 * Whether this deployment may be indexed by search engines.
 *
 * Two things have to be true, and neither is a formality:
 *
 *   1. Someone has signed off every class of public claim in
 *      content/verification.ts. A site whose prices, service areas and
 *      photographs nobody has confirmed does not belong in a search index —
 *      that is the same gate `npm run check:content` enforces at build time,
 *      applied to the live site.
 *
 *   2. NEXT_PUBLIC_SITE_URL is set. Without it every canonical points at the
 *      default domain in site.ts, which on a *.vercel.app deployment is a
 *      domain that may not exist yet. Indexing a preview whose canonicals
 *      point elsewhere is how a site ends up competing with itself.
 *
 * The failure mode this prevents is specific: a staging URL with placeholder
 * contact details and unconfirmed prices getting crawled, ranking, and being
 * found by a real customer who then calls a number that goes nowhere.
 *
 * Set NEXT_PUBLIC_SITE_URL and sign off verification.ts, and indexing turns
 * itself on. There is no flag to flip.
 */
export function indexingAllowed(): boolean {
  if (!process.env.NEXT_PUBLIC_SITE_URL) return false;
  return unverifiedClaims().length === 0;
}

/** Why indexing is off, for the banner and for anyone reading the HTML. */
export function indexingBlockedReason(): string | null {
  if (!process.env.NEXT_PUBLIC_SITE_URL) {
    return "NEXT_PUBLIC_SITE_URL is not set, so canonical URLs point at the default domain.";
  }
  const pending = unverifiedClaims();
  if (pending.length > 0) {
    return `Unverified claims in content/verification.ts: ${pending.join(", ")}.`;
  }
  return null;
}
