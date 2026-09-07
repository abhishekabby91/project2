import { consentConfig, type ConsentCategory } from "@/content/privacy";

/**
 * Consent state, storage, and the Google Consent Mode v2 bridge.
 *
 * The important property: nothing non-essential is allowed to run until this
 * module says so. Analytics does not "start and then stop" — it starts denied.
 */

export type ConsentState = Record<ConsentCategory, boolean>;

const STORAGE_KEY = "site_consent";

export const denyAll: ConsentState = {
  necessary: true, // cannot be declined
  functional: false,
  analytics: false,
  marketing: false,
};

export const allowAll: ConsentState = {
  necessary: true,
  functional: true,
  analytics: true,
  marketing: true,
};

interface StoredConsent {
  version: number;
  at: string;
  state: ConsentState;
}

/**
 * Global Privacy Control. Several US state privacy laws treat this browser
 * signal as a valid opt-out, so honour it without asking — and don't show a
 * banner that implies the visitor still has a choice to make about analytics.
 */
export function gpcEnabled(): boolean {
  if (typeof navigator === "undefined") return false;
  return (navigator as Navigator & { globalPrivacyControl?: boolean }).globalPrivacyControl === true;
}

/** The stored choice, or null when absent, expired, or from an older version. */
export function readConsent(): ConsentState | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as StoredConsent;
    if (parsed.version !== consentConfig.version) return null;

    const ageDays = (Date.now() - new Date(parsed.at).getTime()) / 86_400_000;
    if (!Number.isFinite(ageDays) || ageDays > consentConfig.expiryDays) return null;

    return { ...denyAll, ...parsed.state, necessary: true };
  } catch {
    // A browser blocking storage is a refusal to remember, not a grant.
    return null;
  }
}

export function writeConsent(state: ConsentState) {
  if (typeof window === "undefined") return;
  try {
    const payload: StoredConsent = {
      version: consentConfig.version,
      at: new Date().toISOString(),
      state: { ...state, necessary: true },
    };
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
  } catch {
    // Private mode or blocked storage: the choice applies to this page view
    // only, which is the correct fallback.
  }
}

export function clearConsent() {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.removeItem(STORAGE_KEY);
  } catch {
    /* nothing to do */
  }
}

/**
 * The state to apply before any choice is recorded.
 *
 * Under opt-in, that is deny. Under opt-out it is allow — except when GPC is
 * present, which is an explicit refusal and overrides the default.
 */
export function defaultState(): ConsentState {
  if (gpcEnabled()) return denyAll;
  return consentConfig.mode === "opt-out" ? allowAll : denyAll;
}

/** True when the visitor should be asked. GPC counts as already answered. */
export function shouldPrompt(): boolean {
  if (!consentConfig.enabled) return false;
  if (gpcEnabled()) return false;
  return readConsent() === null;
}

/* -------------------------------------------------------------------------- */
/*  Google Consent Mode v2                                                    */
/* -------------------------------------------------------------------------- */

type GtagConsentArg = Record<string, "granted" | "denied">;

/** Maps our categories onto the Consent Mode v2 signals. */
export function consentModeParams(state: ConsentState): GtagConsentArg {
  const g = (allowed: boolean): "granted" | "denied" => (allowed ? "granted" : "denied");
  return {
    ad_storage: g(state.marketing),
    ad_user_data: g(state.marketing),
    ad_personalization: g(state.marketing),
    analytics_storage: g(state.analytics),
    functionality_storage: g(state.functional),
    personalization_storage: g(state.functional),
    security_storage: "granted", // strictly necessary
  };
}

/**
 * The inline script that must run BEFORE gtag.js loads, so no tag ever fires
 * with storage granted by accident. Emitted in the document head.
 */
export function consentModeBootstrap(): string {
  const initial = consentConfig.mode === "opt-out" ? "granted" : "denied";
  return `
window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
try {
  var stored = null;
  try { stored = JSON.parse(localStorage.getItem('${STORAGE_KEY}') || 'null'); } catch (e) {}
  var gpc = navigator.globalPrivacyControl === true;
  var s = (stored && stored.version === ${consentConfig.version} && stored.state) ? stored.state : null;
  var fallback = gpc ? 'denied' : '${initial}';
  var val = function (key) {
    if (s) return s[key] ? 'granted' : 'denied';
    return fallback;
  };
  gtag('consent', 'default', {
    ad_storage: val('marketing'),
    ad_user_data: val('marketing'),
    ad_personalization: val('marketing'),
    analytics_storage: val('analytics'),
    functionality_storage: val('functional'),
    personalization_storage: val('functional'),
    security_storage: 'granted',
    wait_for_update: 500
  });
} catch (e) {
  gtag('consent', 'default', {
    ad_storage: 'denied', ad_user_data: 'denied', ad_personalization: 'denied',
    analytics_storage: 'denied', functionality_storage: 'denied',
    personalization_storage: 'denied', security_storage: 'granted'
  });
}`.trim();
}

/** Push a consent update after the visitor chooses. */
export function applyConsent(state: ConsentState) {
  if (typeof window === "undefined") return;
  const w = window as Window & { dataLayer?: unknown[]; gtag?: (...a: unknown[]) => void };
  w.dataLayer = w.dataLayer || [];
  if (typeof w.gtag === "function") {
    w.gtag("consent", "update", consentModeParams(state));
  } else {
    w.dataLayer.push(["consent", "update", consentModeParams(state)]);
  }
  window.dispatchEvent(new CustomEvent("consentchange", { detail: state }));
}
