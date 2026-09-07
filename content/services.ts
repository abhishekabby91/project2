import type { Service } from "./types";

/**
 * What HappyArc actually does. One entry per service; each becomes a hub page
 * and, crossed with cities.ts, the service-in-city pages that carry most of the
 * search demand in this market.
 *
 * ⚠️  Only list work the team can deliver. Removing a service is one line here;
 * turning up to a booking you cannot fulfil is not recoverable. `cities` is the
 * subset of city slugs where this service is genuinely offered — leave it empty
 * to mean "everywhere we operate".
 */
export const services: Service[] = [
  {
    slug: "balloon-decoration",
    name: "Balloon Decoration",
    shortName: "Balloon decoration",
    icon: "balloon",
    summary:
      "Arches, garlands, ceiling clusters and photo backdrops, built at your place and taken down after.",
    intro:
      "Balloon work is the whole job here rather than a garnish on top of one. An arch that is built properly holds its shape for the evening because the balloons are sized in a sequence and tied to a frame, not taped to a wall and hoped for. We inflate on site, which is why a setup takes a couple of hours rather than twenty minutes, and it is also why the arch is still standing when the cake comes out.",
    includes: [
      "Balloons, frames, adhesive and weights — nothing to buy separately",
      "On-site inflation, so nothing arrives half-deflated",
      "A team member who stays until the setup is finished and photographed",
      "Teardown and removal, either the same night or the next morning",
    ],
    packages: ["classic-balloon-arch", "ceiling-balloon-canopy", "photo-corner-backdrop"],
    cities: [],
    seo: {
      title: "Balloon Decoration at Home in Delhi NCR",
      description:
        "Balloon arches, ceiling clusters and photo backdrops set up at your home across Delhi, Gurugram, Noida, Greater Noida and Faridabad. Materials and teardown included.",
    },
  },
  {
    slug: "birthday-decoration",
    name: "Birthday Decoration",
    shortName: "Birthday decoration",
    icon: "cake",
    summary:
      "First birthdays through milestone ones — themed setups sized to the room you actually have.",
    intro:
      "A birthday setup lives or dies on two things: whether the theme reads clearly in a photograph, and whether the room still has space for people. Most of what goes wrong is scale. A living room in a three-bedroom flat cannot hold what a banquet hall can, so we plan around the wall you will actually use, keep the walkway clear, and put the density where the camera will point.",
    includes: [
      "A themed backdrop sized to your room, not a standard kit",
      "Name or age lettering as part of the setup",
      "Table and cake-area styling around the main backdrop",
      "Coordination with your cake and photographer timings",
    ],
    packages: ["classic-balloon-arch", "kids-theme-room", "photo-corner-backdrop"],
    cities: [],
    seo: {
      title: "Birthday Decoration at Home in Delhi NCR",
      description:
        "Birthday decoration at home across Delhi NCR — first birthdays, kids' themes and milestone celebrations, planned to the size of your room and set up by our own team.",
    },
  },
  {
    slug: "anniversary-decoration",
    name: "Anniversary Decoration",
    shortName: "Anniversary decoration",
    icon: "heart",
    summary:
      "Romantic room, terrace and candlelight setups — usually a surprise, so timing matters more than scale.",
    intro:
      "Almost every anniversary booking is a surprise, which changes the job. The constraint is not the decoration, it is the window: someone has to be out of the house, and the setup has to be finished and cleared of packaging before they walk back in. We plan backwards from the moment you want them to open the door, and we would rather propose a smaller setup we can finish in the time than a bigger one we cannot.",
    includes: [
      "A setup planned around your reveal time, not ours",
      "Candles or LED lighting appropriate to the room",
      "Flower work where the room and the season allow it",
      "Discreet arrival and packaging cleared before we leave",
    ],
    packages: ["romantic-room-setup", "terrace-candlelight", "photo-corner-backdrop"],
    cities: [],
    seo: {
      title: "Anniversary Decoration at Home in Delhi NCR",
      description:
        "Romantic anniversary decoration at home in Delhi, Gurugram, Noida and Faridabad — room, terrace and candlelight setups planned around your surprise reveal.",
    },
  },
  {
    slug: "baby-shower-decoration",
    name: "Baby Shower & Welcome Baby",
    shortName: "Baby shower decoration",
    icon: "sparkle",
    summary:
      "Godh bharai, baby showers and welcome-home setups, with the seating and comfort planned first.",
    intro:
      "This is the one occasion where the decoration comes second. Someone at the centre of it is either heavily pregnant or has just come home from hospital, so the seating, the route from the door, and how much of the room is left to move in matter more than the backdrop does. We plan the chair first and build around it. Welcome-home setups in particular are kept low-fuss and low-fragrance for the same reason.",
    includes: [
      "Seating and walkway planned before the backdrop",
      "A styled main chair or seat for the mother-to-be",
      "Low-fragrance materials for welcome-home setups",
      "Quiet, quick installation when there is a newborn in the house",
    ],
    packages: ["baby-shower-setup", "welcome-home-baby", "photo-corner-backdrop"],
    cities: [],
    seo: {
      title: "Baby Shower & Welcome Home Decoration in Delhi NCR",
      description:
        "Baby shower, godh bharai and welcome-home-baby decoration across Delhi NCR. Seating and comfort planned first, set up quietly by our own team.",
    },
  },
  {
    slug: "room-decoration",
    name: "Room Decoration",
    shortName: "Room decoration",
    icon: "gift",
    summary:
      "Surprise room setups for proposals, homecomings and the celebrations that do not have a name.",
    intro:
      "Not every reason to decorate a room has an occasion attached to it. A proposal, a job someone finally got, a partner coming back after months away, a hard year ending. These are smaller setups by design — one wall, some lighting, something on the bed or the floor — and they are almost always time-critical surprises. Tell us what happened and when the door opens; we will build to that.",
    includes: [
      "One room styled end to end rather than a single wall",
      "Lighting, drapes and floor or bed work as the room suits",
      "Personalised lettering when you send the wording ahead",
      "Setup timed to a specific reveal, with the team gone before it",
    ],
    packages: ["romantic-room-setup", "photo-corner-backdrop", "kids-theme-room"],
    cities: [],
    seo: {
      title: "Surprise Room Decoration at Home in Delhi NCR",
      description:
        "Surprise room decoration across Delhi NCR — proposals, homecomings and personal celebrations, set up and cleared before your reveal.",
    },
  },
  {
    slug: "event-decoration",
    name: "Event & Venue Decoration",
    shortName: "Event decoration",
    icon: "users",
    summary:
      "Society clubhouses, banquet rooms and office celebrations — larger setups with a site visit first.",
    intro:
      "Anything beyond a home needs a look at the space before we quote. Clubhouses and banquet rooms have rules about what can touch a wall, when you can get in, and when you must be out; offices add a security process on top. We do a site visit or ask for photographs and the venue's rule sheet, then quote against the space as it is. It is slower to book and considerably less likely to go wrong on the day.",
    includes: [
      "A site visit or photo assessment before quoting",
      "Setup planned to the venue's access and teardown windows",
      "Compliance with venue rules on adhesives, confetti and open flame",
      "A larger team for same-day install and removal",
    ],
    packages: ["ceiling-balloon-canopy", "classic-balloon-arch"],
    cities: [],
    seo: {
      title: "Event & Venue Decoration in Delhi NCR",
      description:
        "Clubhouse, banquet and office event decoration across Delhi NCR. Site visit first, setup planned to the venue's own access and teardown rules.",
    },
  },
];

export const getService = (slug: string) => services.find((s) => s.slug === slug);

/** Cities where a given service is offered. Empty `cities` means all of them. */
export const serviceCities = (service: Service, all: string[]) =>
  service.cities.length ? service.cities : all;
