import type { MetadataRoute } from "next";
import { siteUrl } from "@/content/site";
import { cities } from "@/content/cities";
import { occasions } from "@/content/occasions";
import { themes } from "@/content/themes";
import { packages, galleryImages } from "@/content/packages";

/**
 * Only canonical, indexable landing pages belong in the sitemap.
 * Service × city URLs are intentionally excluded until each pair has
 * unique local content; those routes remain available to visitors but carry
 * noindex directives in their metadata.
 */

/**
 * No `lastModified`.
 *
 * Stamping every URL with the build time says all eighty-five pages changed
 * the moment the site was deployed, which is false on all but a couple of
 * them. Google's guidance is explicit that it discounts lastmod once it finds
 * it unreliable — so a wrong date is worse than none, and it takes the
 * credibility of the honest dates down with it. Add real per-page dates only
 * if the content ever starts carrying them.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const url = (path: string, priority: number, changeFrequency: "weekly" | "monthly") => ({
    url: `${siteUrl}${path === "/" ? "" : path}`,
    changeFrequency,
    priority,
  });

  return [
    url("/", 1, "weekly"),
    url("/decorations", 0.8, "monthly"),
    url("/packages", 0.9, "weekly"),
    url("/occasions", 0.8, "monthly"),
    url("/themes", 0.8, "monthly"),
    url("/cities", 0.8, "monthly"),
    /* Submitted only once there is something to show. A gallery with no
       photographs is a page whose title, description and heading all promise
       images it does not have — thin by Google's own definition, and the page
       itself is noindex while it is empty, so listing it here would put the
       sitemap and the page in contradiction. It returns the day a real
       photograph lands in content/packages.ts. */
    ...(galleryImages().length ? [url("/gallery", 0.6, "monthly")] : []),
    url("/faqs", 0.6, "monthly"),
    url("/contact", 0.7, "monthly"),
    ...services.map((s) => url(`/${s.slug}`, 0.9, "weekly")),
    // Service × city pages remain navigable but are intentionally omitted
    // until each combination has unique local content and can be indexed.
    ...cities.map((c) => url(`/cities/${c.slug}`, 0.8, "monthly")),
    ...occasions.map((o) => url(`/occasions/${o.slug}`, 0.7, "monthly")),
    ...themes.map((t) => url(`/themes/${t.slug}`, 0.7, "monthly")),
    ...packages.map((p) => url(`/packages/${p.slug}`, 0.8, "weekly")),
    url("/privacy", 0.3, "monthly"),
    url("/terms", 0.3, "monthly"),
  ];
}
