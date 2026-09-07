import { site, whatsappLink } from "@/content/site";
import { copy } from "@/content/copy";
import { pageMetadata } from "@/lib/seo";
import { Section, SectionHeading } from "@/components/ui/Section";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import { Icon } from "@/components/ui/Icon";
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

        <div className="mt-12 grid gap-10 lg:grid-cols-[1fr_1.2fr] lg:gap-16">
          <div className="space-y-4">
            <a
              href={whatsappLink()}
              data-conversion="whatsapp_click"
              target="_blank"
              rel="noopener noreferrer"
              className="flex gap-4 rounded-brand-lg border border-line bg-surface p-6 transition-colors hover:border-accent/40"
            >
              <Icon name="whatsapp" className="mt-0.5 h-5 w-5 shrink-0 text-accent" />
              <span>
                {/* The number is shown, not just the word. Calls and WhatsApp
                    go to different lines here, and someone saving one of them
                    to their phone needs to know which they saved. */}
                <span className="block font-semibold text-primary">{site.whatsappDisplay}</span>
                <span className="mt-1 block text-sm leading-relaxed text-ink-muted">
                  {copy.contact.whatsappBody}
                </span>
              </span>
            </a>

            <a
              href={`tel:${site.phoneHref}`}
              className="flex gap-4 rounded-brand-lg border border-line bg-surface p-6 transition-colors hover:border-accent/40"
            >
              <Icon name="phone" className="mt-0.5 h-5 w-5 shrink-0 text-accent" />
              <span>
                <span className="block font-semibold text-primary">{site.phone}</span>
                <span className="mt-1 block text-sm leading-relaxed text-ink-muted">
                  {copy.contact.callBody}
                </span>
              </span>
            </a>

            <div className="rounded-brand-lg border border-line bg-muted p-6">
              <h2 className="flex items-center gap-2 font-semibold text-primary">
                <Icon name="clock" className="h-4 w-4 text-accent" />
                {copy.contact.hoursTitle}
              </h2>
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
