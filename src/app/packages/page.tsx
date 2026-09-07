import { Suspense } from "react";
import { packages, budgetBands } from "@/content/packages";
import { occasions } from "@/content/occasions";
import { themes } from "@/content/themes";
import { services } from "@/content/services";
import { cities } from "@/content/cities";
import { copy } from "@/content/copy";
import { pageMetadata } from "@/lib/seo";
import { Section, SectionHeading } from "@/components/ui/Section";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import { PackageCard } from "@/components/cards/Cards";
import { CatalogBrowser } from "@/components/catalog/CatalogBrowser";
import { Faqs } from "@/components/sections/Faqs";
import { faqs } from "@/content/faqs";
import { Cta } from "@/components/sections/Cta";

export const metadata = pageMetadata({
  title: "Decoration Packages & Prices in Delhi NCR",
  description:
    "Balloon and party decoration packages with published starting prices, setup times, and exactly what is and is not included. Filter by occasion, theme, city and budget across Delhi, Gurugram, Noida and Faridabad.",
  path: "/packages",
});

/**
 * The catalog.
 *
 * The browser is a client component because filtering is interactive, and it
 * reads the query string, which means it needs a Suspense boundary to be
 * prerendered. The fallback is not a spinner — it is the complete catalog,
 * server-rendered. So the page is whole for a crawler, whole with JavaScript
 * off, and whole in the moment before hydration.
 */
export default function PackagesPage() {
  const pricingFaqs = faqs.filter((f) => f.category === "Pricing" || f.category === "Changes");

  const options = {
    occasion: occasions.map((o) => ({ slug: o.slug, label: o.name })),
    theme: themes.map((t) => ({ slug: t.slug, label: t.name })),
    service: services.map((s) => ({ slug: s.slug, label: s.name })),
    city: cities.map((c) => ({ slug: c.slug, label: c.name })),
  };

  return (
    <>
      <Breadcrumbs items={[{ name: "Packages", href: "/packages" }]} />
      <Section as="div">
        <SectionHeading
          eyebrow={copy.packages.indexEyebrow}
          title={copy.packages.indexTitle}
          lead={copy.packages.indexLead}
          level={1}
        />
        <Suspense fallback={<PackageGrid />}>
          <CatalogBrowser
            packages={packages}
            budgetBands={budgetBands}
            options={options}
            cityCount={cities.length}
          />
        </Suspense>
      </Section>
      <Faqs items={pricingFaqs} title="About pricing" eyebrow="FAQs" />
      <Cta />
    </>
  );
}

/**
 * The unfiltered catalog, for crawlers and for the frame before hydration.
 *
 * It carries the browser's exact two-column shell with the rail column left
 * empty, so the rail appears into reserved space instead of shoving the whole
 * grid sideways. Same reason the count row is here: the results start at the
 * same y in both frames, and nothing jumps.
 */
function PackageGrid() {
  return (
    <div className="mt-10 grid gap-8 lg:grid-cols-[16rem_1fr] lg:gap-10">
      <div aria-hidden="true" />
      <div>
        <h2 className="sr-only">{copy.catalog.resultsHeading}</h2>
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-line pb-4">
          <p className="text-sm font-medium text-ink">{copy.catalog.resultCount(packages.length)}</p>
        </div>
        <div className="mt-8 grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
          {packages.map((pkg) => (
            <PackageCard key={pkg.slug} pkg={pkg} headingLevel={3} cityCount={cities.length} />
          ))}
        </div>
      </div>
    </div>
  );
}
