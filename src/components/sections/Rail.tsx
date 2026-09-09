"use client";

import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
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
  const scroller = useRef<HTMLDivElement>(null);
  const [controls, setControls] = useState({ show: false, atStart: true, atEnd: false });

  const measure = useCallback(() => {
    const el = scroller.current;
    if (!el) return;
    const slack = el.scrollWidth - el.clientWidth;
    setControls({
      /*
       * Only for a pointer that cannot swipe.
       *
       * The rails were measured after they shipped: on a 1440px desktop the
       * themes row hid 1,812px of itself — six of ten themes — and a mouse
       * wheel scrolls vertically, so there was no way to reach them. The swipe
       * hint below is `lg:hidden`, which is right for a hint about swiping and
       * wrong as the only affordance. A touch device already has the gesture;
       * a mouse needs a button.
       */
      show: slack > 8 && window.matchMedia("(hover: hover) and (pointer: fine)").matches,
      atStart: el.scrollLeft <= 4,
      atEnd: el.scrollLeft >= slack - 4,
    });
  }, []);

  useEffect(() => {
    const el = scroller.current;
    if (!el) return;
    measure();
    // Catches the viewport resize that turns a row that fitted into one that
    // doesn't, and the reverse.
    const observer = new ResizeObserver(measure);
    observer.observe(el);
    el.addEventListener("scroll", measure, { passive: true });
    return () => {
      observer.disconnect();
      el.removeEventListener("scroll", measure);
    };
  }, [measure]);

  const page = (direction: 1 | -1) => {
    const el = scroller.current;
    if (!el) return;
    const card = el.querySelector("li");
    const step = card ? card.getBoundingClientRect().width + 20 : el.clientWidth * 0.8;
    el.scrollBy({
      // Two cards a press: far enough to feel like progress, short enough to
      // keep your place in the row.
      left: direction * step * 2,
      behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth",
    });
  };

  if (!items.length) return null;

  return (
    <section
      aria-labelledby={id}
      className={cn("py-10 sm:py-12", tone === "muted" ? "bg-muted" : "bg-canvas")}
    >
      <Container size="wide">
        {/* min-h-9 reserves the controls' height, so the row that renders
            before hydration is the same height as the one after it. */}
        <div className="flex min-h-9 flex-wrap items-center justify-between gap-x-6 gap-y-2">
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
              <Icon name="chevron" className="h-4 w-4" strokeWidth={2.25} />
            </Link>
            {controls.show ? (
              <div className="flex items-center gap-1.5">
                <ScrollButton
                  label={copy.browse.scrollBack}
                  disabled={controls.atStart}
                  onClick={() => page(-1)}
                  back
                />
                <ScrollButton
                  label={copy.browse.scrollForward}
                  disabled={controls.atEnd}
                  onClick={() => page(1)}
                />
              </div>
            ) : null}
          </div>
        </div>
      </Container>

      {/* Full-bleed so the row runs to the screen edge on a phone, the way a
          scrollable row is expected to. */}
      <div ref={scroller} className="mt-6 overflow-x-auto pb-2 [scrollbar-width:thin]">
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

/**
 * Hidden from assistive technology on purpose.
 *
 * Nothing in the row is hidden from the keyboard — every card is a link, so Tab
 * reaches all of them and the browser scrolls each into view. These buttons
 * duplicate that for a mouse, and announcing them would put two redundant stops
 * in front of every rail on the page. Same treatment as the swipe hint.
 */
function ScrollButton({
  label,
  disabled,
  onClick,
  back = false,
}: {
  label: string;
  disabled: boolean;
  onClick: () => void;
  back?: boolean;
}) {
  return (
    <button
      type="button"
      aria-hidden="true"
      tabIndex={-1}
      title={label}
      disabled={disabled}
      onClick={onClick}
      className={cn(
        "inline-flex h-9 w-9 items-center justify-center rounded-full border border-line bg-surface text-primary transition-colors",
        disabled ? "cursor-default opacity-30" : "hover:border-accent/40 hover:text-accent",
      )}
    >
      <Icon name="chevron" className={cn("h-4 w-4", back && "rotate-180")} strokeWidth={2.25} />
    </button>
  );
}
