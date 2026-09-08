import Link from "next/link";
import { services } from "@/content/services";
import { cities, getCity } from "@/content/cities";
import { copy } from "@/content/copy";
import { Section, SectionHeading } from "@/components/ui/Section";

/**
 * Service × city, as a link grid.
 *
 * The competitors all carry a block like this on the home page, and it is
 * doing real work: thirty pages that would otherwise be reachable only from
 * their own service page get a direct link from the site's most-linked page,
 * which is how internal weight actually moves.
 *
 * The gate is the same one the route and the sitemap apply — a pairing only
 * appears where the city carries genuinely local content. A link grid that
 * advertised thin pages would be the doorway pattern with extra steps, so the
 * predicate is imported from one place rather than repeated by hand.
 */
export function CityCategoryLinks() {
  const substantive = (citySlug: string) => {
    const city = getCity(citySlug);
    return Boolean(city && city.localities.length >= 3 && city.localNotes.length >= 2);
  };

  const rows = cities.filter((c) => substantive(c.slug));
  if (!rows.length) return null;

  return (
    <Section tone="muted" ariaLabelledBy="city-links-heading">
      <SectionHeading
        eyebrow={copy.browse.cityLinksEyebrow}
        title={copy.browse.cityLinksTitle}
        lead={copy.browse.cityLinksLead}
        id="city-links-heading"
      />

      <div className="mt-10 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
        {rows.map((city) => {
          const available = services.filter(
            (s) => !s.cities.length || s.cities.includes(city.slug),
          );
          return (
            <div key={city.slug}>
              <h3 className="text-sm font-semibold uppercase tracking-[0.12em] text-ink-muted">
                <Link
                  href={`/cities/${city.slug}`}
                  className="inline-flex min-h-6 items-center hover:text-accent"
                >
                  {city.name}
                </Link>
              </h3>
              <ul className="mt-3 space-y-1.5">
                {available.map((service) => (
                  <li key={service.slug}>
                    <Link
                      href={`/${service.slug}/${city.slug}`}
                      className="inline-flex min-h-6 items-center text-[0.9375rem] text-ink-muted transition-colors hover:text-accent"
                    >
                      {copy.browse.cityLinkLabel(service.shortName, city.name)}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          );
        })}
      </div>
    </Section>
  );
}
