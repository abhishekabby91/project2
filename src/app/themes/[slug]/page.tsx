import { notFound } from "next/navigation";
import { themes, getTheme } from "@/content/themes";
import { packagesFor } from "@/content/packages";
import { copy } from "@/content/copy";
import { pageMetadata } from "@/lib/seo";
import { Section, SectionHeading } from "@/components/ui/Section";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import { PackageCard } from "@/components/cards/Cards";
import { Cta } from "@/components/sections/Cta";

export const dynamicParams = false;

export function generateStaticParams() {
  return themes.map((t) => ({ slug: t.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const theme = getTheme(slug);
  if (!theme) return {};
  return pageMetadata({
    title: theme.seo.title,
    description: theme.seo.description,
    path: `/themes/${theme.slug}`,
  });
}

export default async function ThemePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const theme = getTheme(slug);
  if (!theme) notFound();

  const related = packagesFor("themes", theme.slug);

  return (
    <>
      <Breadcrumbs
        items={[
          { name: "Themes", href: "/themes" },
          { name: theme.name, href: `/themes/${theme.slug}` },
        ]}
      />
      <Section as="div">
        <SectionHeading eyebrow="Theme" title={theme.name} lead={theme.summary} level={1} />

        <div className="mt-10 grid gap-8 lg:grid-cols-[1.2fr_1fr]">
          <div>
            <h2 className="text-sm font-semibold uppercase tracking-[0.12em] text-ink-muted">
              {copy.themes.paletteTitle}
            </h2>
            <ul className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
              {theme.palette.map((hex) => (
                <li key={hex} className="overflow-hidden rounded-brand border border-line">
                  <span aria-hidden="true" className="block h-24 w-full" style={{ backgroundColor: hex }} />
                  <span className="block bg-surface px-3 py-2 font-mono text-xs uppercase text-ink-muted">
                    {hex}
                  </span>
                </li>
              ))}
            </ul>
          </div>
          <aside className="rounded-brand-lg border border-line bg-muted p-7">
            <h2 className="text-lg">{copy.themes.suitedToTitle}</h2>
            <p className="mt-3 leading-relaxed text-ink-muted">{theme.suitedTo}</p>
          </aside>
        </div>
      </Section>

      {related.length ? (
        <Section tone="muted" ariaLabelledBy="theme-packages">
          <SectionHeading title={copy.themes.packagesTitle} id="theme-packages" />
          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {related.map((pkg) => (
              <PackageCard key={pkg.slug} pkg={pkg} headingLevel={3} />
            ))}
          </div>
        </Section>
      ) : null}

      <Cta context={`${theme.name} theme`} />
    </>
  );
}
