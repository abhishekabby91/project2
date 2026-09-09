import { NextResponse } from "next/server";

/**
 * Enquiry endpoint.
 *
 * ⚠️  BEFORE LAUNCH: set `CONTACT_FORM_WEBHOOK_URL` (and, for a form service
 * such as Web3Forms, `CONTACT_FORM_ACCESS_KEY`). Without one there is nowhere
 * for an enquiry to go, and this endpoint says so rather than accepting it.
 *
 * It used to answer "Thanks — we'll be in touch shortly" and drop the
 * submission on the floor. That is the worst failure this site has: someone
 * planning their child's first birthday leaves their number, is told they will
 * be called, and nobody ever calls. It cannot be seen from the outside, and the
 * business only learns about it as silence it reads as no demand.
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

/**
 * Shown whenever the enquiry cannot be delivered, whatever the reason. Names
 * the alternatives rather than apologising: a visitor who is about to give up
 * needs a next step, not a status code.
 */
const UNDELIVERABLE =
  "We couldn't deliver your enquiry. Please WhatsApp or call us and we'll take the details directly.";

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

  /**
   * The phone number is the only requirement, and it is required because it is
   * the reply route — a submission we cannot answer is not a lead. Name and a
   * written description used to be mandatory too; asking someone to compose a
   * paragraph before you will accept their enquiry loses more bookings than
   * the paragraph was ever worth. Whatever is missing gets asked on WhatsApp.
   *
   * Kept in step with the client, which applies the same phone rule for speed
   * and no others.
   */
  const invalid: string[] = [];
  if (!PHONE.test(submission.phone.replace(/[\s-]/g, ""))) invalid.push("phone");
  if (submission.email && !EMAIL.test(submission.email)) invalid.push("email");

  if (invalid.length) {
    return NextResponse.json(
      { ok: false, message: "Please check the highlighted fields and try again.", fields: invalid },
      { status: 422 },
    );
  }

  const webhook = process.env.CONTACT_FORM_WEBHOOK_URL;

  /**
   * No delivery route configured. Refuse, and hand over the two channels that
   * do work — both are answered by a person, which is more than this form can
   * say right now.
   *
   * Deliberately the same response as a delivery failure below: from the
   * visitor's side the situation is identical, and the distinction is ours to
   * fix, not theirs to understand.
   */
  if (!webhook) {
    console.error(
      "[contact] CONTACT_FORM_WEBHOOK_URL is not set — an enquiry was refused rather " +
        "than silently discarded. Set it, or the form cannot take a booking.",
    );
    return NextResponse.json({ ok: false, message: UNDELIVERABLE }, { status: 503 });
  }

  try {
    const { website: _honeypot, ...rest } = submission;

    // Only what was actually given. Every field but the phone number is now
    // optional, and an empty string is not the same as a blank: a form service
    // reads `email` as the reply-to address, and "" is a value it can reject.
    const forwarded = Object.fromEntries(Object.entries(rest).filter(([, v]) => v !== ""));

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
      // Both may now be empty, and a subject line reading "Enquiry from "
      // helps nobody triaging an inbox. The number always exists.
      name: submission.name || submission.phone,
      ...(submission.email ? { email: submission.email } : {}),
      subject: `Enquiry from ${submission.name || submission.phone}${
        submission.city ? ` (${submission.city})` : ""
      }`,
      message: [
        submission.message || "No details given — ask on WhatsApp.",
        "",
        `Name: ${submission.name || "Not given"}`,
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
    return NextResponse.json({ ok: false, message: UNDELIVERABLE }, { status: 502 });
  }

  return NextResponse.json({ ok: true, message: "Thanks — we'll be in touch shortly." });
}
