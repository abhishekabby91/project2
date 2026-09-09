"use client";

import { useEffect, type RefObject } from "react";

/**
 * Reserve the page's bottom edge for a fixed bar.
 *
 * A `position: fixed` bar is out of flow, so the document ends underneath it.
 * On a phone that meant the last 71px of every page sat behind the booking bar
 * with no way to scroll to it — the copyright line and the line naming the
 * cities served, buried on every page of the site, and on a package page from
 * the moment you landed because that bar never waits for a scroll.
 *
 * Measured rather than hardcoded: the two bars are different heights, one of
 * them carries a price whose digits can wrap, and both add
 * env(safe-area-inset-bottom) on a notched phone. A number written down here
 * would be wrong on someone's device the week after it was written.
 *
 * Both bars are `lg:hidden`, so on a desktop the element measures zero and the
 * reservation is zero — no branch needed for it.
 */
export function useStickyBarSpace(ref: RefObject<HTMLElement | null>, active: boolean) {
  useEffect(() => {
    const root = document.documentElement;
    const clear = () => root.style.removeProperty("--sticky-bar-space");

    const el = ref.current;
    if (!active || !el) {
      clear();
      return;
    }

    const apply = () =>
      root.style.setProperty(
        "--sticky-bar-space",
        `${Math.round(el.getBoundingClientRect().height)}px`,
      );

    apply();
    const observer = new ResizeObserver(apply);
    observer.observe(el);
    return () => {
      observer.disconnect();
      clear();
    };
  }, [ref, active]);
}
