import type { Metadata } from "next";
import { site, siteUrl } from "@/content/site";
import { indexingAllowed } from "./indexing";

interface PageMetaOptions {
  title: string;
  description: string;
  /** Path with a leading slash, e.g. "/balloon-decoration/noida". */
  path: string;
  /** Absolute or root-relative OG image. Falls back to the generated default. */
  image?: string;
  /** Set true on pages that should not be indexed (thank-you pages, etc.). */
  noIndex?: boolean;
  type?: "website" | "article";
  publishedTime?: string;
  authors?: string[];
}

/**
 * Builds a complete Metadata object: canonical URL, Open Graph, Twitter card,
 * and robots directives. Every page in the template goes through this helper so
 * nothing ships with a missing canonical or a duplicated title.
 */
export function pageMetadata({
  title,
  description,
  path,
  image = "/opengraph-image",
  noIndex = false,
  type = "website",
  publishedTime,
  authors,
}: PageMetaOptions): Metadata {
  const url = `${siteUrl}${path === "/" ? "" : path}`;
  const fullTitle = path === "/" ? title : `${title} | ${site.businessName}`;

  return {
    // `absolute` bypasses the root layout's title template. Without it the
    // firm name is appended twice on every page below the root segment: once
    // here, once by the template.
    title: { absolute: fullTitle },
    description,
    alternates: { canonical: url },
    // A page may opt out; an unsigned-off deployment opts every page out.
    robots: noIndex || !indexingAllowed()
      ? { index: false, follow: false }
      : {
          index: true,
          follow: true,
          googleBot: {
            index: true,
            follow: true,
            "max-image-preview": "large",
            "max-snippet": -1,
            "max-video-preview": -1,
          },
        },
    openGraph: {
      type,
      url,
      siteName: site.businessName,
      title: fullTitle,
      description,
      locale: "en_IN",
      images: [{ url: image, width: 1200, height: 630, alt: site.businessName }],
      ...(publishedTime ? { publishedTime } : {}),
      ...(authors ? { authors } : {}),
    },
    twitter: {
      card: "summary_large_image",
      title: fullTitle,
      description,
      images: [image],
    },
  };
}
