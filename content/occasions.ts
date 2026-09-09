import type { Occasion } from "./types";

/**
 * Why someone is booking. Occasions overlap with services deliberately — a
 * birthday is both a thing we do and a reason people search — but the pages
 * answer different questions. A service page explains the work; an occasion
 * page explains what tends to go wrong at that particular kind of party.
 */
export const occasions: Occasion[] = [
  {
    slug: "first-birthday",
    name: "First Birthday",
    icon: "cake",
    summary: "A one-year-old's party, planned around a nap schedule and a lot of photographs.",
    intro:
      "First birthdays are photographed more heavily than any other party we set up, and the birthday child is asleep for part of the day. Both facts shape the plan: the backdrop goes where the light is best rather than where the biggest wall is, and the setup finishes well before the guests arrive so nothing is being taped up while a baby is trying to sleep in the next room.",
    considerations: [
      "Latex balloons at floor level are a choking risk with crawling children — we keep the low band solid or foil.",
      "Setups finish at least an hour before guests to leave a quiet window.",
      "The cake-smash corner needs a wipeable floor covering, which we bring.",
      "Grandparents need somewhere to sit inside the photo, not behind it.",
    ],
    packages: ["classic-balloon-arch", "kids-theme-room", "photo-corner-backdrop"],
    seo: {
      h1: "First Birthday Decoration at Home",
      title: "First Birthday Decoration at Home in Delhi NCR",
      description:
        "First birthday decoration across Delhi NCR — cake-smash corners, photo backdrops and child-safe setups, finished before your guests arrive.",
    },
  },
  {
    slug: "kids-birthday",
    name: "Kids' Birthday",
    icon: "balloon",
    summary: "Themed parties for two to twelve year olds, sized to the room and built to be played near.",
    intro:
      "Children touch the decoration. This is not a problem to be managed, it is the point — but it means the setup has to survive being leaned on, and nothing fragile can sit at knee height. We build the themed wall as the fixed centre, keep the middle of the room clear for whatever game is planned, and use foil and weighted bases anywhere a child can reach.",
    considerations: [
      "Nothing fragile below waist height, and no free-standing frames in a play area.",
      "The theme has to read from the far side of the room to work in photographs.",
      "Clear floor space matters more than filling every wall.",
      "Tell us the guest count — twenty children need a different plan from six.",
    ],
    packages: ["kids-theme-room", "classic-balloon-arch", "photo-corner-backdrop"],
    seo: {
      h1: "Kids\u2019 Birthday Decoration at Home",
      title: "Kids' Birthday Decoration at Home in Delhi NCR",
      description:
        "Themed kids' birthday decoration across Delhi, Gurugram, Noida and Faridabad — built sturdy, sized to your room, set up by our own team.",
    },
  },
  {
    slug: "milestone-birthday",
    name: "Milestone Birthday",
    icon: "star",
    summary: "Eighteenth, twenty-fifth, fiftieth — grown-up setups that photograph well and stay out of the way.",
    intro:
      "Adult milestone parties want a strong photo corner and very little else in the way. The failure mode is the opposite of a children's party: too much decoration makes a room full of adults feel like a school event. We concentrate the work into one wall that photographs well, add lighting and number lettering, and leave the rest of the room to the people in it.",
    considerations: [
      "One strong wall beats decoration spread thin across four.",
      "Lighting does more for an evening party than additional balloons.",
      "Number lettering should be sized for a group photo, not a close-up.",
      "Confirm whether the venue allows anything adhesive on the walls.",
    ],
    packages: ["classic-balloon-arch", "photo-corner-backdrop", "ceiling-balloon-canopy"],
    seo: {
      h1: "Milestone Birthday Decoration",
      title: "Milestone Birthday Decoration in Delhi NCR",
      description:
        "18th, 25th, 50th and other milestone birthday decoration across Delhi NCR — a photo wall, lighting and lettering, without filling the room.",
    },
  },
  {
    slug: "anniversary",
    name: "Anniversary",
    icon: "heart",
    summary: "Surprise room and terrace setups, planned backwards from the moment the door opens.",
    intro:
      "An anniversary setup is a timing problem wearing a decoration costume. Someone has to be out, the work has to finish, the packaging has to be gone, and the team has to be out of the building before the reveal. We ask for the reveal time first and everything else follows from it. If the window is too tight for what you have in mind, we will say so at the booking rather than on the day.",
    considerations: [
      "We need a realistic window — how long will they genuinely be out?",
      "Candles need a surface that can take them and a room that can be watched.",
      "Terrace setups depend on wind; we bring weighted bases and a fallback.",
      "Someone has to let the team in. Usually a neighbour or a house help.",
    ],
    packages: ["romantic-room-setup", "terrace-candlelight"],
    seo: {
      h1: "Anniversary Decoration at Home",
      title: "Anniversary Surprise Decoration in Delhi NCR",
      description:
        "Surprise anniversary decoration at home across Delhi NCR — room, terrace and candlelight setups timed to your reveal and cleared before it.",
    },
  },
  {
    slug: "baby-shower",
    name: "Baby Shower & Godh Bharai",
    icon: "sparkle",
    summary: "Traditional and contemporary showers, with the mother-to-be's comfort planned first.",
    intro:
      "Godh bharai and baby showers run long and involve a lot of sitting, so the seating plan comes before the backdrop. The mother-to-be needs a chair with back support that sits inside the photograph rather than in front of it, a clear route to the bathroom, and a room that has not been made hot by additional lighting. Everything else is arranged around those three things.",
    considerations: [
      "A supported chair in the frame, not a decorative stool.",
      "Keep the route to the bathroom clear at all times.",
      "Strong fragrances are common triggers — we keep flowers light or skip them.",
      "Traditional and contemporary elements can share a setup; tell us the balance you want.",
    ],
    packages: ["baby-shower-setup", "photo-corner-backdrop"],
    seo: {
      h1: "Baby Shower & Godh Bharai Decoration",
      title: "Baby Shower & Godh Bharai Decoration in Delhi NCR",
      description:
        "Baby shower and godh bharai decoration across Delhi NCR — seating and comfort planned first, traditional or contemporary styling as you prefer.",
    },
  },
  {
    slug: "welcome-home-baby",
    name: "Welcome Home Baby",
    icon: "gift",
    summary: "A quiet, quick setup for the day a newborn comes home from hospital.",
    intro:
      "This is the shortest-notice booking we take and the one where restraint matters most. A newborn and a recovering mother are arriving into the house, sometimes at an hour nobody could predict. We keep the setup to the entrance and one room, use nothing with a strong smell, install fast, and are gone before the car arrives. If the discharge is delayed, we hold the slot rather than charge for it.",
    considerations: [
      "Hospital discharge times move. We plan for that instead of against it.",
      "No strong fragrance, no glitter, nothing that sheds near a newborn.",
      "The entrance and one room is usually the right scope, not the whole house.",
      "The team installs quietly and leaves — no lingering for photographs.",
    ],
    packages: ["welcome-home-baby", "classic-balloon-arch"],
    seo: {
      h1: "Welcome Home Baby Decoration",
      title: "Welcome Home Baby Decoration in Delhi NCR",
      description:
        "Welcome-home-baby decoration across Delhi NCR — quiet, fast, low-fragrance setups at the entrance and nursery, timed to a hospital discharge.",
    },
  },
  {
    slug: "surprise-proposal",
    name: "Surprise & Proposal",
    icon: "heart",
    summary: "Proposals and personal surprises where the timing is the entire job.",
    intro:
      "A proposal setup has one chance and no rehearsal. We treat it as an operation rather than a decoration: a fixed reveal time, a named person who lets us in, a phone number we can reach on the day, and a plan for what happens if they arrive early. The decoration itself is usually simpler than people expect. What makes it work is that nothing is still being assembled when the door opens.",
    considerations: [
      "Give us a contact who is not the person being surprised.",
      "Terrace and outdoor proposals need a weather fallback agreed in advance.",
      "Hotel and restaurant venues need their own permission; we will ask for it.",
      "Simpler and finished beats elaborate and half-built. Every time.",
    ],
    packages: ["romantic-room-setup", "terrace-candlelight"],
    seo: {
      h1: "Surprise & Proposal Decoration",
      title: "Proposal & Surprise Decoration in Delhi NCR",
      description:
        "Proposal and surprise decoration across Delhi NCR — room and terrace setups planned to a fixed reveal, with a weather fallback and a backup plan.",
    },
  },
];

export const getOccasion = (slug: string) => occasions.find((o) => o.slug === slug);
