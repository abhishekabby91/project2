import { notFound } from "next/navigation";
import Link from "next/link";
import { packages, getPackage } from "@/content/packages";
import { getCity } from "@/content/cities";
import { getService } from "@/content/services";
import { getOccasion } from "@/content/occasions";
import { copy } from "@/content/copy";
import { site, whatsappLink, formatPrice } from "@/content/site";
import { pageMetadata } from "@/lib/seo";
import { packageSchema } from "@/lib/schema";
import { Section, SectionHeading } from "@/components/ui/Section";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import { CheckList, PackageCard } from "@/components/cards/Cards";
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

export default async function PackagePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const pkg = getPackage(slug);
  if (!pkg) notFound();

  const related = packages
    .filter((p) => p.slug !== pkg.slug && p.services.some((s) => pkg.services.includes(s)))
    .slice(0, 3);

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

            {pkg.images.length ? (
              <div className="mt-9 grid gap-3 sm:grid-cols-2">
                {pkg.images.map((image) => (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    key={image.src}
                    src={image.src}
                    alt={image.alt}
                    className="w-full rounded-brand-lg border border-line object-cover"
                    loading="lazy"
                  />
                ))}
              </div>
            ) : (
              /* Honest about the gap rather than filling it with stock imagery
                 of work this team did not do. */
              <p className="mt-9 rounded-brand-lg border border-dashed border-line bg-muted p-6 text-sm leading-relaxed text-ink-muted">
                {copy.packages.noImagesNote}
              </p>
            )}

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
              <p className="mt-1 font-serif text-4xl font-semibold text-primary">
                {formatPrice(pkg.priceFrom)}
                {pkg.priceTo ? (
                  <span className="text-lg font-normal text-ink-muted"> – {formatPrice(pkg.priceTo)}</span>
                ) : null}
              </p>

              <dl className="mt-6 space-y-4 border-t border-line pt-6 text-sm">
                <div className="flex items-start gap-3">
                  <Icon name="clock" className="mt-0.5 h-4 w-4 shrink-0 text-accent" />
                  <div>
                    <dt className="font-semibold text-primary">{copy.packages.setupTimeLabel}</dt>
                    <dd className="text-ink-muted">{pkg.setupTime}</dd>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Icon name="pin" className="mt-0.5 h-4 w-4 shrink-0 text-accent" />
                  <div>
                    <dt className="font-semibold text-primary">{copy.packages.availableInTitle}</dt>
                    <dd className="text-ink-muted">
                      {pkg.cities.map((c) => getCity(c)?.name).filter(Boolean).join(", ")}
                    </dd>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Icon name="sparkle" className="mt-0.5 h-4 w-4 shrink-0 text-accent" />
                  <div>
                    <dt className="font-semibold text-primary">{copy.packages.goodForTitle}</dt>
                    <dd className="text-ink-muted">
                      {pkg.occasions.map((o) => getOccasion(o)?.name).filter(Boolean).join(", ")}
                    </dd>
                  </div>
                </div>
              </dl>

              <div className="mt-7 grid gap-3">
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

            <ul className="mt-6 flex flex-wrap gap-2">
              {pkg.services.map((s) => {
                const service = getService(s);
                if (!service) return null;
                return (
                  <li key={s}>
                    <Link
                      href={`/${service.slug}`}
                      className="inline-flex rounded-full border border-line bg-surface px-3.5 py-1.5 text-sm text-ink-muted transition-colors hover:border-accent/40 hover:text-accent"
                    >
                      {service.name}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </aside>
        </div>
      </Section>

      {related.length ? (
        <Section tone="muted" ariaLabelledBy="pkg-related">
          <SectionHeading title="Other setups people compare this with" id="pkg-related" />
          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {related.map((p) => (
              <PackageCard key={p.slug} pkg={p} headingLevel={3} />
            ))}
          </div>
        </Section>
      ) : null}

      <Cta context={pkg.name} />
      <JsonLd data={packageSchema(pkg)} />
    </>
  );
}
