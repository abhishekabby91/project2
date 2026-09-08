import Link from "next/link";
import { services } from "@/content/services";
import { occasions } from "@/content/occasions";
import { copy } from "@/content/copy";
import { Section, SectionHeading } from "@/components/ui/Section";
import { Icon } from "@/components/ui/Icon";

/**
 * Everything on offer, in one strip, directly under the hero.
 *
 * A visitor who lands here should be able to see the whole range before
 * scrolling — the competitors all put a category bar at the top for exactly
 * that reason. Services and occasions are two ways of asking the same
 * question ("what do you do" and "what am I celebrating"), so both are here
 * and both are one tap away.
 */
export function BrowseNav() {
  return (
    <Section ariaLabelledBy="browse-heading" className="!py-12 sm:!py-14">
      <SectionHeading
        eyebrow={copy.browse.navEyebrow}
        title={copy.browse.navTitle}
        lead={copy.browse.navLead}
        id="browse-heading"
      />

      <ul className="mt-8 flex flex-wrap gap-3">
        {services.map((service) => (
          <li key={service.slug}>
            <Link
              href={`/${service.slug}`}
              className="inline-flex min-h-6 items-center gap-2 rounded-brand border border-line bg-surface px-4 py-2.5 text-[0.9375rem] font-medium text-primary transition-colors hover:border-accent/40 hover:text-accent"
            >
              <Icon name={service.icon} className="h-4 w-4 shrink-0 text-accent" />
              {service.name}
            </Link>
          </li>
        ))}
      </ul>

      <ul className="mt-3 flex flex-wrap gap-2.5">
        {occasions.map((occasion) => (
          <li key={occasion.slug}>
            <Link
              href={`/occasions/${occasion.slug}`}
              className="inline-flex min-h-6 items-center gap-1.5 rounded-full border border-line bg-surface px-3.5 py-2 text-sm text-ink-muted transition-colors hover:border-accent/40 hover:text-accent"
            >
              <Icon name={occasion.icon} className="h-3.5 w-3.5 shrink-0 text-accent" />
              {occasion.name}
            </Link>
          </li>
        ))}
        <li>
          <Link
            href="/packages"
            className="inline-flex min-h-6 items-center rounded-full px-3 py-2 text-sm font-semibold text-accent underline underline-offset-4"
          >
            {copy.browse.showAllCategories}
          </Link>
        </li>
      </ul>
    </Section>
  );
}
