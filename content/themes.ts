import type { Theme } from "./types";

/**
 * Themes are their own demand. People search "unicorn theme decoration" without
 * ever typing the word "birthday", so each theme gets a page.
 *
 * ⚠️  LICENSED CHARACTERS — read this before adding one.
 *
 * Competitors in this market publish pages for named cartoon and film
 * characters. Those names are registered trademarks, and using one to sell a
 * service is trademark use, not fan art. Some rights holders enforce against
 * exactly this. The themes below are deliberately descriptive instead, which
 * is why none of them names a character.
 *
 * If the business wants to sell a licensed-character setup anyway, that is a
 * commercial decision for the owner to take with their own legal advice — not
 * one to make by adding an entry here because a competitor did it.
 */
export const themes: Theme[] = [
  {
    slug: "unicorn-pastel",
    name: "Unicorn & Pastel",
    suitedTo: "Children aged three to eight, and adult parties that want soft colour",
    summary:
      "Lilac, mint and blush with an iridescent centre. The most-requested children's look, and the one that photographs most forgivingly in a dim room.",
    palette: ["#C9A7EB", "#A8E6CF", "#FFD3E0", "#FFF3B0"],
    packages: ["kids-theme-room", "classic-balloon-arch", "photo-corner-backdrop"],
    seo: {
      title: "Unicorn & Pastel Theme Decoration in Delhi NCR",
      description:
        "Unicorn and pastel theme decoration across Delhi NCR — lilac, mint and blush balloon arches and backdrops set up at home.",
    },
  },
  {
    slug: "jungle-safari",
    name: "Jungle Safari",
    suitedTo: "First and second birthdays, and any party with a lot of small children",
    summary:
      "Deep greens, leaf shapes and animal figures. Works particularly well as a full-room setup because the palette carries across a whole space instead of concentrating on one wall.",
    palette: ["#2F5D3A", "#7FA650", "#C7A16B", "#E8DCC0"],
    packages: ["kids-theme-room", "ceiling-balloon-canopy", "classic-balloon-arch"],
    seo: {
      title: "Jungle Safari Theme Decoration in Delhi NCR",
      description:
        "Jungle and safari theme birthday decoration across Delhi NCR — green foliage arches, animal figures and full-room setups at home.",
    },
  },
  {
    slug: "space-galaxy",
    name: "Space & Galaxy",
    suitedTo: "Children aged five to twelve, and evening parties",
    summary:
      "Navy and deep violet with metallic accents and lit elements. The only theme here that genuinely needs the lights down, which makes it a good fit for a party that starts after dark.",
    palette: ["#141B41", "#3B3B8F", "#8A7CFF", "#E5C05C"],
    packages: ["kids-theme-room", "ceiling-balloon-canopy"],
    seo: {
      title: "Space & Galaxy Theme Decoration in Delhi NCR",
      description:
        "Space and galaxy theme party decoration across Delhi NCR — navy and metallic balloon setups with lit elements, best suited to evening parties.",
    },
  },
  {
    slug: "princess-fairytale",
    name: "Princess & Fairytale",
    suitedTo: "Children aged three to nine",
    summary:
      "Pink, gold and white with drapes and a raised centre. The setup that most benefits from a proper backdrop frame rather than a wall, because the drape is half the effect.",
    palette: ["#F4B8C8", "#E8C86A", "#FFFFFF", "#B07AA1"],
    packages: ["kids-theme-room", "photo-corner-backdrop"],
    seo: {
      title: "Princess & Fairytale Theme Decoration in Delhi NCR",
      description:
        "Princess and fairytale theme decoration across Delhi NCR — pink and gold drapes, backdrop frames and balloon work set up at home.",
    },
  },
  {
    slug: "superhero-comic",
    name: "Superhero & Comic",
    suitedTo: "Children aged four to ten",
    summary:
      "Primary red, blue and yellow with bold graphic shapes. Built without any named character, using colour blocking and comic-panel geometry to carry the idea instead.",
    palette: ["#D62828", "#1D4E89", "#F7C331", "#1B1B1B"],
    packages: ["kids-theme-room", "classic-balloon-arch"],
    seo: {
      title: "Superhero Theme Party Decoration in Delhi NCR",
      description:
        "Superhero and comic theme birthday decoration across Delhi NCR — bold primary colour balloon setups and graphic backdrops at home.",
    },
  },
  {
    slug: "under-the-sea",
    name: "Under the Sea",
    suitedTo: "Children aged three to nine, and summer parties",
    summary:
      "Aqua, coral and sand with layered depth. Reads well in daylight, which makes it one of the better choices for a morning or afternoon party.",
    palette: ["#3AA6B9", "#FF8360", "#EAD7A1", "#1F6F78"],
    packages: ["kids-theme-room", "ceiling-balloon-canopy"],
    seo: {
      title: "Under the Sea Theme Decoration in Delhi NCR",
      description:
        "Under-the-sea and mermaid theme party decoration across Delhi NCR — aqua and coral balloon setups that photograph well in daylight.",
    },
  },
  {
    slug: "dinosaur",
    name: "Dinosaur",
    suitedTo: "Children aged three to eight",
    summary:
      "Olive, rust and stone with sculptural balloon shapes. The theme where the balloon work itself does the most, rather than printed elements.",
    palette: ["#6B7A3A", "#A8562C", "#8C8577", "#E4DCC6"],
    packages: ["kids-theme-room", "classic-balloon-arch"],
    seo: {
      title: "Dinosaur Theme Birthday Decoration in Delhi NCR",
      description:
        "Dinosaur theme birthday decoration across Delhi NCR — sculptural balloon work in olive, rust and stone, set up at home.",
    },
  },
  {
    slug: "romantic-red-white",
    name: "Romantic Red & White",
    suitedTo: "Anniversaries, proposals and surprise room setups",
    summary:
      "Red, white and warm light — the anniversary default, and the one people picture when they book a surprise. Kept restrained on purpose; a room does not need to be full to feel like something.",
    palette: ["#A4133C", "#FFFFFF", "#FFB3C1", "#E8C07D"],
    packages: ["romantic-room-setup", "terrace-candlelight"],
    seo: {
      title: "Romantic Red & White Decoration in Delhi NCR",
      description:
        "Romantic red and white room decoration across Delhi NCR — anniversary and proposal setups with warm lighting, installed before your reveal.",
    },
  },
  {
    slug: "boho-neutral",
    name: "Boho Neutral",
    suitedTo: "Baby showers, adult milestones and anyone tired of primary colours",
    summary:
      "Sand, terracotta, cream and dried florals. The theme most often chosen by people who wanted something that did not look like a party shop, and it photographs beautifully in natural light.",
    palette: ["#D9C3A9", "#B85C38", "#F3EDE4", "#8A7A62"],
    packages: ["baby-shower-setup", "photo-corner-backdrop", "classic-balloon-arch"],
    seo: {
      title: "Boho Neutral Theme Decoration in Delhi NCR",
      description:
        "Boho and neutral theme decoration across Delhi NCR — sand, terracotta and dried floral setups for baby showers and adult celebrations.",
    },
  },
  {
    slug: "gold-black-elegant",
    name: "Gold & Black",
    suitedTo: "Milestone birthdays, retirements and evening events",
    summary:
      "Black, gold and chrome with a single lit focal point. The most grown-up look here, and the one that works best in a venue rather than a living room.",
    palette: ["#111111", "#D4AF37", "#C0C0C0", "#F5F0E1"],
    packages: ["classic-balloon-arch", "ceiling-balloon-canopy", "photo-corner-backdrop"],
    seo: {
      title: "Gold & Black Theme Party Decoration in Delhi NCR",
      description:
        "Gold and black theme decoration across Delhi NCR — milestone birthdays and evening events, with a single lit focal point.",
    },
  },
];

export const getTheme = (slug: string) => themes.find((t) => t.slug === slug);
