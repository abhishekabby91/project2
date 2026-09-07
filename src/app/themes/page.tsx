import { themes } from "@/content/themes";
import { copy } from "@/content/copy";
import { pageMetadata } from "@/lib/seo";
import { Section, SectionHeading } from "@/components/ui/Section";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import { ThemeCard } from "@/components/cards/Cards";
import { Cta } from "@/components/sections/Cta";

export const metadata = pageMetadata({
  title: "Decoration Themes in Delhi NCR",
  description:
    "Ten decoration themes with the palette we actually build to — unicorn, jungle safari, space, princess, superhero, under the sea, dinosaur, boho and more.",
  path: "/themes",
});

export default function ThemesPage() {
  return (
    <>
      <Breadcrumbs items={[{ name: "Themes", href: "/themes" }]} />
      <Section as="div">
        <SectionHeading
          eyebrow={copy.themes.indexEyebrow}
          title={copy.themes.indexTitle}
          lead={copy.themes.indexLead}
          level={1}
        />
        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {themes.map((theme) => (
            <ThemeCard key={theme.slug} theme={theme} headingLevel={2} />
          ))}
        </div>
      </Section>
      <Cta />
    </>
  );
}
