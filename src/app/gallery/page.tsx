import { packages } from "@/content/packages";
import { copy } from "@/content/copy";
import { pageMetadata } from "@/lib/seo";
import { Section, SectionHeading } from "@/components/ui/Section";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import { Cta } from "@/components/sections/Cta";

export const metadata = pageMetadata({
  title: "Gallery — Setups We Have Built",
  description:
    "Photographs of balloon and party decoration setups built by our own team across Delhi NCR.",
  path: "/gallery",
});

/**
 * Every image on this page comes from `packages[].images`, which is empty until
 * someone photographs real setups. That is why there is no image grid here yet
 * and no stock photography standing in for one — see the note at the top of
 * content/packages.ts.
 */
export default function GalleryPage() {
  const images = packages.flatMap((pkg) =>
    pkg.images.map((image) => ({ ...image, pkg: pkg.name })),
  );

  return (
    <>
      <Breadcrumbs items={[{ name: "Gallery", href: "/gallery" }]} />
      <Section as="div">
        <SectionHeading
          eyebrow={copy.gallery.eyebrow}
          title={copy.gallery.title}
          lead={copy.gallery.lead}
          level={1}
        />

        {images.length ? (
          <ul className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {images.map((image) => (
              <li key={image.src} className="overflow-hidden rounded-brand-lg border border-line">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={image.src} alt={image.alt} className="h-64 w-full object-cover" loading="lazy" />
                <p className="bg-surface px-4 py-3 text-sm text-ink-muted">{image.pkg}</p>
              </li>
            ))}
          </ul>
        ) : (
          <p className="mt-10 max-w-2xl rounded-brand-lg border border-dashed border-line bg-muted p-7 leading-relaxed text-ink-muted">
            {copy.gallery.empty}
          </p>
        )}
      </Section>
      <Cta />
    </>
  );
}
