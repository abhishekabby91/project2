/**
 * Human sign-off on every public claim this site makes.
 *
 * The content checks compare text. They cannot tell an invented price from a
 * real one, or a service area the team covers from one it does not — a
 * fabricated figure and a true one are identical in source. So the last gate is
 * a named person who can substantiate each class of claim.
 *
 * ⚠️  Whoever is building this site does not fill this in. The owner of the
 * business does, having actually checked. `npm run check:content` fails while
 * anything here is unverified, and that failure is the feature.
 */
export interface Attestation {
  verified: boolean;
  /** The real name of the person who confirmed it. */
  by: string;
  /** ISO date, YYYY-MM-DD. */
  date: string;
  note?: string;
}

const unverified: Attestation = { verified: false, by: "", date: "" };

export const verification: Record<string, Attestation> = {
  /** Contact details: phone, WhatsApp number, email, address. */
  contact: { ...unverified },

  /** Every published price is one the business will honour. */
  pricing: { ...unverified },

  /** The team will actually travel to every city and locality listed. */
  locations: { ...unverified },

  /** Each service is work this team can deliver. */
  services: { ...unverified },

  /** What each package includes and excludes matches reality. */
  packages: { ...unverified },

  /** Deposit, cancellation, travel-charge and rescheduling terms in the FAQs. */
  policies: { ...unverified },

  /** Reviews are real, attributed, and published with permission. */
  reviews: { ...unverified },

  /** Every photograph is of a setup this team built. */
  imagery: { ...unverified },

  /** The cookie list matches a scan of the finished site. */
  cookieDisclosure: { ...unverified },

  /** Trust points on the home page are figures the business can substantiate. */
  trustPoints: { ...unverified },
};

export const unverifiedClaims = () =>
  Object.entries(verification).filter(([, a]) => !a.verified).map(([key]) => key);
