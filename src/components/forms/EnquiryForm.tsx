"use client";

import { useRef, useState } from "react";
import { copy } from "@/content/copy";
import { cities } from "@/content/cities";
import { occasions } from "@/content/occasions";
import { site, whatsappLink } from "@/content/site";
import { Button } from "@/components/ui/Button";
import { Icon } from "@/components/ui/Icon";
import { cn } from "@/lib/utils";
import { trackEvent } from "@/lib/analytics";

type Errors = Partial<Record<"phone", string>>;

const field =
  "w-full rounded-brand border border-line bg-surface px-4 py-3 text-[0.9375rem] text-ink " +
  "placeholder:text-ink-muted/70 focus:border-accent focus:outline-2 focus:outline-offset-1 focus:outline-accent";

const label = "mb-1.5 block text-sm font-medium text-primary";

/** Same rule the API applies. Kept in step deliberately — see the route. */
const PHONE = /^(\+?91)?[6-9]\d{9}$/;

/**
 * Enquiry form.
 *
 * One required field: the phone number. That is genuinely all this business
 * needs to reply, and every extra required field is a person who closes the
 * tab instead. Name and a written description used to be mandatory — asking
 * someone to compose a paragraph before you will accept their enquiry is the
 * most expensive field on any form in this market.
 *
 * Everything else is folded into a <details>, which works with JavaScript off
 * and keeps the default view to three inputs. What is not filled in gets asked
 * on WhatsApp, where the conversation was always going to happen.
 *
 * Client validation exists to be quick, not to be the gate — the API route
 * re-validates independently, because anything that only runs in the browser
 * is not validation.
 */
export function EnquiryForm() {
  const [errors, setErrors] = useState<Errors>({});
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "failed">("idle");
  const formRef = useRef<HTMLFormElement>(null);

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const data = Object.fromEntries(new FormData(form)) as Record<string, string>;

    const next: Errors = {};
    const phone = (data.phone ?? "").trim();
    if (!phone) next.phone = copy.contact.validation.phone;
    else if (!PHONE.test(phone.replace(/[\s-]/g, ""))) next.phone = copy.contact.validation.phoneFormat;
    setErrors(next);

    if (next.phone) {
      form.querySelector<HTMLElement>('[name="phone"]')?.focus();
      return;
    }

    setStatus("sending");
    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!response.ok) throw new Error(String(response.status));
      setStatus("sent");
      trackEvent("enquiry_form_submit");
      form.reset();
    } catch {
      setStatus("failed");
    }
  }

  if (status === "sent") {
    return (
      <p role="status" className="rounded-brand-lg border border-accent/30 bg-accent/5 p-6 leading-relaxed text-ink">
        {copy.contact.success}
      </p>
    );
  }

  return (
    <form ref={formRef} onSubmit={onSubmit} noValidate className="space-y-5">
      {/* Honeypot. Hidden from sight and from assistive tech; only a bot fills it. */}
      <div className="absolute left-[-9999px]" aria-hidden="true">
        <label htmlFor="website">{copy.contact.fields.honeypot}</label>
        <input id="website" name="website" type="text" tabIndex={-1} autoComplete="off" />
      </div>

      <div>
        <label htmlFor="phone" className={label}>
          {copy.contact.fields.phone}
        </label>
        <input
          id="phone"
          name="phone"
          type="tel"
          inputMode="tel"
          autoComplete="tel"
          required
          aria-invalid={errors.phone ? "true" : undefined}
          aria-describedby={errors.phone ? "phone-error" : "phone-hint"}
          className={cn(field, errors.phone && "border-accent")}
        />
        {errors.phone ? (
          <p id="phone-error" role="alert" className="mt-1.5 text-sm text-accent">{errors.phone}</p>
        ) : (
          <p id="phone-hint" className="mt-1.5 text-sm text-ink-muted">
            {copy.contact.fields.phoneHint}
          </p>
        )}
      </div>

      {/* The two that shape a quote most and cost one tap each. */}
      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor="date" className={label}>
            {copy.contact.fields.date}
          </label>
          <input id="date" name="date" type="date" className={field} />
        </div>

        <div>
          <label htmlFor="city" className={label}>
            {copy.contact.fields.city}
          </label>
          <select id="city" name="city" className={field} defaultValue="">
            <option value="">Select a city</option>
            {cities.map((city) => (
              <option key={city.slug} value={city.name}>{city.name}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Folded away, and a real <details> so it opens without JavaScript. */}
      <details className="rounded-brand border border-line bg-muted/50 px-4 py-3">
        <summary className="flex min-h-6 cursor-pointer list-none items-center py-1 text-sm font-semibold text-primary marker:content-['']">
          <span className="inline-flex items-center gap-2">
            <Icon name="sparkle" className="h-4 w-4 text-accent" />
            {copy.contact.fields.moreDetails}
          </span>
        </summary>

        <p className="mt-3 text-sm leading-relaxed text-ink-muted">
          {copy.contact.fields.moreDetailsNote}
        </p>

        <div className="mt-5 space-y-5">
          <div className="grid gap-5 sm:grid-cols-2">
            <div>
              <label htmlFor="name" className={label}>
                {copy.contact.fields.name}
              </label>
              <input id="name" name="name" type="text" autoComplete="name" className={field} />
            </div>

            <div>
              <label htmlFor="occasion" className={label}>
                {copy.contact.fields.occasion}
              </label>
              <select id="occasion" name="occasion" className={field} defaultValue="">
                <option value="">Select an occasion</option>
                {occasions.map((occasion) => (
                  <option key={occasion.slug} value={occasion.name}>{occasion.name}</option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label htmlFor="email" className={label}>
              {copy.contact.fields.email}
            </label>
            <input id="email" name="email" type="email" autoComplete="email" className={field} />
          </div>

          <div>
            <label htmlFor="message" className={label}>
              {copy.contact.fields.message}
            </label>
            <textarea
              id="message"
              name="message"
              rows={4}
              placeholder={copy.contact.fields.messagePlaceholder}
              className={cn(field, "resize-y")}
            />
          </div>
        </div>
      </details>

      {status === "failed" ? (
        <p role="alert" className="rounded-brand border border-accent/40 bg-accent/5 p-4 text-sm text-ink">
          {copy.contact.error}
        </p>
      ) : null}

      <div className="flex flex-wrap items-center gap-4">
        <Button type="submit" size="lg" disabled={status === "sending"}>
          {status === "sending" ? copy.contact.fields.submitting : copy.contact.fields.submit}
        </Button>
        <a
          href={whatsappLink()}
          data-conversion="whatsapp_click"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex min-h-6 items-center gap-2 text-sm font-semibold text-accent underline-offset-4 hover:underline"
        >
          <Icon name="whatsapp" className="h-4 w-4" />
          {copy.cta.whatsapp}
        </a>
      </div>

      <p className="text-sm text-ink-muted">
        {copy.contact.fields.fasterRoute}{" "}
        <a
          href={`tel:${site.phoneHref}`}
          className="inline-flex min-h-6 items-center font-semibold text-accent"
        >
          {site.phone}
        </a>
      </p>
    </form>
  );
}
