import { cities } from "@/content/cities";
import { copy } from "@/content/copy";
import { pageMetadata } from "@/lib/seo";
import { Section, SectionHeading } from "@/components/ui/Section";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import { CityCard } from "@/components/cards/Cards";
import { Cta } from "@/components/sections/Cta";

export const metadata = pageMetadata({
  title: "Where We Set Up Across Delhi NCR",
  description:
    "Balloon and party decoration across Delhi, Gurugram, Noida, Greater Noida and Faridabad — with the access rules, travel and timing that apply in each.",
  path: "/cities",
});

export default function CitiesPage() {
  return (
    <>
      <Breadcrumbs items={[{ name: "Areas", href: "/cities" }]} />
      <Section as="div">
        <SectionHeading
          eyebrow={copy.cities.indexEyebrow}
          title={copy.cities.indexTitle}
          lead={copy.cities.indexLead}
          level={1}
        />
        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {cities.map((city) => (
            <CityCard key={city.slug} city={city} headingLevel={2} />
          ))}
        </div>
      </Section>
      <Cta />
    </>
  );
}
