import Link from "next/link";
import { copy } from "@/content/copy";
import { Container } from "@/components/ui/Container";
import { Icon } from "@/components/ui/Icon";
import { cn } from "@/lib/utils";

/**
 * A horizontally scrolling row of cards, with a heading and a way through.
 *
 * One primitive, three uses — service categories, themes and occasions — for a
 * reason that showed up in measurement rather than taste. The home page was
 * 13,460px tall and saying the same things three times: a chip for every
 * service and occasion at the top, then a rail per service, then a 1,199px
 * occasions grid and a 1,992px themes grid repeating both, with six of those
 * themes already in the hero. Themes alone were fifteen per cent of the page.
 *
 * A wrapped grid grows with its content; a rail does not. Turning the two
 * grids into rails removes about two thousand pixels without removing a single
 * card, which is the version of "show the customer everything" that someone
 * actually reaches the bottom of.
 *
 * The row scrolls rather than wraps, and every card is a link, so tabbing moves
 * through them and the browser scrolls them into view. No tab stop on the
 * container, no keyboard trap.
 */
export function Rail({
  id,
  title,
  href,
  linkLabel,
  items,
  count,
  tone = "default",
}: {
  id: string;
  title: string;
  /** Where "all of these" goes. */
  href: string;
  linkLabel: string;
  items: { key: string; content: React.ReactNode }[];
  /** Shown beside the link. Omit where a count would say nothing useful. */
  count?: string;
  tone?: "default" | "muted";
}) {
  if (!items.length) return null;

  return (
    <section
      aria-labelledby={id}
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
            {count ? <p className="text-sm text-ink-muted">{count}</p> : null}
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
          scrollable row is expected to. */}
      <div className="mt-6 overflow-x-auto pb-2 [scrollbar-width:thin]">
        <ul
          className="flex snap-x snap-mandatory gap-5 px-5 sm:px-6 lg:px-8"
          style={{ scrollPaddingInline: "1.25rem" }}
        >
          {items.map((item) => (
            <li key={item.key} className="w-[17rem] shrink-0 snap-start sm:w-[19rem]">
              {item.content}
            </li>
          ))}
        </ul>
      </div>

      {items.length > 2 ? (
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
