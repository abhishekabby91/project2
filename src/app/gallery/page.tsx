import { galleryImages } from "@/content/packages";
import { whatsappLink } from "@/content/site";
import { copy } from "@/content/copy";
import { pageMetadata } from "@/lib/seo";
import { Section, SectionHeading } from "@/components/ui/Section";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import { Cta } from "@/components/sections/Cta";

const images = galleryImages();

/**
 * The title and description have to match what is on the page.
 *
 * While there are no photographs, promising them in a search result is a
 * click someone regrets, and a page whose heading, description and title all
 * describe images it does not have is thin by Google's own definition. So it
 * goes noindex and drops out of the sitemap — `src/app/sitemap.ts` reads the
 * same `galleryImages()` and the two must stay in step, the way the service ×
 * city gate does. Both come back the day a real photograph lands.
 */
export const metadata = pageMetadata({
  title: images.length ? "Gallery — Setups We Have Built" : "Gallery",
  description: images.length
    ? "Photographs of balloon and party decoration setups built by our own team across Delhi NCR."
    : "We are photographing recent setups. Ask on WhatsApp and we will send pictures from a booking like yours.",
  path: "/gallery",
  noIndex: images.length === 0,
});

/**
 * Every image on this page comes from `packages[].images`, which is empty until
 * someone photographs real setups. That is why there is no image grid here yet
 * and no stock photography standing in for one — see the note at the top of
 * content/packages.ts.
 */
export default function GalleryPage() {
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
                <a
                  href={whatsappLink(image.pkg)}
                  target="_blank"
                  rel="noopener noreferrer"
                  data-conversion="whatsapp_click"
                  aria-label={"Enquire on WhatsApp about " + image.pkg}
                  className="group block focus-visible:outline-2 focus-visible:outline-offset-2"
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={image.src} alt={image.alt} className="h-64 w-full object-cover transition-transform duration-300 group-hover:scale-[1.02]" loading="lazy" />
                  <span className="flex items-center justify-between gap-3 bg-surface px-4 py-3 text-sm">
                    <span className="text-ink-muted">{image.pkg}</span>
                    <span className="font-semibold text-accent">Ask on WhatsApp →</span>
                  </span>
                </a>
              </li>
            ))}
          </ul>
        ) : (
          <div className="mt-10 max-w-2xl rounded-brand-lg border border-dashed border-line bg-muted p-7">
            <p className="leading-relaxed text-ink-muted">{copy.gallery.empty}</p>
            <a
              href={whatsappLink("Please share decoration photos and package options")}
              target="_blank"
              rel="noopener noreferrer"
              data-conversion="whatsapp_click"
              className="mt-5 inline-flex min-h-11 items-center justify-center rounded-brand bg-accent px-5 py-3 text-sm font-semibold text-accent-fg"
            >
              Ask for decoration photos on WhatsApp
            </a>
          </div>
        )}
      </Section>
      <Cta />
    </>
  );
}
