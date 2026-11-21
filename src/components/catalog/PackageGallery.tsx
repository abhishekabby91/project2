"use client";

import { useState } from "react";
import { copy } from "@/content/copy";
import { whatsappLink } from "@/content/site";
import type { DecorPackage } from "@/content/types";
import { PackagePreview } from "@/components/cards/Cards";
import { Icon } from "@/components/ui/Icon";
import { cn } from "@/lib/utils";

/**
 * The gallery on a package page.
 *
 * Built for the photographs that are not here yet: main image, thumbnail strip,
 * keyboard-operable, correct the moment `images` is populated. Until then it
 * shows the theme palettes at full size and says plainly that the photographs
 * are coming — which is what `content/packages.ts` asks for, and the reason
 * there is no stock imagery standing in.
 */
export function PackageGallery({ pkg }: { pkg: DecorPackage }) {
  const [index, setIndex] = useState(0);
  const images = pkg.images;

  if (!images.length) {
    return (
      <div className="mt-9">
        <a
          href={whatsappLink(pkg.name)}
          target="_blank"
          rel="noopener noreferrer"
          data-conversion="whatsapp_click"
          aria-label={"Ask about " + pkg.name + " on WhatsApp"}
          className="group block overflow-hidden rounded-brand-lg focus-visible:outline-2 focus-visible:outline-offset-2"
        >
          <PackagePreview
            pkg={pkg}
            bands={4}
            className="h-64 w-full overflow-hidden border border-line sm:h-80"
          />
          <span className="flex items-center justify-between gap-3 bg-muted px-4 py-3 text-sm">
            <span className="text-ink-muted">Ask about this decoration</span>
            <span className="font-semibold text-accent">Enquire on WhatsApp →</span>
          </span>
        </a>
        <p className="mt-4 flex items-start gap-2.5 rounded-brand-lg border border-dashed border-line bg-muted p-5 text-sm leading-relaxed text-ink-muted">
          <Icon name="camera" className="mt-0.5 h-4 w-4 shrink-0 text-ink-muted/60" />
          {copy.packages.noImagesNote}
        </p>
      </div>
    );
  }

  const active = images[Math.min(index, images.length - 1)];

  return (
    <div className="mt-9">
      <a
        href={whatsappLink(pkg.name)}
        target="_blank"
        rel="noopener noreferrer"
        data-conversion="whatsapp_click"
        aria-label={"Ask about " + pkg.name + " on WhatsApp"}
        className="group block overflow-hidden rounded-brand-lg focus-visible:outline-2 focus-visible:outline-offset-2"
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={active.src}
          alt={active.alt}
          className="aspect-[4/3] w-full border border-line object-cover transition-transform duration-300 group-hover:scale-[1.02]"
        />
        <span className="flex items-center justify-between gap-3 bg-muted px-4 py-3 text-sm">
          <span className="text-ink-muted">Interested in this decoration?</span>
          <span className="font-semibold text-accent">Enquire on WhatsApp →</span>
        </span>
      </a>
      {images.length > 1 ? (
        <ul className="mt-3 grid grid-cols-4 gap-3 sm:grid-cols-5">
          {images.map((image, i) => (
            <li key={image.src}>
              <button
                type="button"
                onClick={() => setIndex(i)}
                aria-current={i === index}
                className={cn(
                  "block w-full overflow-hidden rounded-brand border-2 transition-colors",
                  i === index ? "border-accent" : "border-transparent hover:border-line",
                )}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={image.src}
                  alt=""
                  className="aspect-[4/3] w-full object-cover"
                  loading="lazy"
                />
                <span className="sr-only">{image.alt}</span>
              </button>
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  );
}
