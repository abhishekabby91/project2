import { notFound } from "next/navigation";
import Link from "next/link";
import { services, getService } from "@/content/services";
import { cities, getCity } from "@/content/cities";
import { packagesFor, packagesInCity } from "@/content/packages";
import { faqs } from "@/content/faqs";
import { copy } from "@/content/copy";
import { site, whatsappLink } from "@/content/site";
import { pageMetadata } from "@/lib/seo";
import { serviceSchema, faqSchema } from "@/lib/schema";
import { Section, SectionHeading } from "@/components/ui/Section";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import { PackageCard, CheckList } from "@/components/cards/Cards";
import { Faqs } from "@/components/sections/Faqs";
import { Cta } from "@/components/sections/Cta";
import { JsonLd } from "@/components/seo/JsonLd";
import { Button } from "@/components/ui/Button";
import { Icon } from "@/components/ui/Icon";

/**
 * Service × city — `/balloon-decoration/noida`. These carry most of the search
 * demand in this market, and they are also the easiest thing in the world to
 * get wrong.
 *
 * A page here is only generated when the city has genuinely local content to
 * put on it: real localities and at least two notes about what booking there
 * actually involves. Without that the page is one city's page with the name
 * swapped — a doorway page, which Google has demoted since 2015 and which is
 * worth less than not publishing at all. `pairIsSubstantive` is the gate, and
 * `scripts/check-content.mjs` refuses to let two cities share their notes.
 */
export const dynamicParams = false;

const pairIsSubstantive = (citySlug: string) => {
  const city = getCity(citySlug);
  return Boolean(city && city.localities.length >= 3 && city.localNotes.length >= 2);
};

export function generateStaticParams() {
  return services.flatMap((service) => {
    const available = service.cities.length ? service.cities : cities.map((c) => c.slug);
    return available
      .filter(pairIsSubstantive)
      .map((city) => ({ service: service.slug, city }));
  });
}

export async function generateMetadata({ params }: { params: Promise<{ service: string; city: string }> }) {
  const { service: serviceSlug, city: citySlug } = await params;
  const service = getService(serviceSlug);
  const city = getCity(citySlug);
  if (!service || !city) return {};

  return pageMetadata({
    // Price is not in the title on purpose. Competitors put "from ₹999" in
    // theirs; ours would be a number nobody has signed off yet, and a price in
    // a SERP is a promise. Add it once content/verification.ts clears pricing.
    title: `${service.name} in ${city.name}`,
    description: `${service.summary} Serving ${city.localities.slice(0, 4).map((l) => l.name).join(", ")} and across ${city.name}.`,
    path: `/${service.slug}/${city.slug}`,
  });
}

export default async function ServiceCityPage({
  params,
}: {
  params: Promise<{ service: string; city: string }>;
}) {
  const { service: serviceSlug, city: citySlug } = await params;
  const service = getService(serviceSlug);
  const city = getCity(citySlug);
  if (!service || !city || !pairIsSubstantive(citySlug)) notFound();

  const available = service.cities.length ? service.cities : cities.map((c) => c.slug);
  if (!available.includes(city.slug)) notFound();

  const cityPackages = packagesFor("services", service.slug).filter((p) =>
    packagesInCity(city.slug).some((c) => c.slug === p.slug),
  );
  const otherCities = cities.filter((c) => c.slug !== city.slug && available.includes(c.slug));
  const localFaqs = faqs.filter((f) => f.category === "On the day" || f.category === "Pricing");
  const context = `${service.name} in ${city.name}`;

  return (
    <>
      <Breadcrumbs
        items={[
          { name: service.name, href: `/${service.slug}` },
          { name: city.name, href: `/${service.slug}/${city.slug}` },
        ]}
      />

      <Section as="div">
        <div className="grid gap-10 lg:grid-cols-[1.4fr_1fr] lg:gap-16">
          <div>
            <SectionHeading
              eyebrow={`${city.name}, ${city.state}`}
              title={copy.services.inCityTitle(service.name, city.name)}
              lead={service.summary}
              level={1}
            />
            <p className="mt-6 max-w-2xl text-[1.0625rem] leading-relaxed text-ink">{service.intro}</p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Button href={whatsappLink(context)} external size="lg" data-conversion="whatsapp_click">
                <Icon name="whatsapp" className="h-4 w-4" />
                {copy.cta.whatsapp}
              </Button>
              <Button href={`tel:${site.phoneHref}`} external variant="secondary" size="lg">
                <Icon name="phone" className="h-4 w-4" />
                {site.phone}
              </Button>
            </div>
          </div>

          <aside className="rounded-brand-lg border border-line bg-muted p-7">
            <h2 className="text-lg">{copy.services.localitiesTitle(city.name)}</h2>
            <ul className="mt-5 flex flex-wrap gap-2">
              {city.localities.map((locality) => (
                <li
                  key={locality.slug}
                  className="rounded-full border border-line bg-surface px-3 py-1.5 text-sm text-ink-muted"
                >
                  {locality.name}
                </li>
              ))}
            </ul>
            {city.travelNote ? (
              <div className="mt-6 border-t border-line pt-5">
                <h3 className="text-sm font-semibold text-primary">{copy.cities.travelNoteTitle}</h3>
                <p className="mt-2 text-sm leading-relaxed text-ink-muted">{city.travelNote}</p>
              </div>
            ) : null}
          </aside>
        </div>
      </Section>

      {/* The reason this page exists rather than redirecting to the hub. */}
      <Section tone="muted" ariaLabelledBy="local-heading">
        <SectionHeading
          title={copy.services.inCityLocalTitle(city.name)}
          lead={`Access, timing and building stock differ enough across NCR that the same setup is a different job in each city. Here is what changes in ${city.name}.`}
          id="local-heading"
        />
        <div className="mt-10 grid gap-6 lg:grid-cols-3">
          {city.localNotes.map((note) => (
            <p key={note} className="rounded-brand-lg border border-line bg-surface p-6 text-[0.9375rem] leading-relaxed text-ink">
              {note}
            </p>
          ))}
        </div>
      </Section>

      <Section ariaLabelledBy="includes-heading">
        <div className="grid gap-10 lg:grid-cols-2 lg:gap-16">
          <div>
            <SectionHeading title={copy.services.includesTitle(service.name)} id="includes-heading" />
            <div className="mt-6">
              <CheckList items={service.includes} />
            </div>
          </div>
          <div>
            <h2 className="text-[1.75rem] leading-[1.18] sm:text-4xl">Getting the team in</h2>
            <p className="mt-4 leading-relaxed text-ink-muted">
              Most delays in {city.name} happen at the gate rather than at the setup. Send us the
              society or building name when you book and we will share the team member&apos;s name,
              number and arrival window the evening before, so the pass is raised in time.
            </p>
          </div>
        </div>
      </Section>

      {cityPackages.length ? (
        <Section tone="muted" ariaLabelledBy="city-packages">
          <SectionHeading title={copy.cities.packagesTitle(city.name)} id="city-packages" />
          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {cityPackages.map((pkg) => (
              <PackageCard key={pkg.slug} pkg={pkg} headingLevel={3} cityCount={cities.length} />
            ))}
          </div>
        </Section>
      ) : null}

      <Faqs items={localFaqs} title={`Booking ${service.shortName.toLowerCase()} in ${city.name}`} eyebrow="FAQs" />

      {otherCities.length ? (
        <Section ariaLabelledBy="other-cities">
          <SectionHeading title={`${service.name} elsewhere in Delhi NCR`} id="other-cities" />
          <ul className="mt-8 flex flex-wrap gap-3">
            {otherCities.map((other) => (
              <li key={other.slug}>
                <Link
                  href={`/${service.slug}/${other.slug}`}
                  className="inline-flex rounded-brand border border-line bg-surface px-4 py-2.5 text-sm font-medium text-primary transition-colors hover:border-accent/40 hover:text-accent"
                >
                  {service.shortName} in {other.name}
                </Link>
              </li>
            ))}
          </ul>
        </Section>
      ) : null}

      <Cta context={context} />

      <JsonLd data={[serviceSchema(service, city), faqSchema(localFaqs)]} />
    </>
  );
}
