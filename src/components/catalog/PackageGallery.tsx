"use client";

import { useState } from "react";
import { copy } from "@/content/copy";
import { whatsappLink } from "@/content/site";
import type { DecorPackage } from "@/content/types";
import { cn } from "@/lib/utils";

/**
 * The gallery on a package page.
 *
 * Real photographs appear here once supplied. Until then the photo area stays
 * intentionally blank; the enquiry action remains available below it.
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
          <div
            aria-hidden="true"
            className="aspect-[4/3] w-full border border-line bg-muted sm:max-h-[30rem]"
          />
          <span className="flex items-center justify-between gap-3 bg-muted px-4 py-3 text-sm">
            <span className="text-ink-muted">Ask about this decoration</span>
            <span className="font-semibold text-accent">Enquire on WhatsApp →</span>
          </span>
        </a>
        <p className="mt-4 rounded-brand-lg border border-dashed border-line p-5 text-sm leading-relaxed text-ink-muted">
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
