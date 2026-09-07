import { faqs, faqCategories } from "@/content/faqs";
import { pageMetadata } from "@/lib/seo";
import { faqSchema } from "@/lib/schema";
import { Section, SectionHeading } from "@/components/ui/Section";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import { Cta } from "@/components/sections/Cta";
import { JsonLd } from "@/components/seo/JsonLd";

export const metadata = pageMetadata({
  title: "Frequently Asked Questions",
  description:
    "Booking, pricing, travel charges, setup times, wall safety, teardown and cancellation — answered properly, including the answers people would rather we softened.",
  path: "/faqs",
});

export default function FaqsPage() {
  return (
    <>
      <Breadcrumbs items={[{ name: "FAQs", href: "/faqs" }]} />
      <Section as="div">
        <SectionHeading
          eyebrow="Questions"
          title="Before you book"
          lead="Everything people ask most often, including the limits. If your question is not here, ask on WhatsApp — we will answer it the same way."
          level={1}
        />

        <div className="mt-12 space-y-12">
          {faqCategories.map((category) => (
            <div key={category}>
              <h2 className="text-xl">{category}</h2>
              <div className="mt-5 divide-y divide-line border-y border-line">
                {faqs.filter((f) => f.category === category).map((faq) => (
                  <details key={faq.question} className="group py-1">
                    <summary className="flex cursor-pointer list-none items-start justify-between gap-4 py-4 text-left text-[1.0625rem] font-semibold text-primary">
                      {faq.question}
                      <span
                        aria-hidden="true"
                        className="mt-1 inline-flex h-5 w-5 shrink-0 items-center justify-center text-accent transition-transform group-open:rotate-45"
                      >
                        <svg viewBox="0 0 16 16" className="h-4 w-4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round">
                          <path d="M8 3v10M3 8h10" />
                        </svg>
                      </span>
                    </summary>
                    <div className="pb-5 pr-9 text-[0.9375rem] leading-relaxed text-ink-muted">
                      {faq.answer}
                    </div>
                  </details>
                ))}
              </div>
            </div>
          ))}
        </div>
      </Section>
      <Cta />
      <JsonLd data={faqSchema(faqs)} />
    </>
  );
}
