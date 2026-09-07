import { notFound } from "next/navigation";
import { occasions, getOccasion } from "@/content/occasions";
import { packagesFor } from "@/content/packages";
import { copy } from "@/content/copy";
import { pageMetadata } from "@/lib/seo";
import { Section, SectionHeading } from "@/components/ui/Section";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import { PackageCard, CheckList } from "@/components/cards/Cards";
import { Cta } from "@/components/sections/Cta";

export const dynamicParams = false;

export function generateStaticParams() {
  return occasions.map((o) => ({ slug: o.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const occasion = getOccasion(slug);
  if (!occasion) return {};
  return pageMetadata({
    title: occasion.seo.title,
    description: occasion.seo.description,
    path: `/occasions/${occasion.slug}`,
  });
}

export default async function OccasionPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const occasion = getOccasion(slug);
  if (!occasion) notFound();

  const related = packagesFor("occasions", occasion.slug);

  return (
    <>
      <Breadcrumbs
        items={[
          { name: "Occasions", href: "/occasions" },
          { name: occasion.name, href: `/occasions/${occasion.slug}` },
        ]}
      />
      <Section as="div">
        <div className="grid gap-10 lg:grid-cols-[1.4fr_1fr] lg:gap-16">
          <div>
            <SectionHeading eyebrow="Occasion" title={occasion.name} lead={occasion.summary} level={1} />
            <p className="mt-6 max-w-2xl text-[1.0625rem] leading-relaxed text-ink">{occasion.intro}</p>
          </div>
          <aside className="rounded-brand-lg border border-line bg-muted p-7">
            <h2 className="text-lg">{copy.occasions.considerationsTitle(occasion.name)}</h2>
            <div className="mt-5">
              <CheckList items={occasion.considerations} />
            </div>
          </aside>
        </div>
      </Section>

      {related.length ? (
        <Section tone="muted" ariaLabelledBy="occ-packages">
          <SectionHeading title={copy.occasions.packagesTitle} id="occ-packages" />
          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {related.map((pkg) => (
              <PackageCard key={pkg.slug} pkg={pkg} headingLevel={3} />
            ))}
          </div>
        </Section>
      ) : null}

      <Cta context={occasion.name} />
    </>
  );
}
