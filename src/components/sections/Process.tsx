import { Section, SectionHeading } from "@/components/ui/Section";
import { Icon } from "@/components/ui/Icon";
import { copy } from "@/content/copy";
import { process } from "@/content/process";

/** How a booking runs, start to finish. Four steps, no jargon. */
export function Process() {
  return (
    <Section ariaLabelledBy="process-heading">
      <SectionHeading
        eyebrow={copy.home.processEyebrow}
        title={copy.home.processTitle}
        lead={copy.home.processLead}
        id="process-heading"
      />
      <ol className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
        {process.map((step) => (
          <li key={step.number} className="relative">
            <span aria-hidden="true" className="mb-5 inline-flex h-11 w-11 items-center justify-center rounded-brand bg-primary text-primary-fg">
              <Icon name={step.icon} className="h-5 w-5" />
            </span>
            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-accent">
              Step {step.number}
            </p>
            <h3 className="mt-2 text-lg leading-snug">{step.title}</h3>
            <p className="mt-2 text-sm leading-relaxed text-ink-muted">{step.description}</p>
          </li>
        ))}
      </ol>
    </Section>
  );
}
