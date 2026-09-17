import { site, whatsappLink } from "@/content/site";
import { copy } from "@/content/copy";
import { pageMetadata } from "@/lib/seo";
import { Section, SectionHeading } from "@/components/ui/Section";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import { Icon } from "@/components/ui/Icon";
import { cn } from "@/lib/utils";
import type { IconName } from "@/content/types";
import { EnquiryForm } from "@/components/forms/EnquiryForm";

export const metadata = pageMetadata({
  title: "Contact Us",
  description:
    "Send us your date, your city and a photo of the room. WhatsApp is fastest; the form reaches the same place.",
  path: "/contact",
});

export default function ContactPage() {
  return (
    <>
      <Breadcrumbs items={[{ name: "Contact", href: "/contact" }]} />
      <Section as="div">
        <SectionHeading
          eyebrow={copy.contact.eyebrow}
          title={copy.contact.title}
          lead={copy.contact.lead}
          level={1}
        />

        {/*
          The two direct routes come first and get the wider column. A form is
          the slowest way to book a decoration in this market and the least
          certain — the visitor cannot see it arrive, cannot send a photo of the
          room, and waits for a reply on a channel nobody watches. A message or
          a call reaches the people who will do the setup.
        */}
        <div className="mt-12 grid gap-10 lg:grid-cols-[1.15fr_1fr] lg:gap-16">
          <div>
            <h2 className="text-[1.375rem] leading-snug sm:text-2xl">
              {copy.contact.directTitle}
            </h2>
            <p className="mt-3 max-w-xl leading-relaxed text-ink-muted">
              {copy.contact.directLead}
            </p>

            <div className="mt-7 space-y-4">
              <BookingRoute
                href={whatsappLink()}
                external
                primary
                icon="whatsapp"
                label={copy.contact.whatsappTitle}
                /* The number is shown, not just the word. Calls and WhatsApp go
                   to different lines here, and someone saving one of them to
                   their phone needs to know which they saved. */
                value={site.whatsappDisplay}
                body={copy.contact.whatsappBody}
              />
              <BookingRoute
                href={`tel:${site.phoneHref}`}
                icon="phone"
                label={copy.contact.callTitle}
                value={site.phone}
                body={copy.contact.callBody}
              />
            </div>

            <div className="mt-4 rounded-brand-lg border border-line bg-muted p-6">
              <h3 className="flex items-center gap-2 font-semibold text-primary">
                <Icon name="clock" className="h-4 w-4 text-accent" />
                {copy.contact.hoursTitle}
              </h3>
              <dl className="mt-4 space-y-2 text-sm">
                {site.hours.map((row) => (
                  <div key={row.days} className="flex justify-between gap-4">
                    <dt className="text-ink-muted">{row.days}</dt>
                    <dd className="text-right font-medium text-primary">{row.hours}</dd>
                  </div>
                ))}
              </dl>
            </div>
          </div>

          <div>
            <h2 className="text-xl">{copy.contact.formTitle}</h2>
            <p className="mt-2 text-sm leading-relaxed text-ink-muted">{copy.contact.formNote}</p>
            <div className="mt-6">
              <EnquiryForm />
            </div>
          </div>
        </div>
      </Section>
    </>
  );
}

/**
 * One way of reaching the team, as a whole tappable block.
 *
 * The number is on the face of it rather than behind the word "WhatsApp":
 * plenty of people in this market save the number and message later from their
 * own thread, and one they cannot read is one they cannot save.
 *
 * `primary` is the WhatsApp route. It is not decoration — it marks the channel
 * the business actually answers fastest, and the visual weight should say so
 * before the copy has to.
 */
function BookingRoute({
  href,
  icon,
  label,
  value,
  body,
  external = false,
  primary = false,
}: {
  href: string;
  icon: IconName;
  label: string;
  /** The number itself, shown at a size someone can read across a room. */
  value: string;
  body: string;
  external?: boolean;
  primary?: boolean;
}) {
  return (
    <a
      href={href}
      {...(external
        ? { target: "_blank", rel: "noopener noreferrer", "data-conversion": "whatsapp_click" }
        : {})}
      className={cn(
        "flex gap-4 rounded-brand-lg border bg-surface p-6 transition-[border-color,box-shadow,transform] duration-200 hover:-translate-y-0.5 hover:shadow-raised",
        primary ? "border-accent shadow-raised" : "border-line hover:border-accent/40",
      )}
    >
      <span
        aria-hidden="true"
        className={cn(
          "inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-full",
          primary ? "bg-accent text-accent-fg" : "bg-accent/10 text-accent",
        )}
      >
        <Icon name={icon} className="h-5 w-5" />
      </span>
      <span className="min-w-0">
        <span className="block text-xs font-semibold uppercase tracking-[0.12em] text-ink-muted">
          {label}
        </span>
        <span className="mt-1 block font-heading text-xl font-semibold text-primary">{value}</span>
        <span className="mt-2 block text-sm leading-relaxed text-ink-muted">{body}</span>
      </span>
    </a>
  );
}
