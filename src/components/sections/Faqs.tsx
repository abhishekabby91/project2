import { Section, SectionHeading } from "@/components/ui/Section";
import type { FaqItem } from "@/content/types";

/**
 * FAQ accordion built on <details>, so every answer is in the DOM and
 * crawlable while collapsed, and the whole thing works without JavaScript.
 */
export function Faqs({
  items,
  eyebrow,
  title,
  lead,
  headingLevel = 2,
}: {
  items: FaqItem[];
  eyebrow?: string;
  title: string;
  lead?: string;
  headingLevel?: 2 | 3;
}) {
  if (!items.length) return null;
  const id = "faq-heading";

  return (
    <Section tone="muted" ariaLabelledBy={id}>
      <SectionHeading eyebrow={eyebrow} title={title} lead={lead} level={headingLevel} id={id} />
      <div className="mt-10 divide-y divide-line border-y border-line">
        {items.map((faq) => (
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
    </Section>
  );
}
