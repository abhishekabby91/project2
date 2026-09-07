import { notFound } from "next/navigation";
import Link from "next/link";
import { cities, getCity } from "@/content/cities";
import { services } from "@/content/services";
import { packagesInCity } from "@/content/packages";
import { faqs } from "@/content/faqs";
import { copy } from "@/content/copy";
import { site, whatsappLink } from "@/content/site";
import { pageMetadata } from "@/lib/seo";
import { faqSchema } from "@/lib/schema";
import { Section, SectionHeading } from "@/components/ui/Section";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import { PackageCard, ServiceCard } from "@/components/cards/Cards";
import { Faqs } from "@/components/sections/Faqs";
import { Cta } from "@/components/sections/Cta";
import { JsonLd } from "@/components/seo/JsonLd";
import { Button } from "@/components/ui/Button";
import { Icon } from "@/components/ui/Icon";
import { catalogHref } from "@/lib/catalog";

export const dynamicParams = false;

export function generateStaticParams() {
  return cities.map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const city = getCity(slug);
  if (!city) return {};
  return pageMetadata({
    title: city.seo.title,
    description: city.seo.description,
    path: `/cities/${city.slug}`,
  });
}

export default async function CityPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const city = getCity(slug);
  if (!city) notFound();

  const available = services.filter((s) => !s.cities.length || s.cities.includes(city.slug));
  const cityPackages = packagesInCity(city.slug);
  const localFaqs = faqs.filter((f) => f.category === "Booking" || f.category === "On the day");

  return (
    <>
      <Breadcrumbs
        items={[
          { name: "Areas", href: "/cities" },
          { name: city.name, href: `/cities/${city.slug}` },
        ]}
      />

      <Section as="div">
        <div className="grid gap-10 lg:grid-cols-[1.4fr_1fr] lg:gap-16">
          <div>
            <SectionHeading
              eyebrow={city.state}
              title={`Party decoration in ${city.name}`}
              lead={city.seo.description}
              level={1}
            />
            {city.aliases.length ? (
              <p className="mt-4 text-sm text-ink-muted">
                Also searched as {city.aliases.join(", ")}.
              </p>
            ) : null}
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Button href={whatsappLink(city.name)} external size="lg" data-conversion="whatsapp_click">
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
            <h2 className="text-lg">{copy.cities.localitiesTitle}</h2>
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

      <Section tone="muted" ariaLabelledBy="city-notes">
        <SectionHeading title={copy.cities.localNotesTitle(city.name)} id="city-notes" />
        <div className="mt-10 grid gap-6 lg:grid-cols-3">
          {city.localNotes.map((note) => (
            <p key={note} className="rounded-brand-lg border border-line bg-surface p-6 text-[0.9375rem] leading-relaxed text-ink">
              {note}
            </p>
          ))}
        </div>
      </Section>

      <Section ariaLabelledBy="city-services">
        <SectionHeading title={copy.cities.servicesTitle(city.name)} id="city-services" />
        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {available.map((service) => (
            <ServiceCard key={service.slug} service={service} city={city} headingLevel={3} />
          ))}
        </div>
      </Section>

      {cityPackages.length ? (
        <Section tone="muted" ariaLabelledBy="city-pkgs">
          <SectionHeading title={copy.cities.packagesTitle(city.name)} id="city-pkgs" />
          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {cityPackages.slice(0, 6).map((pkg) => (
              <PackageCard key={pkg.slug} pkg={pkg} headingLevel={3} cityCount={cities.length} />
            ))}
          </div>
          <div className="mt-10">
            <Button href={catalogHref({ city: city.slug })} variant="secondary">
              {copy.catalog.inThisCity(city.name)}
            </Button>
          </div>
        </Section>
      ) : null}

      <Faqs items={localFaqs} title={`Booking in ${city.name}`} eyebrow="FAQs" />

      <Section ariaLabelledBy="other-areas">
        <SectionHeading title="Other areas we cover" id="other-areas" />
        <ul className="mt-8 flex flex-wrap gap-3">
          {cities.filter((c) => c.slug !== city.slug).map((other) => (
            <li key={other.slug}>
              <Link
                href={`/cities/${other.slug}`}
                className="inline-flex rounded-brand border border-line bg-surface px-4 py-2.5 text-sm font-medium text-primary transition-colors hover:border-accent/40 hover:text-accent"
              >
                {other.name}
              </Link>
            </li>
          ))}
        </ul>
      </Section>

      <Cta context={city.name} />
      <JsonLd data={faqSchema(localFaqs)} />
    </>
  );
}
