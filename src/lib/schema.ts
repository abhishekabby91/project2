import { site, siteUrl } from "@/content/site";
import { aggregateRating, reviews } from "@/content/reviews";
import { cities } from "@/content/cities";
import type { City, DecorPackage, FaqItem, Service } from "@/content/types";

/**
 * Structured data builders.
 *
 * Every builder omits fields the content does not support rather than
 * inventing them. An aggregate rating with no reviews behind it, a price range
 * nobody agreed to, an opening-hours block for a business that has none — each
 * is a misrepresentation to Google and to the person reading the result, and
 * each is a manual-action risk. If the data is not there, the field is not
 * emitted.
 */

type Json = Record<string, unknown>;

const absolute = (path: string) => `${siteUrl}${path === "/" ? "" : path}`;

/** Address block, omitted entirely while the address is still a placeholder. */
function postalAddress(): Json | null {
  const a = site.address;
  if (/PLACEHOLDER/i.test(a.street) || /PLACEHOLDER/i.test(a.locality)) return null;
  return {
    "@type": "PostalAddress",
    streetAddress: a.street,
    addressLocality: a.locality,
    addressRegion: a.state,
    postalCode: a.postalCode,
    addressCountry: a.country,
  };
}

/** Telephone, omitted while it is still a placeholder run of zeroes. */
function telephone(): string | null {
  return /^\+?9?1?0{5,}$/.test(site.phoneHref.replace(/\s/g, "")) ? null : site.phoneHref;
}

export function organizationSchema(): Json {
  const address = postalAddress();
  const phone = telephone();
  const rating = aggregateRating();

  return {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "@id": `${siteUrl}/#organization`,
    name: site.businessName,
    description: site.description,
    url: siteUrl,
    ...(phone ? { telephone: phone } : {}),
    email: site.email,
    ...(address ? { address } : {}),
    ...(site.logo ? { logo: absolute(site.logo) } : {}),
    ...(site.social.length ? { sameAs: site.social.map((s) => s.href) } : {}),
    // Only claimed where cities.ts records a real service area.
    areaServed: areaServed(),
    ...(rating
      ? {
          aggregateRating: {
            "@type": "AggregateRating",
            ratingValue: rating.value,
            reviewCount: rating.count,
          },
        }
      : {}),
    ...(reviews.length
      ? {
          review: reviews.slice(0, 5).map((r) => ({
            "@type": "Review",
            reviewBody: r.quote,
            author: { "@type": "Person", name: r.author },
            ...(r.rating
              ? { reviewRating: { "@type": "Rating", ratingValue: r.rating } }
              : {}),
            ...(r.date ? { datePublished: r.date } : {}),
          })),
        }
      : {}),
  };
}

/** Every city the business genuinely serves, from content/cities.ts. */
function areaServed() {
  return cities.map((c) => ({
    "@type": "City",
    name: c.name,
    address: { "@type": "PostalAddress", addressRegion: c.state, addressCountry: "IN" },
  }));
}

export function websiteSchema(): Json {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${siteUrl}/#website`,
    url: siteUrl,
    name: site.businessName,
    description: site.description,
    inLanguage: "en-IN",
    publisher: { "@id": `${siteUrl}/#organization` },
  };
}

export function serviceSchema(service: Service, city?: City): Json {
  return {
    "@context": "https://schema.org",
    "@type": "Service",
    name: city ? `${service.name} in ${city.name}` : service.name,
    description: city ? city.seo.description : service.summary,
    serviceType: service.name,
    provider: { "@id": `${siteUrl}/#organization` },
    ...(city
      ? {
          areaServed: {
            "@type": "City",
            name: city.name,
            address: {
              "@type": "PostalAddress",
              addressRegion: city.state,
              addressCountry: "IN",
            },
          },
        }
      : { areaServed: areaServed() }),
  };
}

/**
 * A package is an Offer. `priceCurrency` and a numeric price are emitted
 * because the site publishes them — if a price is ever removed from the
 * catalog, the offer must go with it rather than becoming a bare Product.
 */
export function packageSchema(pkg: DecorPackage): Json {
  return {
    "@context": "https://schema.org",
    "@type": "Product",
    name: pkg.name,
    description: pkg.summary,
    ...(pkg.images.length
      ? { image: pkg.images.map((i) => absolute(i.src)) }
      : {}),
    brand: { "@type": "Brand", name: site.businessName },
    offers: {
      "@type": "Offer",
      priceCurrency: "INR",
      price: pkg.priceFrom,
      ...(pkg.priceTo ? { highPrice: pkg.priceTo, lowPrice: pkg.priceFrom } : {}),
      availability: "https://schema.org/InStock",
      url: absolute(`/packages/${pkg.slug}`),
      seller: { "@id": `${siteUrl}/#organization` },
    },
  };
}

export function faqSchema(items: FaqItem[]): Json | null {
  if (!items.length) return null;
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((f) => ({
      "@type": "Question",
      name: f.question,
      acceptedAnswer: { "@type": "Answer", text: f.answer },
    })),
  };
}

export function breadcrumbSchema(trail: { name: string; href: string }[]): Json {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: trail.map((crumb, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: crumb.name,
      item: absolute(crumb.href),
    })),
  };
}
