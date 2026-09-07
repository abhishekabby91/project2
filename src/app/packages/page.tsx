import { packages } from "@/content/packages";
import { copy } from "@/content/copy";
import { pageMetadata } from "@/lib/seo";
import { Section, SectionHeading } from "@/components/ui/Section";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import { PackageCard } from "@/components/cards/Cards";
import { Faqs } from "@/components/sections/Faqs";
import { faqs } from "@/content/faqs";
import { Cta } from "@/components/sections/Cta";

export const metadata = pageMetadata({
  title: "Decoration Packages & Prices in Delhi NCR",
  description:
    "Balloon and party decoration packages with published starting prices, setup times, and exactly what is and is not included. Across Delhi, Gurugram, Noida and Faridabad.",
  path: "/packages",
});

export default function PackagesPage() {
  const pricingFaqs = faqs.filter((f) => f.category === "Pricing" || f.category === "Changes");

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
        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {packages.map((pkg) => (
            <PackageCard key={pkg.slug} pkg={pkg} headingLevel={2} />
          ))}
        </div>
      </Section>
      <Faqs items={pricingFaqs} title="About pricing" eyebrow="FAQs" />
      <Cta />
    </>
  );
}
