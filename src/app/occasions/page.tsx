import { occasions } from "@/content/occasions";
import { copy } from "@/content/copy";
import { pageMetadata } from "@/lib/seo";
import { Section, SectionHeading } from "@/components/ui/Section";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import { OccasionCard } from "@/components/cards/Cards";
import { Cta } from "@/components/sections/Cta";

export const metadata = pageMetadata({
  title: "Party Decoration by Occasion in Delhi NCR",
  description:
    "First birthdays, kids' parties, milestones, anniversaries, baby showers, welcome-home-baby and proposals — decoration planned around what each occasion actually needs.",
  path: "/occasions",
});

export default function OccasionsPage() {
  return (
    <>
      <Breadcrumbs items={[{ name: "Occasions", href: "/occasions" }]} />
      <Section as="div">
        <SectionHeading
          eyebrow={copy.occasions.indexEyebrow}
          title={copy.occasions.indexTitle}
          lead={copy.occasions.indexLead}
          level={1}
        />
        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {occasions.map((occasion) => (
            <OccasionCard key={occasion.slug} occasion={occasion} headingLevel={2} />
          ))}
        </div>
      </Section>
      <Cta />
    </>
  );
}
