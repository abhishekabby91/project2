import type { DecorPackage } from "./types";

/**
 * The catalog. This is the file that turns browsing into a booking, and it is
 * also the file with the most ways to cause real damage.
 *
 * ⚠️  PRICES ARE NOT YET THE BUSINESS'S OWN.
 *
 * Every price below is a market-derived starting point, set from what
 * comparable NCR decorators publish, so the site can be built and reviewed
 * before the owner has costed each package. They are not quotes. Publishing
 * them unchanged means advertising a price the business has not agreed to
 * honour, which is a consumer-protection problem long before it is an SEO one.
 *
 * Replace every `priceFrom` with a figure the owner has costed against
 * materials, travel and the team's time, then sign off `pricing` in
 * content/verification.ts. `npm run check:content` fails until you do.
 *
 * ⚠️  IMAGES ARE EMPTY ON PURPOSE. This is a visual product and stock photos of
 * someone else's work are the single fastest way to lose a customer at the
 * door. Add photographs of setups this team actually built, with alt text that
 * describes the setup. Until then the site renders a palette placeholder that
 * is obviously not a photograph.
 */
export const packages: DecorPackage[] = [
  {
    slug: "classic-balloon-arch",
    name: "Classic Balloon Arch",
    priceFrom: 2499,
    priceTo: null,
    setupTime: "2–3 hours",
    occasions: ["first-birthday", "kids-birthday", "milestone-birthday", "welcome-home-baby"],
    themes: ["unicorn-pastel", "jungle-safari", "superhero-comic", "dinosaur", "boho-neutral", "gold-black-elegant"],
    services: ["balloon-decoration", "birthday-decoration", "event-decoration"],
    cities: ["delhi", "gurugram", "noida", "greater-noida", "faridabad"],
    summary:
      "An organic balloon arch against one wall, in your colours, with lettering. The default birthday setup and the one most people mean when they call.",
    includes: [
      "Organic-style arch, roughly 6–8 feet across, built on a frame",
      "Balloons in your chosen palette, inflated on site",
      "Name or age lettering above or beside the arch",
      "Teardown and removal after the party",
    ],
    excludes: [
      "Cake, flowers and catering",
      "Helium-filled floating balloons (available as an add-on)",
      "Furniture or seating hire",
      "Any charge the venue itself levies for access",
    ],
    images: [],
    featured: true,
    seo: {
      title: "Classic Balloon Arch Decoration",
      description:
        "An organic balloon arch in your colours with name or age lettering, built on a frame and set up at home across Delhi NCR.",
    },
  },
  {
    slug: "kids-theme-room",
    name: "Themed Kids' Room Setup",
    priceFrom: 4999,
    priceTo: null,
    setupTime: "3–4 hours",
    occasions: ["kids-birthday", "first-birthday"],
    themes: ["unicorn-pastel", "jungle-safari", "space-galaxy", "princess-fairytale", "superhero-comic", "under-the-sea", "dinosaur"],
    services: ["birthday-decoration", "room-decoration", "balloon-decoration"],
    cities: ["delhi", "gurugram", "noida", "greater-noida", "faridabad"],
    summary:
      "A full themed room rather than a single wall — backdrop, ceiling work, table styling and props, carried across the whole space.",
    includes: [
      "Themed backdrop with drape or frame as the theme requires",
      "Ceiling balloon work above the main area",
      "Cake and gift table styled to match",
      "Theme props and cutouts, floor-level elements kept sturdy",
      "Teardown and removal",
    ],
    excludes: [
      "Cake, food and return gifts",
      "Entertainers, games and photography",
      "Character costumes or licensed merchandise",
      "Repainting or repair of walls the venue would not let us fix to",
    ],
    images: [],
    featured: true,
    seo: {
      title: "Themed Kids' Birthday Room Decoration",
      description:
        "A full themed room for a child's birthday — backdrop, ceiling work, table styling and props, set up across Delhi NCR.",
    },
  },
  {
    slug: "photo-corner-backdrop",
    name: "Photo Corner",
    priceFrom: 1799,
    priceTo: null,
    setupTime: "1–2 hours",
    occasions: ["first-birthday", "kids-birthday", "milestone-birthday", "baby-shower", "anniversary"],
    themes: ["unicorn-pastel", "princess-fairytale", "boho-neutral", "gold-black-elegant", "romantic-red-white"],
    services: ["balloon-decoration", "birthday-decoration", "room-decoration", "baby-shower-decoration", "anniversary-decoration"],
    cities: ["delhi", "gurugram", "noida", "greater-noida", "faridabad"],
    summary:
      "One corner built properly for photographs, when the rest of the room does not need decorating. The smallest thing we do, and often the right one.",
    includes: [
      "Backdrop frame with drape or panel, roughly 6 feet wide",
      "Balloon or floral detail at the frame edges",
      "Lettering or a small sign if you send the wording ahead",
      "Teardown and removal",
    ],
    excludes: [
      "Photographer and lighting equipment",
      "Cake and flowers beyond the frame detail",
      "Props for guests to hold",
      "Full-room decoration",
    ],
    images: [],
    seo: {
      title: "Photo Corner & Backdrop Setup",
      description:
        "A photo backdrop built properly for one corner — frame, drape, balloon or floral detail and lettering. Set up across Delhi NCR.",
    },
  },
  {
    slug: "ceiling-balloon-canopy",
    name: "Ceiling Balloon Canopy",
    priceFrom: 5999,
    priceTo: null,
    setupTime: "3–4 hours",
    occasions: ["milestone-birthday", "kids-birthday"],
    themes: ["gold-black-elegant", "space-galaxy", "jungle-safari", "under-the-sea"],
    services: ["balloon-decoration", "event-decoration"],
    cities: ["delhi", "gurugram", "noida", "greater-noida", "faridabad"],
    summary:
      "Balloons across the ceiling instead of the wall — for rooms where every wall is already occupied, and for venues that will not let you fix anything to them.",
    includes: [
      "Ceiling balloon coverage across the main area",
      "Hanging tails or lit elements as the theme suits",
      "Assessment of the ceiling and fixing method before setup",
      "Teardown and removal",
    ],
    excludes: [
      "Rooms with a ceiling above twelve feet or no fixing points",
      "Helium fills unless added separately",
      "Any electrical work beyond plugging in supplied lights",
      "Venue access charges",
    ],
    images: [],
    seo: {
      title: "Ceiling Balloon Canopy Decoration",
      description:
        "Ceiling balloon canopy setups across Delhi NCR — for rooms with no free wall and venues that allow nothing fixed to them.",
    },
  },
  {
    slug: "romantic-room-setup",
    name: "Romantic Room Surprise",
    priceFrom: 3499,
    priceTo: null,
    setupTime: "2–3 hours",
    occasions: ["anniversary", "surprise-proposal"],
    themes: ["romantic-red-white", "boho-neutral"],
    services: ["anniversary-decoration", "room-decoration"],
    cities: ["delhi", "gurugram", "noida", "greater-noida", "faridabad"],
    summary:
      "One room set for a surprise — lighting, balloon and floral work, bed or floor styling, finished and cleared before the door opens.",
    includes: [
      "Room styled end to end, planned around your reveal time",
      "LED lighting or candles, whichever the room can safely take",
      "Balloon and fresh-flower work",
      "Personalised lettering when you send the wording in advance",
      "Packaging cleared and the team gone before the reveal",
    ],
    excludes: [
      "Cake, food and gifts",
      "Hotel or venue permission, which you arrange with them",
      "Open flame where the property does not allow it",
      "Teardown, unless you ask — most people prefer to keep it overnight",
    ],
    images: [],
    featured: true,
    seo: {
      title: "Romantic Room Surprise Decoration",
      description:
        "Surprise room decoration for anniversaries and proposals across Delhi NCR — lighting, balloons, flowers and lettering, cleared before your reveal.",
    },
  },
  {
    slug: "terrace-candlelight",
    name: "Terrace Candlelight Setup",
    priceFrom: 6499,
    priceTo: null,
    setupTime: "3–4 hours",
    occasions: ["anniversary", "surprise-proposal"],
    themes: ["romantic-red-white", "boho-neutral"],
    services: ["anniversary-decoration"],
    cities: ["delhi", "gurugram", "noida", "faridabad"],
    summary:
      "An outdoor terrace set for two, with a weather fallback agreed before you book. The setup most affected by the season, and we will tell you when it is the wrong month.",
    includes: [
      "Terrace or balcony setup with seating arrangement",
      "Candle or lantern lighting with weighted, wind-resistant bases",
      "Drape, floral and pathway detail",
      "A pre-agreed indoor fallback if the weather turns",
      "Teardown the same night",
    ],
    excludes: [
      "Food, beverage and service staff",
      "Terraces without safe railing or a power point",
      "Any setup during high wind or rain — we move indoors instead",
      "Society permission for common-area terraces",
    ],
    images: [],
    seo: {
      title: "Terrace Candlelight Dinner Decoration",
      description:
        "Terrace and balcony candlelight setups for two across Delhi NCR — wind-weighted lighting, floral detail and an agreed weather fallback.",
    },
  },
  {
    slug: "baby-shower-setup",
    name: "Baby Shower Setup",
    priceFrom: 4499,
    priceTo: null,
    setupTime: "3–4 hours",
    occasions: ["baby-shower"],
    themes: ["boho-neutral", "unicorn-pastel", "princess-fairytale"],
    services: ["baby-shower-decoration"],
    cities: ["delhi", "gurugram", "noida", "greater-noida", "faridabad"],
    summary:
      "A shower or godh bharai setup built around the seating first — a supported chair inside the photograph, and a room that is still comfortable to sit in for three hours.",
    includes: [
      "Styled main seat with genuine back support",
      "Backdrop behind the seating, sized to the group photograph",
      "Table styling for gifts and refreshments",
      "Traditional or contemporary elements to the balance you choose",
      "Teardown and removal",
    ],
    excludes: [
      "Catering, sweets and return gifts",
      "Rituals, priest arrangements and traditional items you may want to source yourselves",
      "Heavy fragrance flowers, which we avoid by default",
      "Furniture hire beyond the styled main seat",
    ],
    images: [],
    seo: {
      title: "Baby Shower & Godh Bharai Decoration Setup",
      description:
        "Baby shower and godh bharai decoration across Delhi NCR — a supported styled seat, backdrop and table styling, planned for comfort first.",
    },
  },
  {
    slug: "welcome-home-baby",
    name: "Welcome Home Baby",
    priceFrom: 2999,
    priceTo: null,
    setupTime: "1–2 hours",
    occasions: ["welcome-home-baby"],
    themes: ["boho-neutral", "unicorn-pastel"],
    services: ["baby-shower-decoration", "balloon-decoration"],
    cities: ["delhi", "gurugram", "noida", "greater-noida", "faridabad"],
    summary:
      "Entrance and one room, set quietly and quickly for the day a newborn comes home. Low fragrance, nothing that sheds, and the team gone before the car arrives.",
    includes: [
      "Entrance or doorway welcome setup",
      "One room — usually the nursery or the main bedroom",
      "Name lettering when the name has been decided",
      "Fast, quiet installation timed to a hospital discharge",
      "A held slot if the discharge is delayed, at no extra charge",
    ],
    excludes: [
      "Whole-house decoration",
      "Strongly fragranced flowers, glitter and anything that sheds",
      "Cake and catering",
      "Photography",
    ],
    images: [],
    seo: {
      title: "Welcome Home Baby Decoration Setup",
      description:
        "Welcome-home-baby decoration across Delhi NCR — entrance and nursery, low fragrance and fast quiet installation timed to hospital discharge.",
    },
  },
];

export const getPackage = (slug: string) => packages.find((p) => p.slug === slug);

export const packagesFor = (key: "services" | "occasions" | "themes", slug: string) =>
  packages.filter((p) => p[key].includes(slug));

export const packagesInCity = (city: string) =>
  packages.filter((p) => p.cities.includes(city));

/** Lowest published starting price, for "from ₹X" copy. Never hardcode this. */
export const lowestPrice = () => Math.min(...packages.map((p) => p.priceFrom));

/* -------------------------------------------------------------------------- */
/*  Browsing                                                                  */
/* -------------------------------------------------------------------------- */

/**
 * Budget bands for the catalog filter.
 *
 * ⚠️  These thresholds are derived from the placeholder prices above and are a
 * commercial decision in their own right — they are how a visitor is invited to
 * segment the catalog, and they shape which setup a family on a fixed budget
 * ever sees. Re-cut them when the real prices land, then sign off `pricing` in
 * content/verification.ts.
 *
 * `max` is exclusive. `null` means no ceiling.
 */
export const budgetBands: { slug: string; label: string; min: number; max: number | null }[] = [
  { slug: "under-2500", label: "Under ₹2,500", min: 0, max: 2500 },
  { slug: "2500-5000", label: "₹2,500 – ₹5,000", min: 2500, max: 5000 },
  { slug: "over-5000", label: "₹5,000 and above", min: 5000, max: null },
];

export const getBudgetBand = (slug: string) => budgetBands.find((b) => b.slug === slug);

/** Highest published starting price, for "from ₹X to ₹Y" copy. */
export const highestPrice = () => Math.max(...packages.map((p) => p.priceFrom));
