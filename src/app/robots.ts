import type { MetadataRoute } from "next";
import { siteUrl } from "@/content/site";
import { indexingAllowed } from "@/lib/indexing";

/**
 * A deployment that has not been signed off refuses all crawlers, rather than
 * inviting them onto placeholder prices and a phone number that goes nowhere.
 * See src/lib/indexing.ts for what has to be true before this opens up.
 */
export default function robots(): MetadataRoute.Robots {
  if (!indexingAllowed()) {
    return { rules: [{ userAgent: "*", disallow: "/" }] };
  }

  return {
    rules: [{ userAgent: "*", allow: "/", disallow: ["/api/"] }],
    sitemap: `${siteUrl}/sitemap.xml`,
    host: siteUrl,
  };
}
