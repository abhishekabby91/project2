import Link from "next/link";
import { packages, budgetBands } from "@/content/packages";
import { formatPrice } from "@/content/site";
import { copy } from "@/content/copy";
import { Icon } from "@/components/ui/Icon";
import { catalogHref, filterPackages } from "@/lib/catalog";

/**
 * Browse by budget.
 *
 * The competitors all have this and they are right to: most people arriving
 * here have a number in their head before they have a theme, and a catalog that
 * cannot be entered at that number makes them guess. Each band shows how many
 * setups are actually in it and what the cheapest one costs, so the entry point
 * is not a promise the catalog then breaks.
 *
 * Counted from the catalog rather than written down, so a band that empties
 * disappears instead of leading somewhere blank.
 *
 * Renders as a block, not a Section — it belongs inside whichever section is
 * already talking about price, and a section of its own would invert the tone
 * alternation of every section below it.
 */
export function BudgetBands({ headingLevel = 3 }: { headingLevel?: 2 | 3 }) {
  const bands = budgetBands
    .map((band) => ({
      band,
      matches: filterPackages(packages, { budget: band.slug }, budgetBands),
    }))
    .filter(({ matches }) => matches.length > 0);

  if (bands.length < 2) return null;

  const Heading = `h${headingLevel}` as "h2" | "h3";

  return (
    <div className="mt-10">
      <Heading className="text-[1.375rem] leading-snug sm:text-2xl">
        {copy.catalog.browseByBudgetTitle}
      </Heading>
      <p className="mt-3 max-w-2xl leading-relaxed text-ink-muted">
        {copy.catalog.browseByBudgetLead}
      </p>
      <ul className="mt-8 grid gap-4 sm:grid-cols-3">
        {bands.map(({ band, matches }) => {
          const from = Math.min(...matches.map((p) => p.priceFrom));
          return (
            <li key={band.slug}>
              <Link
                href={catalogHref({ budget: band.slug })}
                className="group flex h-full items-center gap-4 rounded-brand-lg border border-line bg-surface p-5 transition-[border-color,box-shadow,transform] duration-200 hover:-translate-y-0.5 hover:border-accent/40 hover:shadow-raised"
              >
                <span
                  aria-hidden="true"
                  className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-brand bg-accent/10 text-accent"
                >
                  <Icon name="rupee" className="h-5 w-5" />
                </span>
                <span className="min-w-0">
                  <span className="block font-semibold leading-snug text-primary">{band.label}</span>
                  <span className="mt-1 block text-sm text-ink-muted">
                    {copy.catalog.budgetBandCount(matches.length)}
                    {" · "}
                    {copy.packages.priceFromLabel.toLowerCase()} {formatPrice(from)}
                  </span>
                </span>
                <svg
                  aria-hidden="true"
                  viewBox="0 0 16 16"
                  className="ml-auto h-4 w-4 shrink-0 text-accent transition-transform group-hover:translate-x-0.5"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.6"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M6 3.5 10.5 8 6 12.5" />
                </svg>
              </Link>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
