import { services } from "@/content/services";
import { copy } from "@/content/copy";
import { pageMetadata } from "@/lib/seo";
import { Section, SectionHeading } from "@/components/ui/Section";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import { ServiceCard } from "@/components/cards/Cards";
import { Cta } from "@/components/sections/Cta";

export const metadata = pageMetadata({
  title: "Decoration Services Across Delhi NCR",
  description:
    "Balloon, birthday, anniversary, baby shower, room and event decoration across Delhi, Gurugram, Noida, Greater Noida and Faridabad.",
  path: "/decorations",
});

export default function DecorationsPage() {
  return (
    <>
      <Breadcrumbs items={[{ name: "Decorations", href: "/decorations" }]} />
      <Section as="div">
        <SectionHeading
          eyebrow={copy.services.indexEyebrow}
          title={copy.services.indexTitle}
          lead={copy.services.indexLead}
          level={1}
        />
        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {services.map((service) => (
            <ServiceCard key={service.slug} service={service} headingLevel={2} />
          ))}
        </div>
      </Section>
      <Cta />
    </>
  );
}
