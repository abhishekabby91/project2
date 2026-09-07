import { NextResponse } from "next/server";

/**
 * Enquiry endpoint.
 *
 * ⚠️  BEFORE LAUNCH: set `CONTACT_FORM_WEBHOOK_URL` (and, for a form service
 * such as Web3Forms, `CONTACT_FORM_ACCESS_KEY`). Without a webhook the
 * submission is validated and then goes nowhere — loud in development, silent
 * in production, and the reason to test this before pointing any advertising
 * at the form.
 *
 * Nothing here is logged with the submission body attached: an enquiry carries
 * a phone number and a home address, and those do not belong in application
 * logs.
 */
export const runtime = "nodejs";

interface Submission {
  name: string;
  phone: string;
  email: string;
  city: string;
  date: string;
  occasion: string;
  message: string;
  website: string;
}

const MAX_LENGTHS: Record<keyof Submission, number> = {
  name: 100,
  phone: 24,
  email: 254,
  city: 60,
  date: 20,
  occasion: 60,
  message: 4000,
  website: 200,
};

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

/**
 * Control characters, which could otherwise forge lines in a downstream log or
 * an email header. Replaced with a space rather than stripped, so words do not
 * silently run together.
 */
const CONTROL_CHARS = /[\u0000-\u001F\u007F]/g;

function clean(value: unknown, max: number) {
  if (typeof value !== "string") return "";
  return value.replace(CONTROL_CHARS, " ").trim().slice(0, max);
}

/** Indian mobile numbers, with or without +91 and with spaces or dashes. */
const PHONE = /^(\+?91)?[6-9]\d{9}$/;

export async function POST(request: Request) {
  let payload: unknown;
  try {
    payload = await request.json();
  } catch {
    return NextResponse.json({ ok: false, message: "Invalid request." }, { status: 400 });
  }

  const body = (payload ?? {}) as Record<string, unknown>;
  const submission: Submission = {
    name: clean(body.name, MAX_LENGTHS.name),
    phone: clean(body.phone, MAX_LENGTHS.phone),
    email: clean(body.email, MAX_LENGTHS.email),
    city: clean(body.city, MAX_LENGTHS.city),
    date: clean(body.date, MAX_LENGTHS.date),
    occasion: clean(body.occasion, MAX_LENGTHS.occasion),
    message: clean(body.message, MAX_LENGTHS.message),
    website: clean(body.website, MAX_LENGTHS.website),
  };

  // Honeypot: answer as though it worked, so the bot does not learn to adapt.
  if (submission.website) {
    return NextResponse.json({ ok: true, message: "Thanks — we'll be in touch." });
  }

  const invalid: string[] = [];
  if (!submission.name) invalid.push("name");
  if (!PHONE.test(submission.phone.replace(/[\s-]/g, ""))) invalid.push("phone");
  if (submission.email && !EMAIL.test(submission.email)) invalid.push("email");
  if (submission.message.length < 10) invalid.push("message");

  if (invalid.length) {
    return NextResponse.json(
      { ok: false, message: "Please check the highlighted fields and try again.", fields: invalid },
      { status: 422 },
    );
  }

  const webhook = process.env.CONTACT_FORM_WEBHOOK_URL;
  if (webhook) {
    try {
      const { website: _honeypot, ...forwarded } = submission;

      /**
       * Form services (Web3Forms, Formspree, FormSubmit) authenticate with an
       * access key in the payload and render `name`/`email`/`subject`/`message`
       * as the notification email. Sending those alongside the raw fields means
       * a readable email whichever service is wired up, and a plain webhook
       * still receives everything.
       *
       * The key stays server-side: the browser posts here, not to the form
       * service, which also keeps the honeypot and this validation in front of
       * it.
       */
      const accessKey = process.env.CONTACT_FORM_ACCESS_KEY;
      const outbound = {
        // Raw fields first — the composed values below must win, or the
        // notification email loses the date, city and occasion.
        ...forwarded,
        ...(accessKey ? { access_key: accessKey } : {}),
        name: submission.name,
        ...(submission.email ? { email: submission.email } : {}),
        subject: `Enquiry from ${submission.name}${submission.city ? ` (${submission.city})` : ""}`,
        message: [
          submission.message,
          "",
          `Phone: ${submission.phone}`,
          `City: ${submission.city || "Not specified"}`,
          `Date: ${submission.date || "Not specified"}`,
          `Occasion: ${submission.occasion || "Not specified"}`,
        ].join("\n"),
        submittedAt: new Date().toISOString(),
      };

      const response = await fetch(webhook, {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify(outbound),
      });

      // Web3Forms answers 200 with {success:false} on a bad key, so the status
      // code alone is not enough to know the enquiry was delivered.
      if (response.ok) {
        const result = await response.json().catch(() => null);
        if (result && result.success === false) {
          throw new Error(
            `Form service rejected the submission: ${result.message ?? "unknown reason"}`,
          );
        }
      }
      if (!response.ok) throw new Error(`Webhook responded ${response.status}`);
    } catch (error) {
      console.error("[contact] webhook delivery failed:", error);
      return NextResponse.json(
        {
          ok: false,
          message:
            "We couldn't deliver your enquiry. Please WhatsApp or call us and we'll take the details directly.",
        },
        { status: 502 },
      );
    }
  } else if (process.env.NODE_ENV !== "production") {
    console.info("[contact] No CONTACT_FORM_WEBHOOK_URL set — validated but not delivered.");
  }

  return NextResponse.json({ ok: true, message: "Thanks — we'll be in touch shortly." });
}
