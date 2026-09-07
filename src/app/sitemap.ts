import type { MetadataRoute } from "next";
import { siteUrl } from "@/content/site";
import { services } from "@/content/services";
import { cities, getCity } from "@/content/cities";
import { occasions } from "@/content/occasions";
import { themes } from "@/content/themes";
import { packages } from "@/content/packages";

/**
 * The sitemap and `generateStaticParams` must agree. A service × city URL is
 * only listed when the city has genuinely local content — the same gate the
 * route itself applies, so nothing is submitted to Google that would 404 or,
 * worse, resolve to a page with nothing city-specific on it.
 */
const substantive = (citySlug: string) => {
  const city = getCity(citySlug);
  return Boolean(city && city.localities.length >= 3 && city.localNotes.length >= 2);
};

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  const url = (path: string, priority: number, changeFrequency: "weekly" | "monthly") => ({
    url: `${siteUrl}${path === "/" ? "" : path}`,
    lastModified: now,
    changeFrequency,
    priority,
  });

  const serviceCityUrls = services.flatMap((service) => {
    const available = service.cities.length ? service.cities : cities.map((c) => c.slug);
    return available.filter(substantive).map((city) => url(`/${service.slug}/${city}`, 0.9, "weekly"));
  });

  return [
    url("/", 1, "weekly"),
    url("/decorations", 0.8, "monthly"),
    url("/packages", 0.9, "weekly"),
    url("/occasions", 0.8, "monthly"),
    url("/themes", 0.8, "monthly"),
    url("/cities", 0.8, "monthly"),
    url("/gallery", 0.6, "monthly"),
    url("/faqs", 0.6, "monthly"),
    url("/contact", 0.7, "monthly"),
    ...services.map((s) => url(`/${s.slug}`, 0.9, "weekly")),
    ...serviceCityUrls,
    ...cities.map((c) => url(`/cities/${c.slug}`, 0.8, "monthly")),
    ...occasions.map((o) => url(`/occasions/${o.slug}`, 0.7, "monthly")),
    ...themes.map((t) => url(`/themes/${t.slug}`, 0.7, "monthly")),
    ...packages.map((p) => url(`/packages/${p.slug}`, 0.8, "weekly")),
    url("/privacy", 0.3, "monthly"),
    url("/terms", 0.3, "monthly"),
  ];
}
