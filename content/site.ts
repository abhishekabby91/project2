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
  /** How the WhatsApp number is written for a human. It is a different number
   *  from the phone line, so the site has to be able to show both. */
  whatsappDisplay: string;
  whatsappMessage: string;
  /**
   * Null until a real mailbox exists. Every mailto on the site disappears
   * while it is null, and the address is left out of structured data — a
   * plausible-looking address nobody reads is worse than no address at all,
   * and the privacy policy has to point somewhere a request actually arrives.
   */
  email: string | null;
  /** Operating hours, as written for a person. */
  hours: { days: string; hours: string }[];
  /**
   * The same hours in a form Google can parse, for openingHoursSpecification.
   * Kept beside the human version rather than parsed out of it — "Same-day
   * bookings / subject to availability" is a sentence, not a time range.
   */
  hoursSpec: { days: string[]; opens: string; closes: string }[];
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

  /* Given by the owner on 7 September 2026. Two different numbers on purpose:
     calls go to one line, WhatsApp to another. Neither is signed off in
     content/verification.ts yet — that is the owner's to do, not the
     builder's. */
  phone: "+91 87007 97243",
  phoneHref: "+918700797243",
  whatsapp: "919990597192",
  whatsappDisplay: "+91 99905 97192",
  whatsappMessage: "Hi! I'd like to book a decoration. My date is ",
  /* ⚠️  No mailbox yet. The owner is setting one up and will send the address.
     Leave this null until then — see the note on the interface above. */
  email: null,

  hours: [
    { days: "Monday – Sunday", hours: "9:00 AM – 9:00 PM" },
    { days: "Same-day bookings", hours: "Subject to slot availability" },
  ],

  /* ⚠️  Unconfirmed, like the hours above. Correct these with the owner. */
  hoursSpec: [
    {
      days: [
        "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday",
      ],
      opens: "09:00",
      closes: "21:00",
    },
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
    /* Darkened from #D6336C, which failed WCAG AA on the muted background —
       4.32 against the 4.5 needed — on eighteen pages, everywhere a section
       eyebrow sat on a muted band. Four points of lightness; the same pink to
       look at. Now 4.84 on muted and 5.17 on white, and it lifts the white
       button label from 4.62 to 5.17 as well. `npm run qa` holds this. */
    accent: "#CC2962",
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
