import type { FaqItem } from "./types";

/**
 * FAQs are answered as though a customer asked on the phone. Two of them below
 * deliberately describe limits rather than benefits — the travel charge and the
 * cancellation window. Those are the answers that stop a dispute on the day,
 * and they are the first ones a rewrite tends to soften. Do not soften them.
 *
 * Anything here that states a policy (deposit, cancellation, timing) has to
 * match what the business actually does. Confirm each with the owner and sign
 * off `policies` in content/verification.ts.
 */
export const faqs: FaqItem[] = [
  {
    category: "Booking",
    question: "How far in advance should I book?",
    answer:
      "Three to four days is comfortable for most setups and gives you a choice of arrival slot. Weekends in the festive season fill earlier than that. Same-day is sometimes possible in Delhi, Gurugram and Noida when a slot has opened, and is rarely possible in Greater Noida or Faridabad because those are longer runs — we will tell you straight away rather than take the booking and hope.",
  },
  {
    category: "Booking",
    question: "Can you set up for a surprise without the other person knowing?",
    answer:
      "Yes, and most of our anniversary and proposal bookings are exactly that. We need three things: a realistic window when they will be out, a contact who is not them, and someone who can let the team in. We plan backwards from the moment you want the door to open, and we clear the packaging and leave before it does.",
  },
  {
    category: "Pricing",
    question: "Is the published price the price I pay?",
    answer:
      "It is the starting price for that setup as described, and it is what you pay when your room fits the standard scope. Anything that changes the scope — a larger wall, a higher ceiling, extra rooms, helium, fresh flowers beyond what is listed — is quoted before you confirm, never added afterwards. If we cannot do it at the published price we will say so when you send the photos, not on the day.",
  },
  {
    category: "Pricing",
    question: "Do you charge for travel?",
    answer:
      "Not within our regular routing across Delhi, Gurugram, Noida and central Faridabad. A travel charge does apply beyond Manesar, past Sector 95 in Gurugram, and past Knowledge Park in Greater Noida, because those are a materially longer run. Where it applies it is quoted with the setup price, in writing, before you pay anything.",
  },
  {
    category: "Pricing",
    question: "Do I need to pay a deposit?",
    answer:
      "You get a written quote first, with the scope and any travel charge on it. A booking is held once the deposit is paid against that quote. Nothing is taken before you have seen the price in writing.",
  },
  {
    category: "On the day",
    question: "How long does the setup take?",
    answer:
      "Between one and four hours depending on the package — each package page states its own setup time. A photo corner is quick. A full themed room or a ceiling canopy is not. We plan to finish at least an hour before your guests arrive, and we tell you the arrival window rather than a vague morning or evening.",
  },
  {
    category: "On the day",
    question: "Will the decoration damage my walls?",
    answer:
      "We use low-tack adhesives and free-standing frames wherever we can, and on painted or textured walls we default to a frame rather than fixing to the surface. Tell us if the wall is freshly painted, wallpapered, or if your society or landlord prohibits fixings — that changes how we build, and it is far better to know beforehand.",
  },
  {
    category: "On the day",
    question: "Do you take the decoration down afterwards?",
    answer:
      "Yes, teardown and removal are included in every package. For a birthday that usually means the same night or the following morning, whichever you prefer. For a romantic room setup most people ask us to leave it, so we do not take it down unless you tell us to.",
  },
  {
    category: "On the day",
    question: "My building needs a gate pass or lift booking. Can you handle that?",
    answer:
      "We can give you everything you need to arrange it, but the society will only accept the request from a resident. Send us the requirement when you book and we will share the team member's name, phone number and arrival window the evening before so you can raise the pass. This is the single most common reason a team ends up waiting in a lobby.",
  },
  {
    category: "Materials",
    question: "Are the balloons safe around small children?",
    answer:
      "Uninflated and burst latex balloons are a genuine choking hazard for children under three, which is why we keep the low band of any setup near small children solid or foil rather than loose latex, and why we collect every offcut before we leave. We would still ask an adult to keep an eye on the setup during the party — a decoration built for photographs is not a toy.",
  },
  {
    category: "Materials",
    question: "Can you do a specific cartoon or film character?",
    answer:
      "We build to a look rather than a licensed character. Our themes are descriptive — unicorn and pastel, jungle safari, superhero and comic — because character names and artwork are trademarked and we are not licensed to sell them. In practice the colour, shape and scale do most of the work, and a themed setup reads clearly in photographs without a printed character on it. If you want to bring your own licensed cutout or cake topper, that is entirely fine and we will build around it.",
  },
  {
    category: "Materials",
    question: "Do you provide the cake, flowers or photography?",
    answer:
      "Cake, catering and photography are not ours. Fresh flowers are included where a package lists them and can be added where it does not. We would rather coordinate with the cake and photographer you have already chosen — telling us their timings genuinely changes how we schedule the setup — than sell you something we do not do well.",
  },
  {
    category: "Changes",
    question: "What happens if I need to cancel or move the date?",
    answer:
      "Tell us as early as you can. Moving a date is usually straightforward when a slot is free, and we would rather move a booking than lose it. Cancellation terms are on your written quote, and the closer to the date, the more of the materials and slot have already been committed. Ask us before you book if this matters to you — we will explain it plainly rather than point at the fine print later.",
  },
  {
    category: "Changes",
    question: "What if it rains on an outdoor setup?",
    answer:
      "We agree the fallback before you book, not on the day. Terrace and balcony setups get a pre-agreed indoor alternative, and if the wind or rain makes the outdoor setup unsafe we move to it rather than build something that will come apart. We will also tell you honestly when the season is wrong for what you are picturing.",
  },
];

export const faqCategories = [...new Set(faqs.map((f) => f.category).filter(Boolean))] as string[];

/** The subset shown on the home page — booking and pricing questions first. */
export const homeFaqs = faqs.filter((f) =>
  ["How far in advance should I book?", "Is the published price the price I pay?",
   "Do you charge for travel?", "How long does the setup take?",
   "Will the decoration damage my walls?", "Do you take the decoration down afterwards?"]
    .includes(f.question),
);
