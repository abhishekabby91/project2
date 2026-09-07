"use client";

import { useRef, useState } from "react";
import { copy } from "@/content/copy";
import { cities } from "@/content/cities";
import { occasions } from "@/content/occasions";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";
import { trackEvent } from "@/lib/analytics";

type Errors = Partial<Record<"name" | "phone" | "message", string>>;

const field =
  "w-full rounded-brand border border-line bg-surface px-4 py-3 text-[0.9375rem] text-ink " +
  "placeholder:text-ink-muted/70 focus:border-accent focus:outline-2 focus:outline-offset-1 focus:outline-accent";

/**
 * Enquiry form. Client validation exists to be quick, not to be the gate — the
 * API route re-validates everything independently, because anything that only
 * runs in the browser is not validation.
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
    if (!data.name?.trim()) next.name = copy.contact.validation.name;
    if (!data.phone?.trim()) next.phone = copy.contact.validation.phone;
    if ((data.message ?? "").trim().length < 10) next.message = copy.contact.validation.message;
    setErrors(next);

    if (Object.keys(next).length) {
      // Move focus to the first problem rather than leaving a screen-reader
      // user to hunt for the error message.
      const firstKey = Object.keys(next)[0];
      form.querySelector<HTMLElement>(`[name="${firstKey}"]`)?.focus();
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

      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor="name" className="mb-1.5 block text-sm font-medium text-primary">
            {copy.contact.fields.name}
          </label>
          <input
            id="name"
            name="name"
            type="text"
            autoComplete="name"
            required
            aria-invalid={errors.name ? "true" : undefined}
            aria-describedby={errors.name ? "name-error" : undefined}
            className={cn(field, errors.name && "border-accent")}
          />
          {errors.name ? (
            <p id="name-error" role="alert" className="mt-1.5 text-sm text-accent">{errors.name}</p>
          ) : null}
        </div>

        <div>
          <label htmlFor="phone" className="mb-1.5 block text-sm font-medium text-primary">
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
            aria-describedby={errors.phone ? "phone-error" : undefined}
            className={cn(field, errors.phone && "border-accent")}
          />
          {errors.phone ? (
            <p id="phone-error" role="alert" className="mt-1.5 text-sm text-accent">{errors.phone}</p>
          ) : null}
        </div>

        <div>
          <label htmlFor="email" className="mb-1.5 block text-sm font-medium text-primary">
            {copy.contact.fields.email}
          </label>
          <input id="email" name="email" type="email" autoComplete="email" className={field} />
        </div>

        <div>
          <label htmlFor="date" className="mb-1.5 block text-sm font-medium text-primary">
            {copy.contact.fields.date}
          </label>
          <input id="date" name="date" type="date" className={field} />
        </div>

        <div>
          <label htmlFor="city" className="mb-1.5 block text-sm font-medium text-primary">
            {copy.contact.fields.city}
          </label>
          <select id="city" name="city" className={field} defaultValue="">
            <option value="">Select a city</option>
            {cities.map((city) => (
              <option key={city.slug} value={city.name}>{city.name}</option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="occasion" className="mb-1.5 block text-sm font-medium text-primary">
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
        <label htmlFor="message" className="mb-1.5 block text-sm font-medium text-primary">
          {copy.contact.fields.message}
        </label>
        <textarea
          id="message"
          name="message"
          rows={5}
          required
          placeholder={copy.contact.fields.messagePlaceholder}
          aria-invalid={errors.message ? "true" : undefined}
          aria-describedby={errors.message ? "message-error" : undefined}
          className={cn(field, "resize-y", errors.message && "border-accent")}
        />
        {errors.message ? (
          <p id="message-error" role="alert" className="mt-1.5 text-sm text-accent">{errors.message}</p>
        ) : null}
      </div>

      {status === "failed" ? (
        <p role="alert" className="rounded-brand border border-accent/40 bg-accent/5 p-4 text-sm text-ink">
          {copy.contact.error}
        </p>
      ) : null}

      <Button type="submit" size="lg" disabled={status === "sending"}>
        {status === "sending" ? copy.contact.fields.submitting : copy.contact.fields.submit}
      </Button>
    </form>
  );
}
