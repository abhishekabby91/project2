import type { City } from "./types";

/**
 * The five Delhi NCR cities HappyArc operates in.
 *
 * ⚠️  READ BEFORE EDITING
 *
 * The locality lists below are real places — sectors, blocks and landmarks that
 * exist. That much is a public fact. What is *not* yet a fact is that HappyArc
 * will travel to each of them. Coverage is a promise made to someone planning
 * their child's birthday, and a missed setup is not recoverable.
 *
 * So: confirm each list with whoever dispatches the team, delete what they
 * won't reach, and sign off `locations` in content/verification.ts. Until then
 * `npm run check:content` fails, which is the correct state.
 *
 * Adding a city means adding real localities and real `localNotes` too. A city
 * page that is another city's page with the name swapped is a doorway page —
 * Google has demoted them since 2015, and `scripts/check-content.mjs` refuses
 * to let two cities share their notes.
 */
export const cities: City[] = [
  {
    slug: "delhi",
    name: "Delhi",
    aliases: ["New Delhi", "NCT of Delhi"],
    state: "Delhi",
    localities: [
      { slug: "dwarka", name: "Dwarka", landmarks: ["Sector 6 Market", "Dwarka Sector 21 Metro"] },
      { slug: "rohini", name: "Rohini", landmarks: ["Rithala Metro", "Unity One Mall"] },
      { slug: "pitampura", name: "Pitampura", landmarks: ["Netaji Subhash Place"] },
      { slug: "janakpuri", name: "Janakpuri", landmarks: ["District Centre"] },
      { slug: "saket", name: "Saket", landmarks: ["Select Citywalk", "Malviya Nagar"] },
      { slug: "vasant-kunj", name: "Vasant Kunj", landmarks: ["Ambience Mall"] },
      { slug: "mayur-vihar", name: "Mayur Vihar", landmarks: ["Phase 1 Metro"] },
      { slug: "lajpat-nagar", name: "Lajpat Nagar", landmarks: ["Central Market"] },
      { slug: "paschim-vihar", name: "Paschim Vihar" },
      { slug: "karol-bagh", name: "Karol Bagh" },
    ],
    travelNote: null,
    localNotes: [
      "Most Delhi apartment societies want a gate pass raised before a decoration team arrives. Give us the flat number and society name when you book and we send the team details the evening before.",
      "Lifts in older South and West Delhi buildings are narrow. Arch frames and tall stands are carried up in sections, which is why we ask for an extra thirty minutes in walk-ups above the third floor.",
      "Helium cylinders cannot be taken into some Metro-adjacent commercial buildings without prior clearance from facility management. Tell us if the venue is an office and we will arrange it.",
    ],
    seo: {
      title: "Balloon Decoration in Delhi — Same-Day Home Setup",
      description:
        "Balloon and party decoration at home in Delhi. Birthdays, anniversaries and baby showers set up by our own team across Dwarka, Rohini, Saket and Mayur Vihar.",
    },
  },
  {
    slug: "gurugram",
    name: "Gurugram",
    aliases: ["Gurgaon"],
    state: "Haryana",
    localities: [
      { slug: "dlf-phase-1", name: "DLF Phase 1" },
      { slug: "dlf-phase-3", name: "DLF Phase 3", landmarks: ["Cyber Hub"] },
      { slug: "golf-course-road", name: "Golf Course Road", landmarks: ["Sector 42", "Sector 54"] },
      { slug: "sohna-road", name: "Sohna Road", landmarks: ["Sector 48", "Sector 49"] },
      { slug: "sushant-lok", name: "Sushant Lok" },
      { slug: "sector-56", name: "Sector 56" },
      { slug: "palam-vihar", name: "Palam Vihar" },
      { slug: "new-gurugram", name: "New Gurugram", landmarks: ["Sector 82", "Sector 92", "Dwarka Expressway"] },
      { slug: "manesar", name: "Manesar" },
    ],
    travelNote:
      "Setups beyond Manesar and past Sector 95 carry a travel charge, quoted before you confirm — never added afterwards.",
    localNotes: [
      "High-rise societies on Golf Course Extension and Dwarka Expressway usually need visitor entry booked through the resident app. A booking made after 6 PM for the next morning is tight; the earlier we have the flat details, the better.",
      "Condominium clubhouses and party halls here often have their own decor rules — no adhesive on painted walls, no confetti, teardown by a fixed hour. Send us the society's rule sheet and we plan around it rather than argue at the gate.",
      "Weekday evening traffic on Golf Course Road and NH-48 pushes arrival times out. For a 7 PM reveal on a weekday we start setup at 4 PM.",
    ],
    seo: {
      title: "Balloon Decoration in Gurugram — Home & Society Setups",
      description:
        "Balloon and party decoration in Gurugram (Gurgaon). Birthday, anniversary and baby shower setups across DLF, Golf Course Road, Sohna Road and New Gurugram.",
    },
  },
  {
    slug: "noida",
    name: "Noida",
    aliases: ["Gautam Buddh Nagar"],
    state: "Uttar Pradesh",
    localities: [
      { slug: "sector-18", name: "Sector 18", landmarks: ["Atta Market", "DLF Mall of India"] },
      { slug: "sector-50", name: "Sector 50" },
      { slug: "sector-62", name: "Sector 62" },
      { slug: "sector-76", name: "Sector 76" },
      { slug: "sector-93", name: "Sector 93", landmarks: ["Expressway"] },
      { slug: "sector-137", name: "Sector 137" },
      { slug: "sector-150", name: "Sector 150" },
      { slug: "noida-extension", name: "Noida Extension", landmarks: ["Gaur City", "Bisrakh Road"] },
    ],
    travelNote: null,
    localNotes: [
      "Expressway sectors from 128 to 150 are a long single run for the team. Morning slots there are easier to hold than evening ones, and we say so at the time of booking rather than after.",
      "Most Noida societies log a decoration team as a service visitor with ID at the gate. We share the team member's name and number the night before so nobody is stopped in the lobby with a balloon arch.",
      "Cake and flowers are sourced locally in Noida rather than carried from Delhi, so a same-day add-on is realistic here in a way it is not for every part of NCR.",
    ],
    seo: {
      title: "Balloon Decoration in Noida — Sector-Wise Home Setup",
      description:
        "Balloon and party decoration in Noida. Birthday, anniversary and welcome-baby setups across Sector 18, 50, 62, 137 and Noida Extension, installed by our own team.",
    },
  },
  {
    slug: "greater-noida",
    name: "Greater Noida",
    aliases: ["Greater Noida West", "Noida Extension"],
    state: "Uttar Pradesh",
    localities: [
      { slug: "alpha", name: "Alpha 1 & 2" },
      { slug: "beta", name: "Beta 1 & 2" },
      { slug: "gamma", name: "Gamma 1 & 2" },
      { slug: "pari-chowk", name: "Pari Chowk" },
      { slug: "knowledge-park", name: "Knowledge Park" },
      { slug: "greater-noida-west", name: "Greater Noida West", landmarks: ["Gaur City", "Ek Murti Chowk"] },
      { slug: "omega", name: "Omega 1 & 2" },
    ],
    travelNote:
      "Greater Noida sits at the outer edge of our routing. Slots are held rather than same-day, and a travel charge applies past Knowledge Park — quoted upfront.",
    localNotes: [
      "The Alpha, Beta and Gamma blocks are mostly independent houses and low-rise, so terrace and courtyard setups are common here in a way they are not in Noida's high-rises. Tell us if the setup is outdoors and we weight the arches.",
      "Greater Noida West is a different run from Greater Noida proper despite the name. Confirm which one you mean when booking — it changes the arrival window by close to an hour.",
      "Because the drive is long, we carry spare balloons and a backup pump on every Greater Noida job rather than returning for them.",
    ],
    seo: {
      title: "Balloon Decoration in Greater Noida — Home Setup",
      description:
        "Balloon and party decoration in Greater Noida and Greater Noida West. Birthday and anniversary setups across Alpha, Beta, Gamma, Pari Chowk and Gaur City.",
    },
  },
  {
    slug: "faridabad",
    name: "Faridabad",
    aliases: [],
    state: "Haryana",
    localities: [
      { slug: "sector-15", name: "Sector 15" },
      { slug: "sector-21", name: "Sector 21" },
      { slug: "nit-faridabad", name: "NIT Faridabad" },
      { slug: "greater-faridabad", name: "Greater Faridabad", landmarks: ["Neharpar", "Sector 86"] },
      { slug: "sector-46", name: "Sector 46" },
      { slug: "old-faridabad", name: "Old Faridabad" },
    ],
    travelNote:
      "Faridabad runs are scheduled a day ahead. Same-day is only possible when a slot has already opened — we will tell you straight away rather than take the booking and hope.",
    localNotes: [
      "Greater Faridabad and Neharpar are newer high-rise stock; NIT and Old Faridabad are mostly independent houses. The setup is genuinely different and so is the time it takes, which is why we ask which one you are in before quoting.",
      "The Badarpur border crossing is the bottleneck on every Faridabad job. For an evening surprise we leave Delhi before the afternoon peak rather than promise a window we cannot hold.",
      "Rooftop setups are common in the older sectors. Wind is the deciding factor — we bring weighted bases and will move a fragile centrepiece indoors rather than watch it come apart.",
    ],
    seo: {
      title: "Balloon Decoration in Faridabad — Home Setup",
      description:
        "Balloon and party decoration in Faridabad. Birthday, anniversary and baby shower setups across Sector 15, 21, NIT and Greater Faridabad, installed by our own team.",
    },
  },
];

export const getCity = (slug: string) => cities.find((c) => c.slug === slug);

/** Every alias and name, for matching a visitor's search term to a city. */
export const cityNames = cities.flatMap((c) => [c.name, ...c.aliases]);
