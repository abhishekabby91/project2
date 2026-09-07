import type { Review } from "./types";

/**
 * ⚠️  EMPTY ON PURPOSE. DO NOT WRITE ENTRIES HERE.
 *
 * A review is a statement a named customer made. Writing one for them is
 * fabrication regardless of how plausible it reads, and in India it is also a
 * prohibited unfair trade practice under the Consumer Protection Act and the
 * BIS standard on online reviews (IS 19000:2022). No script can tell an
 * invented quote from a real one — that is exactly why this file stays empty
 * until someone has real ones with permission to publish.
 *
 * To add reviews:
 *   1. Collect them from actual customers, in their words.
 *   2. Get written permission to publish the quote and the name.
 *   3. Paste them here verbatim. Do not tidy the grammar.
 *   4. Sign off `reviews` in content/verification.ts.
 *
 * Every review section on the site hides itself while this array is empty, so
 * shipping without reviews leaves no gap and no placeholder.
 */
export const reviews: Review[] = [];

/** Aggregate rating for schema — null unless there are genuinely enough reviews. */
export const aggregateRating = () => {
  const rated = reviews.filter((r) => typeof r.rating === "number");
  if (rated.length < 5) return null;
  const sum = rated.reduce((total, r) => total + (r.rating as number), 0);
  return { value: Math.round((sum / rated.length) * 10) / 10, count: rated.length };
};
