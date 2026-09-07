import { notFound } from "next/navigation";
import Link from "next/link";
import { services, getService } from "@/content/services";
import { cities } from "@/content/cities";
import { packagesFor } from "@/content/packages";
import { faqs } from "@/content/faqs";
import { copy } from "@/content/copy";
import { pageMetadata } from "@/lib/seo";
import { serviceSchema, faqSchema } from "@/lib/schema";
import { Section, SectionHeading } from "@/components/ui/Section";
import { Container } from "@/components/ui/Container";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import { PackageCard, ServiceCard, CheckList } from "@/components/cards/Cards";
import { Faqs } from "@/components/sections/Faqs";
import { Cta } from "@/components/sections/Cta";
import { JsonLd } from "@/components/seo/JsonLd";
import { Button } from "@/components/ui/Button";
import { site, whatsappLink } from "@/content/site";
import { Icon } from "@/components/ui/Icon";
import { catalogHref } from "@/lib/catalog";

/**
 * Service hub — `/balloon-decoration`, `/birthday-decoration`, and so on.
 *
 * Deliberately at the top level rather than under `/services/`, because that is
 * the URL shape that ranks in this market and the shorter path is what people
 * actually share on WhatsApp.
 */
export const dynamicParams = false;

export function generateStaticParams() {
  return services.map((s) => ({ service: s.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ service: string }> }) {
  const { service: slug } = await params;
  const service = getService(slug);
  if (!service) return {};
  return pageMetadata({
    title: service.seo.title,
    description: service.seo.description,
    path: `/${service.slug}`,
  });
}

export default async function ServicePage({ params }: { params: Promise<{ service: string }> }) {
  const { service: slug } = await params;
  const service = getService(slug);
  if (!service) notFound();

  const servicePackages = packagesFor("services", service.slug);
  const availableCities = service.cities.length
    ? cities.filter((c) => service.cities.includes(c.slug))
    : cities;
  const related = services.filter((s) => s.slug !== service.slug).slice(0, 3);
  const serviceFaqs = faqs.filter((f) => f.category === "Booking" || f.category === "Pricing");

  return (
    <>
      <Breadcrumbs items={[{ name: "Decorations", href: "/decorations" }, { name: service.name, href: `/${service.slug}` }]} />

      <Section as="div">
        <div className="grid gap-10 lg:grid-cols-[1.4fr_1fr] lg:gap-16">
          <div>
            <SectionHeading eyebrow="Service" title={service.name} lead={service.summary} level={1} />
            <p className="mt-6 max-w-2xl text-[1.0625rem] leading-relaxed text-ink">{service.intro}</p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Button href={whatsappLink(service.name)} external size="lg" data-conversion="whatsapp_click">
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
            <h2 className="text-lg">{copy.services.includesTitle(service.name)}</h2>
            <div className="mt-5">
              <CheckList items={service.includes} />
            </div>
          </aside>
        </div>
      </Section>

      {servicePackages.length ? (
        <Section tone="muted" ariaLabelledBy="svc-packages">
          <SectionHeading title={copy.services.packagesTitle(service.name)} id="svc-packages" />
          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {servicePackages.map((pkg) => (
              <PackageCard key={pkg.slug} pkg={pkg} headingLevel={3} cityCount={cities.length} />
            ))}
          </div>
          <div className="mt-10">
            <Button href={catalogHref({ service: service.slug })} variant="secondary">
              {copy.catalog.seeAllSetups}
            </Button>
          </div>
        </Section>
      ) : null}

      {/* City links. Each destination carries its own local content — see the
          note in content/cities.ts about why that matters. */}
      <Section ariaLabelledBy="svc-cities">
        <SectionHeading
          title={copy.services.citiesTitle(service.name)}
          lead="Each city page covers the access rules, travel and timing that actually apply there."
          id="svc-cities"
        />
        <ul className="mt-10 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {availableCities.map((city) => (
            <li key={city.slug}>
              <Link
                href={`/${service.slug}/${city.slug}`}
                className="flex items-center justify-between gap-3 rounded-brand border border-line bg-surface px-5 py-4 text-[0.9375rem] font-medium text-primary transition-colors hover:border-accent/40 hover:text-accent"
              >
                {service.shortName} in {city.name}
                <Icon name="pin" className="h-4 w-4 shrink-0 text-accent" />
              </Link>
            </li>
          ))}
        </ul>
      </Section>

      <Faqs items={serviceFaqs} title="Questions about booking" eyebrow="FAQs" />

      <Section ariaLabelledBy="svc-related">
        <SectionHeading title={copy.services.relatedTitle} id="svc-related" />
        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {related.map((s) => (
            <ServiceCard key={s.slug} service={s} headingLevel={3} />
          ))}
        </div>
      </Section>

      <Cta context={service.name} />

      <JsonLd data={[serviceSchema(service), faqSchema(serviceFaqs)]} />
    </>
  );
}
