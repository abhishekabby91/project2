import { notFound } from "next/navigation";
import Link from "next/link";
import { packages, getPackage } from "@/content/packages";
import { cities, getCity } from "@/content/cities";
import { getService } from "@/content/services";
import { getOccasion } from "@/content/occasions";
import { getTheme } from "@/content/themes";
import { copy } from "@/content/copy";
import { site, whatsappLink, formatPrice } from "@/content/site";
import { pageMetadata } from "@/lib/seo";
import { packageSchema } from "@/lib/schema";
import { Section, SectionHeading } from "@/components/ui/Section";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import { CheckList, PackageCard } from "@/components/cards/Cards";
import { PackageGallery } from "@/components/catalog/PackageGallery";
import { PackageBookingBar } from "@/components/catalog/PackageBookingBar";
import { Cta } from "@/components/sections/Cta";
import { JsonLd } from "@/components/seo/JsonLd";
import { Button } from "@/components/ui/Button";
import { Icon } from "@/components/ui/Icon";

export const dynamicParams = false;

export function generateStaticParams() {
  return packages.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const pkg = getPackage(slug);
  if (!pkg) return {};
  return pageMetadata({
    title: pkg.seo.title,
    description: pkg.seo.description,
    path: `/packages/${pkg.slug}`,
  });
}

/**
 * One setup: what it is, what it costs, what it does not include, and every
 * route onwards from it.
 *
 * The cross-links are the structural part. Someone who arrived from a theme
 * should be able to leave towards the occasion, the city or the service without
 * going back to the catalog first. That lattice is what the competitors in this
 * market build, and what a flat set of product pages never has.
 */
export default async function PackagePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const pkg = getPackage(slug);
  if (!pkg) notFound();

  const related = packages
    .filter((p) => p.slug !== pkg.slug && p.services.some((s) => pkg.services.includes(s)))
    .slice(0, 3);

  const occasionLinks = pkg.occasions
    .map((s) => getOccasion(s))
    .filter(Boolean)
    .map((o) => ({ slug: o!.slug, name: o!.name, href: `/occasions/${o!.slug}` }));
  const themeLinks = pkg.themes
    .map((s) => getTheme(s))
    .filter(Boolean)
    .map((t) => ({ slug: t!.slug, name: t!.name, href: `/themes/${t!.slug}` }));
  const cityLinks = pkg.cities
    .map((s) => getCity(s))
    .filter(Boolean)
    .map((c) => ({ slug: c!.slug, name: c!.name, href: `/cities/${c!.slug}` }));
  const serviceLinks = pkg.services
    .map((s) => getService(s))
    .filter(Boolean)
    .map((s) => ({ slug: s!.slug, name: s!.name, href: `/${s!.slug}` }));

  return (
    <>
      <Breadcrumbs
        items={[
          { name: "Packages", href: "/packages" },
          { name: pkg.name, href: `/packages/${pkg.slug}` },
        ]}
      />

      <Section as="div">
        <div className="grid gap-10 lg:grid-cols-[1.4fr_1fr] lg:gap-14">
          <div>
            <SectionHeading eyebrow="Package" title={pkg.name} lead={pkg.summary} level={1} />

            <PackageGallery pkg={pkg} />

            <div className="mt-12 grid gap-10 sm:grid-cols-2">
              <div>
                <h2 className="text-xl">{copy.packages.includesTitle}</h2>
                <div className="mt-5">
                  <CheckList items={pkg.includes} />
                </div>
              </div>
              <div>
                <h2 className="text-xl">{copy.packages.excludesTitle}</h2>
                <div className="mt-5">
                  <CheckList items={pkg.excludes} tone="negative" />
                </div>
              </div>
            </div>
          </div>

          <aside className="lg:sticky lg:top-28 lg:self-start">
            <div className="rounded-brand-lg border border-line bg-muted p-7">
              <p className="text-xs font-semibold uppercase tracking-[0.12em] text-ink-muted">
                {copy.packages.priceFromLabel}
              </p>
              <p className="mt-1 font-heading text-4xl font-semibold text-primary">
                {formatPrice(pkg.priceFrom)}
                {pkg.priceTo ? (
                  <span className="text-lg font-normal text-ink-muted"> – {formatPrice(pkg.priceTo)}</span>
                ) : null}
              </p>

              <p className="mt-5 flex items-center gap-2.5 border-t border-line pt-5 text-sm">
                <Icon name="clock" className="h-4 w-4 shrink-0 text-accent" />
                <span className="font-semibold text-primary">{copy.packages.setupTimeLabel}</span>
                <span className="text-ink-muted">{pkg.setupTime}</span>
              </p>

              <div className="mt-6 grid gap-3">
                <Button href={whatsappLink(pkg.name)} external size="lg" data-conversion="whatsapp_click">
                  <Icon name="whatsapp" className="h-4 w-4" />
                  {copy.cta.bookThis(pkg.name)}
                </Button>
                <Button href={`tel:${site.phoneHref}`} external variant="secondary" size="lg">
                  <Icon name="phone" className="h-4 w-4" />
                  {site.phone}
                </Button>
              </div>
            </div>

            {/* Every taxonomy this setup belongs to, as a way out rather than as
                a list of words. */}
            <div className="mt-6 space-y-6">
              <ChipGroup title={copy.packages.goodForTitle} items={occasionLinks} />
              <ChipGroup title={copy.catalog.groups.theme} items={themeLinks} />
              <ChipGroup
                title={copy.packages.availableInTitle}
                items={cityLinks}
                allLabel={pkg.cities.length >= cities.length ? copy.catalog.allCitiesLabel : undefined}
              />
              <ChipGroup title={copy.catalog.groups.service} items={serviceLinks} />
            </div>
          </aside>
        </div>
      </Section>

      {related.length ? (
        <Section tone="muted" ariaLabelledBy="pkg-related">
          <SectionHeading title="Other setups people compare this with" id="pkg-related" />
          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {related.map((p) => (
              <PackageCard key={p.slug} pkg={p} headingLevel={3} cityCount={cities.length} />
            ))}
          </div>
          <div className="mt-10">
            <Button href="/packages" variant="secondary">
              {copy.catalog.seeAllSetups}
            </Button>
          </div>
        </Section>
      ) : null}

      <Cta context={pkg.name} />
      <JsonLd data={packageSchema(pkg)} />
      <PackageBookingBar pkg={pkg} />
    </>
  );
}

/**
 * A labelled row of links out — to the occasion, the theme, the city itself.
 * Those pages carry real content; sending someone to a pre-filtered grid
 * instead would be the thinner destination.
 */
function ChipGroup({
  title,
  items,
  allLabel,
}: {
  title: string;
  items: { slug: string; name: string; href: string }[];
  /** Replaces the chip list when listing every city would just say "everywhere". */
  allLabel?: string;
}) {
  if (!items.length) return null;

  return (
    <div>
      <h2 className="text-xs font-semibold uppercase tracking-[0.12em] text-ink-muted">{title}</h2>
      {allLabel ? (
        <p className="mt-2.5 text-sm text-ink">{allLabel}</p>
      ) : (
        <ul className="mt-2.5 flex flex-wrap gap-2">
          {items.map((item) => (
            <li key={item.slug}>
              <Link
                href={item.href}
                className="inline-flex rounded-full border border-line bg-surface px-3.5 py-1.5 text-sm text-ink-muted transition-colors hover:border-accent/40 hover:text-accent"
              >
                {item.name}
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
