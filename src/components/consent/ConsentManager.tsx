"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { consentConfig, optionalCategories } from "@/content/privacy";
import {
  allowAll,
  applyConsent,
  defaultState,
  denyAll,
  readConsent,
  shouldPrompt,
  writeConsent,
  type ConsentState,
} from "@/lib/consent";
import { cn } from "@/lib/utils";

/**
 * Cookie banner and preference centre.
 *
 * Design decisions worth keeping if you edit this:
 *
 *  • "Reject optional" sits beside "Accept all" with equal visual weight.
 *    Burying refusal behind a second click is a documented enforcement target
 *    under GDPR, and it is the single most common failure in cookie banners.
 *  • The banner does not trap focus or block the page. A modal that holds the
 *    site hostage is both hostile and, in the EU, evidence that consent was not
 *    freely given. The preference dialog does trap focus, because it is a
 *    genuine dialog the visitor opened.
 *  • Nothing here decides what is lawful. It implements the mechanism; the
 *    firm's counsel decides which regime applies. See content/privacy.ts.
 */
export function ConsentManager() {
  const [visible, setVisible] = useState(false);
  const [prefsOpen, setPrefsOpen] = useState(false);
  const [draft, setDraft] = useState<ConsentState>(denyAll);
  const dialogRef = useRef<HTMLDivElement>(null);
  const openerRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (!consentConfig.enabled) return;
    const stored = readConsent();
    setDraft(stored ?? defaultState());
    // Re-assert the stored choice on every load: Consent Mode's `default` runs
    // from the head script, and this keeps the React state in step with it.
    if (stored) applyConsent(stored);
    setVisible(shouldPrompt());
  }, []);

  // The footer link opens the preference centre from anywhere.
  useEffect(() => {
    const open = (event: Event) => {
      openerRef.current = (event.target as HTMLElement) ?? null;
      setDraft(readConsent() ?? defaultState());
      setPrefsOpen(true);
    };
    window.addEventListener("open-cookie-preferences", open);
    return () => window.removeEventListener("open-cookie-preferences", open);
  }, []);

  const commit = useCallback((state: ConsentState) => {
    writeConsent(state);
    applyConsent(state);
    setDraft(state);
    setVisible(false);
    setPrefsOpen(false);
    openerRef.current?.focus?.();
  }, []);

  // Escape closes the dialog; focus returns where it came from.
  useEffect(() => {
    if (!prefsOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setPrefsOpen(false);
        openerRef.current?.focus?.();
      }
      if (e.key !== "Tab" || !dialogRef.current) return;
      const focusable = dialogRef.current.querySelectorAll<HTMLElement>(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])',
      );
      if (focusable.length === 0) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };
    document.addEventListener("keydown", onKey);
    dialogRef.current?.querySelector<HTMLElement>("button")?.focus();
    return () => document.removeEventListener("keydown", onKey);
  }, [prefsOpen]);

  /**
   * Both this banner and the mobile CTA bar anchor to the bottom of the
   * viewport, and the banner sits above it — so the Call/Schedule bar becomes
   * invisible and unclickable while the banner is up. Flag the state on the
   * root element and let the CTA bar stand down until a choice is made.
   */
  useEffect(() => {
    const root = document.documentElement;
    if (visible || prefsOpen) root.setAttribute("data-consent-open", "");
    else root.removeAttribute("data-consent-open");
    return () => root.removeAttribute("data-consent-open");
  }, [visible, prefsOpen]);

  if (!consentConfig.enabled) return null;

  return (
    <>
      {visible && !prefsOpen ? (
        <div
          role="region"
          aria-label={consentConfig.banner.title}
          className="no-print fixed inset-x-0 bottom-0 z-[60] border-t border-line bg-surface shadow-float"
        >
          <div className="mx-auto flex max-w-6xl flex-col gap-4 px-5 py-5 sm:px-6 lg:flex-row lg:items-center lg:justify-between lg:gap-8 lg:px-8">
            <div className="max-w-2xl">
              <p className="font-serif text-base font-semibold text-primary">
                {consentConfig.banner.title}
              </p>
              <p className="mt-1.5 text-sm leading-relaxed text-ink-muted">
                {consentConfig.banner.body}
              </p>
            </div>
            <div className="flex flex-col gap-2.5 sm:flex-row lg:shrink-0">
              {/* Refusal is as easy as acceptance — deliberately. */}
              <button
                type="button"
                onClick={() => commit(denyAll)}
                className="rounded-brand border border-line px-5 py-2.5 text-sm font-semibold text-primary transition-colors hover:border-primary"
              >
                {consentConfig.banner.rejectAll}
              </button>
              <button
                type="button"
                onClick={() => commit(allowAll)}
                className="rounded-brand bg-accent px-5 py-2.5 text-sm font-semibold text-accent-fg transition-colors hover:bg-accent-hover"
              >
                {consentConfig.banner.acceptAll}
              </button>
              <button
                type="button"
                onClick={(e) => {
                  openerRef.current = e.currentTarget;
                  setPrefsOpen(true);
                }}
                className="rounded-brand px-4 py-2.5 text-sm font-medium text-ink-muted underline underline-offset-4 transition-colors hover:text-accent"
              >
                {consentConfig.banner.managePreferences}
              </button>
            </div>
          </div>
        </div>
      ) : null}

      {prefsOpen ? (
        <div className="no-print fixed inset-0 z-[70] flex items-end justify-center bg-black/40 p-0 sm:items-center sm:p-6">
          <div
            ref={dialogRef}
            role="dialog"
            aria-modal="true"
            aria-labelledby="cookie-prefs-title"
            className="max-h-[85dvh] w-full max-w-2xl overflow-y-auto rounded-t-brand-lg bg-surface p-6 shadow-float sm:rounded-brand-lg sm:p-8"
          >
            <h2 id="cookie-prefs-title" className="text-xl">
              {consentConfig.preferences.title}
            </h2>
            <p className="mt-2 text-sm leading-relaxed text-ink-muted">
              {consentConfig.preferences.body}
            </p>

            <ul className="mt-6 space-y-4">
              {consentConfig.categories.map((category) => {
                const checked = category.required || draft[category.id];
                return (
                  <li
                    key={category.id}
                    className="rounded-brand-lg border border-line p-4"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <label
                          htmlFor={`consent-${category.id}`}
                          className="font-serif text-base font-semibold text-primary"
                        >
                          {category.label}
                        </label>
                        <p className="mt-1 text-sm leading-relaxed text-ink-muted">
                          {category.description}
                        </p>
                      </div>
                      <input
                        id={`consent-${category.id}`}
                        type="checkbox"
                        checked={checked}
                        disabled={category.required}
                        onChange={(e) =>
                          setDraft((d) => ({ ...d, [category.id]: e.target.checked }))
                        }
                        className={cn(
                          "mt-1 h-5 w-5 shrink-0 accent-[var(--color-accent)]",
                          category.required && "cursor-not-allowed opacity-60",
                        )}
                        aria-describedby={`consent-${category.id}-desc`}
                      />
                    </div>

                    {category.cookies.length > 0 ? (
                      <details className="mt-3">
                        <summary className="cursor-pointer text-xs font-semibold uppercase tracking-wide text-ink-muted">
                          Cookies used ({category.cookies.length})
                        </summary>
                        <div className="mt-2 overflow-x-auto">
                          <table className="w-full text-left text-xs">
                            <thead className="text-ink-muted">
                              <tr>
                                <th className="py-1 pr-3 font-medium">Name</th>
                                <th className="py-1 pr-3 font-medium">Provider</th>
                                <th className="py-1 pr-3 font-medium">Purpose</th>
                                <th className="py-1 font-medium">Retention</th>
                              </tr>
                            </thead>
                            <tbody className="text-ink">
                              {category.cookies.map((c) => (
                                <tr key={c.name} className="border-t border-line">
                                  <td className="py-1.5 pr-3 font-mono">{c.name}</td>
                                  <td className="py-1.5 pr-3">{c.provider}</td>
                                  <td className="py-1.5 pr-3">{c.purpose}</td>
                                  <td className="py-1.5">{c.retention}</td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </details>
                    ) : (
                      <p id={`consent-${category.id}-desc`} className="sr-only">
                        {category.description}
                      </p>
                    )}
                  </li>
                );
              })}
            </ul>

            <div className="mt-7 flex flex-col gap-3 sm:flex-row sm:justify-end">
              <button
                type="button"
                onClick={() => commit(denyAll)}
                className="rounded-brand border border-line px-5 py-2.5 text-sm font-semibold text-primary transition-colors hover:border-primary"
              >
                {consentConfig.banner.rejectAll}
              </button>
              <button
                type="button"
                onClick={() => commit(draft)}
                className="rounded-brand bg-accent px-5 py-2.5 text-sm font-semibold text-accent-fg transition-colors hover:bg-accent-hover"
              >
                {consentConfig.preferences.save}
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}

/** Footer link that reopens the preference centre. */
export function CookiePreferencesLink({ className }: { className?: string }) {
  if (!consentConfig.enabled) return null;
  return (
    <button
      type="button"
      className={className}
      onClick={() => window.dispatchEvent(new CustomEvent("open-cookie-preferences"))}
    >
      {consentConfig.preferences.title}
    </button>
  );
}
