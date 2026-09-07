/**
 * Redirects from the business's previous website.
 *
 * When you replace an existing site, every old URL that had traffic or inbound
 * links must point at its new equivalent. Skipping this is the single most
 * common way a redesign loses rankings the business already had — the pages still
 * exist, but every link and every indexed URL now 404s.
 *
 * How to build this list before launch:
 *
 *   1. Export the old site's pages from Google Search Console
 *      (Performance → Pages) and Analytics — anything with impressions or
 *      sessions in the last 12 months.
 *   2. Crawl the old site (Screaming Frog, Sitebulb) for every indexable URL.
 *   3. Map each to its closest equivalent here. Where there is no equivalent,
 *      redirect to the nearest useful parent — /decorations or /, not a 404.
 *   4. After launch, watch Search Console's Coverage report for 404 spikes and
 *      add anything you missed.
 *
 * `permanent: true` emits a 308 and tells search engines to transfer ranking
 * signals. Use it for a real move. Use `false` (307) only for genuinely
 * temporary redirects — a permanent redirect is very hard to walk back.
 */
export interface Redirect {
  /** Old path, with a leading slash. Supports :params and wildcards. */
  source: string;
  /** New path or absolute URL. */
  destination: string;
  /** 308 when true, 307 when false. Default true. */
  permanent?: boolean;
}

export const redirects: Redirect[] = [
  // Examples of the shapes you'll need — delete these and add the real map.
  //
  // { source: "/balloon-decoration-noida", destination: "/balloon-decoration/noida" },
  // { source: "/services/birthday", destination: "/birthday-decoration" },
  // { source: "/gallery/:slug", destination: "/gallery" },
  // { source: "/wp-content/:path*", destination: "/", permanent: true },
];
