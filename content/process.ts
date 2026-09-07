import type { ProcessStep } from "./types";

/**
 * How a booking actually runs. Written as commitments rather than marketing —
 * each step below is something the business has to be willing to do every time.
 * Confirm them with the owner and sign off `policies` in verification.ts.
 */
export const process: ProcessStep[] = [
  {
    number: "01",
    title: "Send us the room",
    description:
      "A photo of the space, your date and what you are celebrating. That is enough for us to tell you what will fit and what it costs.",
    icon: "whatsapp",
  },
  {
    number: "02",
    title: "Get a written quote",
    description:
      "Scope, price and any travel charge, in writing, before you pay anything. If your room needs something outside the package, it is priced here — not on the day.",
    icon: "rupee",
  },
  {
    number: "03",
    title: "We arrive and set up",
    description:
      "A named team member, a confirmed arrival window, and the details you need for a gate pass the evening before. We finish before your guests do.",
    icon: "truck",
  },
  {
    number: "04",
    title: "We take it down",
    description:
      "Teardown and removal are included. Same night or next morning for a party; for a room surprise we leave it up unless you ask us not to.",
    icon: "check",
  },
];
