import type { MetadataRoute } from "next";
import { siteUrl } from "@/content/site";
import { allowedAiCrawlers, blockedAiCrawlers } from "@/content/crawlers";
import { indexingAllowed } from "@/lib/indexing";

/**
 * A deployment that has not been signed off refuses all crawlers, rather than
 * inviting them onto placeholder prices and a phone number that goes nowhere.
 * See src/lib/indexing.ts for what has to be true before this opens up.
 *
 * Once it is open, AI crawlers get their own rules. Which ones and why is a
 * commercial decision and lives in content/crawlers.ts — the short version is
 * that assistants able to cite the business are a route to a booking, and bulk
 * training harvesters are not.
 */
export default function robots(): MetadataRoute.Robots {
  if (!indexingAllowed()) {
    return { rules: [{ userAgent: "*", disallow: "/" }] };
  }

  return {
    rules: [
      { userAgent: "*", allow: "/", disallow: ["/api/"] },
      // Named before the blocks, because a crawler obeys the most specific
      // group that matches its token and never merges two of them.
      ...allowedAiCrawlers().map((c) => ({
        userAgent: c.agent,
        allow: "/",
        disallow: ["/api/"],
      })),
      ...blockedAiCrawlers().map((c) => ({
        userAgent: c.agent,
        disallow: "/",
      })),
    ],
    sitemap: `${siteUrl}/sitemap.xml`,
    host: siteUrl,
  };
}
