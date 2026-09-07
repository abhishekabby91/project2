import type { DecorPackage } from "@/content/types";

/**
 * Catalog filtering and sorting.
 *
 * Generic machinery: it knows a package has occasions, themes, services and
 * cities, and that it has a starting price. It knows nothing about which ones
 * exist — those come from `content/`, and the budget bands are passed in for
 * the same reason.
 *
 * Filters live in the query string rather than in component state alone, so a
 * narrowed view is a link someone can send on WhatsApp. That matters more here
 * than it would elsewhere: the whole market shares links in chat.
 */

export const FILTER_KEYS = ["occasion", "theme", "city", "budget", "service"] as const;
export type FilterKey = (typeof FILTER_KEYS)[number];

export type CatalogFilters = Partial<Record<FilterKey, string>>;

export const SORT_KEYS = ["recommended", "priceAsc", "priceDesc", "name"] as const;
export type SortKey = (typeof SORT_KEYS)[number];

export interface BudgetBand {
  slug: string;
  label: string;
  min: number;
  /** Exclusive. `null` means no ceiling. */
  max: number | null;
}

/** Which array on a package each single-select filter matches against. */
const listField: Record<Exclude<FilterKey, "budget">, keyof DecorPackage> = {
  occasion: "occasions",
  theme: "themes",
  city: "cities",
  service: "services",
};

function inBand(price: number, band: BudgetBand) {
  return price >= band.min && (band.max === null || price < band.max);
}

export function filterPackages(
  all: DecorPackage[],
  filters: CatalogFilters,
  bands: BudgetBand[],
): DecorPackage[] {
  return all.filter((pkg) => {
    for (const key of FILTER_KEYS) {
      const value = filters[key];
      if (!value) continue;

      if (key === "budget") {
        const band = bands.find((b) => b.slug === value);
        // An unknown band slug filters nothing out rather than everything —
        // a stale link should degrade to the full catalog, not an empty page.
        if (band && !inBand(pkg.priceFrom, band)) return false;
        continue;
      }

      const field = pkg[listField[key]] as string[];
      if (!field.includes(value)) return false;
    }
    return true;
  });
}

export function sortPackages(list: DecorPackage[], sort: SortKey): DecorPackage[] {
  const sorted = [...list];
  switch (sort) {
    case "priceAsc":
      return sorted.sort((a, b) => a.priceFrom - b.priceFrom);
    case "priceDesc":
      return sorted.sort((a, b) => b.priceFrom - a.priceFrom);
    case "name":
      return sorted.sort((a, b) => a.name.localeCompare(b.name, "en"));
    // "recommended" is the order the catalog is written in, which is the
    // owner's own ordering. Leave it alone.
    default:
      return sorted;
  }
}

export const activeFilterCount = (filters: CatalogFilters) =>
  FILTER_KEYS.reduce((n, key) => (filters[key] ? n + 1 : n), 0);

/** Reads filters and sort out of a query string, ignoring anything unknown. */
export function parseCatalogQuery(params: URLSearchParams | null): {
  filters: CatalogFilters;
  sort: SortKey;
} {
  const filters: CatalogFilters = {};
  if (params) {
    for (const key of FILTER_KEYS) {
      const value = params.get(key);
      if (value) filters[key] = value;
    }
  }
  const raw = params?.get("sort");
  const sort = (SORT_KEYS as readonly string[]).includes(raw ?? "")
    ? (raw as SortKey)
    : "recommended";
  return { filters, sort };
}

/**
 * Drops filter values that are not real options.
 *
 * URLs outlive slugs. A link shared on WhatsApp a year ago, or one carrying a
 * renamed occasion, should land on the whole catalog — the honest answer to a
 * filter we no longer have is "here is everything", not an empty grid reading
 * "nothing matches", which says the catalog is bare when it is the link that
 * is stale.
 */
export function sanitizeFilters(
  filters: CatalogFilters,
  valid: Partial<Record<FilterKey, readonly string[]>>,
): CatalogFilters {
  const clean: CatalogFilters = {};
  for (const key of FILTER_KEYS) {
    const value = filters[key];
    if (value && valid[key]?.includes(value)) clean[key] = value;
  }
  return clean;
}

/** Builds `/packages?occasion=…`, omitting defaults so clean URLs stay clean. */
export function catalogHref(
  filters: CatalogFilters,
  sort: SortKey = "recommended",
  base = "/packages",
): string {
  const params = new URLSearchParams();
  for (const key of FILTER_KEYS) {
    const value = filters[key];
    if (value) params.set(key, value);
  }
  if (sort !== "recommended") params.set("sort", sort);
  const query = params.toString();
  return query ? `${base}?${query}` : base;
}

/**
 * Counts how many packages each option would leave, so an option that leads
 * nowhere can be disabled rather than letting someone tap into an empty grid.
 * Counts are computed against the *other* active filters, the way a shop's
 * facet counts behave.
 */
export function optionCounts(
  all: DecorPackage[],
  filters: CatalogFilters,
  bands: BudgetBand[],
  key: FilterKey,
  optionSlugs: string[],
): Record<string, number> {
  const others: CatalogFilters = { ...filters };
  delete others[key];
  const pool = filterPackages(all, others, bands);

  const counts: Record<string, number> = {};
  for (const slug of optionSlugs) {
    counts[slug] = filterPackages(pool, { [key]: slug }, bands).length;
  }
  return counts;
}
