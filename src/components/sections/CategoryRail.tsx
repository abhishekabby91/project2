import Link from "next/link";
import { copy } from "@/content/copy";
import { cities } from "@/content/cities";
import type { DecorPackage } from "@/content/types";
import { PackageCard } from "@/components/cards/Cards";
import { Container } from "@/components/ui/Container";
import { Icon } from "@/components/ui/Icon";
import { cn } from "@/lib/utils";

/**
 * One category, as a scrollable row of real setups.
 *
 * This is the pattern every competitor in this market uses on the home page,
 * and the reason is sound: a card that says "Birthday Decoration" asks the
 * visitor to guess what is behind it, while a row of setups with prices on
 * them answers the question on the spot. Someone who came to find out what a
 * birthday costs finds out without clicking.
 *
 * The row scrolls rather than wrapping. Six categories as wrapped grids would
 * be a page nobody reaches the bottom of; six as rows is a page you skim. Each
 * card is a link, so tabbing moves through them and the browser scrolls them
 * into view — no keyboard trap and no extra tab stop on the container.
 *
 * The same setup appearing in more than one rail is not a bug. A balloon arch
 * genuinely is booked for a birthday and for an anniversary, and pretending
 * otherwise would mean publishing two near-identical packages instead of one.
 */
export function CategoryRail({
  title,
  href,
  linkLabel,
  packages,
  id,
  tone = "default",
}: {
  title: string;
  /** The category's own page — the destination for "all of these". */
  href: string;
  linkLabel: string;
  packages: DecorPackage[];
  id: string;
  tone?: "default" | "muted";
}) {
  if (!packages.length) return null;

  return (
    <section
      aria-labelledby={id}
      data-surface={undefined}
      className={cn("py-10 sm:py-12", tone === "muted" ? "bg-muted" : "bg-canvas")}
    >
      <Container size="wide">
        <div className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-2">
          <h2 id={id} className="text-[1.375rem] leading-snug sm:text-2xl">
            <Link href={href} className="transition-colors hover:text-accent">
              {title}
            </Link>
          </h2>
          <div className="flex items-center gap-4">
            <p className="text-sm text-ink-muted">{copy.browse.railCount(packages.length)}</p>
            <Link
              href={href}
              className="inline-flex min-h-6 items-center gap-1.5 text-sm font-semibold text-accent underline-offset-4 hover:underline"
            >
              {linkLabel}
              <svg
                aria-hidden="true"
                viewBox="0 0 16 16"
                className="h-4 w-4"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.6"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M6 3.5 10.5 8 6 12.5" />
              </svg>
            </Link>
          </div>
        </div>
      </Container>

      {/* Full-bleed so the row runs to the screen edge on a phone, the way a
          scrollable row is expected to. The padding keeps the first and last
          card aligned with the container on wide screens. */}
      <div className="mt-6 overflow-x-auto pb-2 [scrollbar-width:thin]">
        <ul
          className="flex snap-x snap-mandatory gap-5 px-5 sm:px-6 lg:px-8 xl:justify-start"
          style={{ scrollPaddingInline: "1.25rem" }}
        >
          {packages.map((pkg) => (
            <li key={pkg.slug} className="w-[17rem] shrink-0 snap-start sm:w-[19rem]">
              <PackageCard pkg={pkg} headingLevel={3} cityCount={cities.length} />
            </li>
          ))}
        </ul>
      </div>

      {packages.length > 2 ? (
        <Container size="wide">
          <p aria-hidden="true" className="mt-1 flex items-center gap-1.5 text-xs text-ink-muted lg:hidden">
            <Icon name="sparkle" className="h-3 w-3" />
            {copy.browse.scrollHint}
          </p>
        </Container>
      ) : null}
    </section>
  );
}
