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

const slugify = (value: string) => value.toLowerCase().replace(/[^a-z0-9]+/g, "-");

export default function CitiesPage() {
  /* Insertion order preserved, so the owner's ordering in cities.ts still
     decides which state comes first. */
  const byState = [...new Map(
    cities.map((city) => [city.state, cities.filter((c) => c.state === city.state)]),
  )];

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
        {/* Grouped by state rather than listed flat. Delhi NCR is one travel
            region but three administrative ones, and "do you come to Haryana"
            is a question people genuinely ask — the grouping answers it
            without inventing a thin page per state to answer it with. */}
        <div className="mt-12 space-y-12">
          {byState.map(([state, group]) => (
            <section key={state} aria-labelledby={`state-${slugify(state)}`}>
              <h2
                id={`state-${slugify(state)}`}
                className="text-sm font-semibold uppercase tracking-[0.12em] text-ink-muted"
              >
                {copy.cities.stateGroupLabel(state, group.length)}
              </h2>
              <div className="mt-5 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {group.map((city) => (
                  <CityCard key={city.slug} city={city} headingLevel={3} />
                ))}
              </div>
            </section>
          ))}
        </div>
      </Section>
      <Cta />
    </>
  );
}
