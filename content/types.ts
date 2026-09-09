/**
 * Content model for a Delhi NCR balloon and event decoration business.
 *
 * The shape is driven by how this market actually searches and buys, which is
 * different from a professional-services site:
 *
 *   • People search "balloon decoration in noida", not "decoration services".
 *     Service × city is the money page, so it is a first-class route.
 *   • They compare on price before anything else — every competitor leads with
 *     "from ₹999" in the title tag. Packages carry real prices.
 *   • Themes (Cocomelon, unicorn, Spiderman) are their own demand, searched
 *     independently of occasion.
 *   • The product is visual. Photography is the offer, not decoration.
 *   • Conversion is WhatsApp and phone first. Forms are the fallback here, not
 *     the primary path.
 */

export interface ThemeConfig {
  primary: string;
  primaryHover: string;
  primaryForeground: string;
  secondary: string;
  accent: string;
  accentHover: string;
  accentForeground: string;
  background: string;
  surface: string;
  muted: string;
  text: string;
  textMuted: string;
  border: string;
  highlight: string;
  radius: string;
}

export type IconName =
  | "balloon" | "cake" | "heart" | "gift" | "sparkle" | "camera" | "star"
  | "phone" | "whatsapp" | "mail" | "pin" | "clock" | "check" | "shield"
  | "truck" | "rupee" | "calendar" | "users";

/* -------------------------------------------------------------------------- */
/*  Geography — the core of local SEO in this market                          */
/* -------------------------------------------------------------------------- */

export interface Locality {
  /** URL segment, e.g. "sector-50". */
  slug: string;
  name: string;
  /**
   * Only list localities the team genuinely covers. Competitors publish
   * sector-level pages (Haplun has one for Beta 1/2 Greater Noida) — that only
   * works when someone will actually travel there.
   */
  landmarks?: string[];
}

export interface City {
  slug: string;
  name: string;
  /** How locals write it: "Gurugram" vs "Gurgaon". Both matter for search. */
  aliases: string[];
  state: string;
  /**
   * Localities served, for genuinely local page content. This is what stops a
   * city page being a find-and-replace of another city's page.
   */
  localities: Locality[];
  /** Travel or setup charge specific to this city, if any. Null when included. */
  travelNote: string | null;
  /** Real, verifiable facts about operating here. Not marketing filler. */
  localNotes: string[];
  seo: { title: string; description: string };
}

/* -------------------------------------------------------------------------- */
/*  Taxonomies                                                                */
/* -------------------------------------------------------------------------- */

/** A service is what the team does: balloon decoration, room decoration… */
export interface Service {
  slug: string;
  name: string;
  /** Used in "{name} in {city}" page titles. */
  shortName: string;
  icon: IconName;
  summary: string;
  /** Long-form intro for the service hub page. */
  intro: string;
  includes: string[];
  /** Package slugs commonly booked for this service. */
  packages: string[];
  /** Cities where this service is offered. Empty means all. */
  cities: string[];
  seo: { title: string; description: string };
}

/** An occasion is why they're booking: birthday, anniversary, baby shower… */
export interface Occasion {
  slug: string;
  name: string;
  icon: IconName;
  summary: string;
  intro: string;
  /** What tends to matter for this occasion specifically. */
  considerations: string[];
  packages: string[];
  /**
   * `h1` is the on-page heading when it should differ from `name`. The name is
   * the label in a card and a nav ("First Birthday"); the heading is what the
   * page is about and what someone searched for ("First Birthday Decoration at
   * Home"). Written per entry rather than generated, so none of them reads as
   * a template. Falls back to `name`.
   */
  seo: { title: string; description: string; h1?: string };
}

/** A theme is the look: Cocomelon, unicorn, jungle, Spiderman… */
export interface Theme {
  slug: string;
  name: string;
  /** Who it's usually for — helps the copy stay specific. */
  suitedTo: string;
  summary: string;
  /** Palette shown on the theme page. Hex values. */
  palette: string[];
  packages: string[];
  seo: { title: string; description: string; h1?: string };
}

/* -------------------------------------------------------------------------- */
/*  The catalog — what is actually sold                                       */
/* -------------------------------------------------------------------------- */

export interface PackageImage {
  /** Path in /public. Real photographs of real setups only. */
  src: string;
  /** Describe the setup, not "balloon decoration". Screen readers and SEO. */
  alt: string;
}

export interface DecorPackage {
  slug: string;
  name: string;
  /**
   * Price in whole rupees. Every competitor leads with price in the SERP, so
   * this is not optional — but it must be a price the team will honour.
   */
  priceFrom: number;
  /** Set when the package genuinely has a ceiling; null for "from" pricing. */
  priceTo: number | null;
  /** e.g. "2–3 hours". Honest setup time; people plan around it. */
  setupTime: string;
  occasions: string[];
  themes: string[];
  services: string[];
  /** Cities this package can be delivered in. */
  cities: string[];
  summary: string;
  /** Exactly what the customer receives. Under-promise here. */
  includes: string[];
  /** What is explicitly not included — prevents the most common dispute. */
  excludes: string[];
  images: PackageImage[];
  featured?: boolean;
  seo: { title: string; description: string };
}

/* -------------------------------------------------------------------------- */
/*  Trust and support                                                         */
/* -------------------------------------------------------------------------- */

export interface FaqItem {
  question: string;
  answer: string;
  category?: string;
}

export interface Review {
  /** The customer's own words. Never write these for them. */
  quote: string;
  author: string;
  city?: string;
  occasion?: string;
  /** 1–5. Omit rather than assume. */
  rating?: number;
  date?: string;
}

export interface ProcessStep {
  number: string;
  title: string;
  description: string;
  icon: IconName;
}
