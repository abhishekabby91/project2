import type { IconName, ThemeConfig } from "./types";

/**
 * HappyArc — balloon and party decoration across Delhi NCR.
 *
 * ⚠️  The brand name is real. Phone, WhatsApp, email, address, the domain and
 * every trust figure below are still placeholders, and the content check will
 * refuse to pass while they remain. Replace them with verified details.
 */
export interface SiteConfig {
  businessName: string;
  shortName: string;
  tagline: string;
  description: string;
  url: string;
  logo: string | null;
  monogram: string;
  phone: string;
  phoneHref: string;
  /**
   * WhatsApp is the primary conversion path in this market — more enquiries
   * arrive there than through any form. E.164, no plus sign.
   */
  whatsapp: string;
  whatsappMessage: string;
  email: string;
  /** Operating hours. Same-day booking is a real differentiator here. */
  hours: { days: string; hours: string }[];
  /** Registered or operating address. Required for LocalBusiness schema. */
  address: {
    street: string;
    locality: string;
    city: string;
    state: string;
    postalCode: string;
    country: string;
  };
  currency: "INR";
  social: { platform: string; href: string }[];
  theme: ThemeConfig;
  nav: { label: string; href: string; children?: { label: string; href: string }[] }[];
  trustPoints: { icon: IconName; label: string }[];
}

export const site: SiteConfig = {
  businessName: "HappyArc",
  shortName: "HappyArc",
  tagline: "Balloon & Party Decoration",
  description:
    "Balloon and party decoration at home across Delhi NCR — birthdays, anniversaries, baby showers and welcome-home surprises. Setup by our own team.",
  url: "https://www.happyarc.in",

  logo: null,
  monogram: "HA",

  phone: "+91 00000 00000",
  phoneHref: "+910000000000",
  whatsapp: "910000000000",
  whatsappMessage: "Hi! I'd like to book a decoration. My date is ",
  email: "hello@happyarc.in",

  hours: [
    { days: "Monday – Sunday", hours: "9:00 AM – 9:00 PM" },
    { days: "Same-day bookings", hours: "Subject to slot availability" },
  ],

  address: {
    street: "PLACEHOLDER address line",
    locality: "PLACEHOLDER locality",
    city: "New Delhi",
    state: "Delhi",
    postalCode: "110001",
    country: "IN",
  },

  currency: "INR",

  social: [],

  /**
   * Celebration decor reads warm and saturated, unlike the restrained navy of a
   * professional-services site. Verify contrast after any change — `npm run qa`
   * enforces WCAG 2.2 AA.
   */
  theme: {
    primary: "#2B1B3D",
    primaryHover: "#3D2856",
    primaryForeground: "#FDF7FB",
    secondary: "#4A4453",
    accent: "#D6336C",
    accentHover: "#B02757",
    accentForeground: "#FFFFFF",
    background: "#FFFFFF",
    surface: "#FFFFFF",
    muted: "#FBF6F8",
    text: "#241C2B",
    textMuted: "#6B6272",
    border: "#EFE4EA",
    highlight: "#F0A202",
    radius: "0.875rem",
  },

  nav: [
    {
      label: "Decorations",
      href: "/decorations",
      children: [
        { label: "Balloon Decoration", href: "/balloon-decoration" },
        { label: "Birthday Decoration", href: "/birthday-decoration" },
        { label: "Anniversary Decoration", href: "/anniversary-decoration" },
        { label: "Baby Shower & Welcome Baby", href: "/baby-shower-decoration" },
        { label: "Room Decoration", href: "/room-decoration" },
        { label: "Event & Venue Decoration", href: "/event-decoration" },
      ],
    },
    /* The catalog is the page that turns a visit into a booking, and the one
       competitors put first. It belongs in the nav, not only in the footer. */
    { label: "Packages & Prices", href: "/packages" },
    { label: "Themes", href: "/themes" },
    { label: "Occasions", href: "/occasions" },
    { label: "Cities", href: "/cities" },
    { label: "Gallery", href: "/gallery" },
    { label: "Contact", href: "/contact" },
  ],

  /**
   * ⚠️  Every one of these is a public claim. Replace with facts the business
   * can substantiate, or delete. See content/verification.ts.
   */
  trustPoints: [
    { icon: "check", label: "PLACEHOLDER — setups completed" },
    { icon: "clock", label: "PLACEHOLDER — same-day availability" },
    { icon: "shield", label: "PLACEHOLDER — materials included" },
    { icon: "rupee", label: "PLACEHOLDER — transparent pricing" },
  ],
};

export const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL || site.url).replace(/\/$/, "");

/** Pre-filled WhatsApp link — the primary conversion path in this market. */
export const whatsappLink = (context?: string) =>
  `https://wa.me/${site.whatsapp}?text=${encodeURIComponent(
    site.whatsappMessage + (context ? ` (${context})` : ""),
  )}`;

/** ₹ formatting, Indian digit grouping. */
export const formatPrice = (rupees: number) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(rupees);
