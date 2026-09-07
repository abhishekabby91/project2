/**
 * ─────────────────────────────────────────────────────────────────────────
 *  COOKIE AND CONSENT CONFIGURATION
 * ─────────────────────────────────────────────────────────────────────────
 *
 * ⚠️  This file configures a technical mechanism. It is not legal advice, and
 * the settings below are not a determination that any particular law applies to
 * your client. Which regime governs this business — India's Digital
 * Personal Data Protection Act 2023, and GDPR or a US state act for visitors
 * abroad — depends on where its visitors are and what it processes, and that
 * call belongs to the business's own lawyer.
 *
 * What this implementation does:
 *
 *   • Loads Google Consent Mode v2 with everything DENIED before any tag fires.
 *   • Blocks non-essential scripts until the visitor opts in, per category.
 *   • Stores the choice, with a version, so a change to your cookie set can
 *     re-prompt rather than silently inheriting stale consent.
 *   • Honours Global Privacy Control (GPC), which several US state laws treat
 *     as a valid opt-out signal.
 *   • Gives the visitor a way back — consent that cannot be withdrawn as easily
 *     as it was given is not consent under GDPR.
 */

export type ConsentCategory = "necessary" | "functional" | "analytics" | "marketing";

export interface CategoryConfig {
  id: ConsentCategory;
  label: string;
  description: string;
  /** Necessary cookies cannot be declined and the toggle is shown locked. */
  required: boolean;
  /** What actually gets set. Keep accurate — this is a disclosure. */
  cookies: { name: string; provider: string; purpose: string; retention: string }[];
}

export interface ConsentConfig {
  /**
   * "opt-in"  — nothing non-essential runs until the visitor agrees. Required
   *             under GDPR/UK GDPR. The safe default, and what ships here.
   * "opt-out" — non-essential runs immediately, with a way to refuse. Common
   *             under US state laws. Only switch with the client's sign-off.
   */
  mode: "opt-in" | "opt-out";
  /**
   * Bump when the cookie set changes materially. Stored consent from an older
   * version is treated as absent, so visitors are asked again.
   */
  version: number;
  /** How long a recorded choice stands before being re-requested, in days. */
  expiryDays: number;
  /** Set false only if the site has no cookies beyond strictly necessary. */
  enabled: boolean;
  banner: {
    title: string;
    body: string;
    acceptAll: string;
    rejectAll: string;
    managePreferences: string;
  };
  preferences: {
    title: string;
    body: string;
    save: string;
    close: string;
  };
  categories: CategoryConfig[];
}

export const consentConfig: ConsentConfig = {
  mode: "opt-in",
  version: 1,
  expiryDays: 180,
  enabled: true,

  banner: {
    title: "Cookies on this site",
    body: "We use necessary cookies to make this site work. We'd also like to set analytics cookies to understand how it's used. We won't set anything optional without your agreement.",
    acceptAll: "Accept all",
    rejectAll: "Reject optional",
    managePreferences: "Manage preferences",
  },

  preferences: {
    title: "Cookie preferences",
    body: "Choose which cookies this site may set. You can change this at any time from the link in the footer.",
    save: "Save preferences",
    close: "Close",
  },

  /**
   * Keep this list accurate. It is a disclosure, and a cookie
   * table that doesn't match what the site actually sets is worse than none.
   * Run a cookie scan against the finished site before launch and reconcile.
   */
  categories: [
    {
      id: "necessary",
      label: "Strictly necessary",
      description:
        "Required for the site to function. These remember your cookie choice and protect form submissions. They cannot be switched off.",
      required: true,
      cookies: [
        {
          name: "site_consent",
          provider: "This site",
          purpose: "Stores your cookie preferences",
          retention: "180 days",
        },
      ],
    },
    {
      id: "functional",
      label: "Functional",
      description:
        "Remember choices you make, such as a remembered city. The site works without them.",
      required: false,
      cookies: [],
    },
    {
      id: "analytics",
      label: "Analytics",
      description:
        "Help us understand which pages are useful and where people get stuck. Aggregated; never used to identify you.",
      required: false,
      cookies: [
        {
          name: "_ga, _ga_*",
          provider: "Google Analytics",
          purpose: "Distinguishes visitors and sessions to measure site usage",
          retention: "Up to 2 years",
        },
      ],
    },
    {
      id: "marketing",
      label: "Advertising",
      description:
        "Used to measure advertising and show relevant ads on other sites. Only set if the business runs paid campaigns.",
      required: false,
      cookies: [],
    },
  ],
};

/** Categories the visitor can actually choose, in display order. */
export const optionalCategories = consentConfig.categories.filter((c) => !c.required);
