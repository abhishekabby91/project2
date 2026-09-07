"use client";

import { useCallback, useMemo, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { copy } from "@/content/copy";
import { site, whatsappLink } from "@/content/site";
import type { DecorPackage } from "@/content/types";
import {
  activeFilterCount,
  catalogHref,
  filterPackages,
  optionCounts,
  parseCatalogQuery,
  sanitizeFilters,
  sortPackages,
  SORT_KEYS,
  type BudgetBand,
  type CatalogFilters,
  type FilterKey,
  type SortKey,
} from "@/lib/catalog";
import { PackageCard } from "@/components/cards/Cards";
import { Button } from "@/components/ui/Button";
import { Icon } from "@/components/ui/Icon";
import { cn } from "@/lib/utils";

/**
 * The catalog browser.
 *
 * Every competitor in this market gives you a filter rail — occasion, budget,
 * city — because nobody scrolls a hundred setups looking for the one that fits
 * a ten-thousand-rupee budget in Faridabad. The catalog here is smaller than
 * theirs, so the rail matters less today and a great deal more the day it isn't.
 *
 * Two things are deliberate:
 *
 *  • The filters are radio inputs, not styled buttons pretending to be. Arrow
 *    keys, grouping and the announced state all come free and correct.
 *  • State lives in the query string, so a narrowed view is a link. This market
 *    shares links in WhatsApp; a filter that cannot be sent is half a filter.
 *
 * The unfiltered grid is server-rendered by the page underneath this component,
 * so the catalog is fully readable and crawlable with no JavaScript at all.
 */

export interface CatalogOption {
  slug: string;
  label: string;
}

export interface CatalogBrowserProps {
  packages: DecorPackage[];
  budgetBands: BudgetBand[];
  options: Record<Exclude<FilterKey, "budget">, CatalogOption[]>;
  /** Total cities served, so a package covering all of them can say so. */
  cityCount: number;
  headingLevel?: 3 | 4;
}

export function CatalogBrowser({
  packages,
  budgetBands,
  options,
  cityCount,
  headingLevel = 3,
}: CatalogBrowserProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [panelOpen, setPanelOpen] = useState(false);

  const groups = useMemo(
    () =>
      [
        { key: "occasion" as const, items: options.occasion },
        { key: "budget" as const, items: budgetBands.map((b) => ({ slug: b.slug, label: b.label })) },
        { key: "service" as const, items: options.service },
        { key: "theme" as const, items: options.theme },
        { key: "city" as const, items: options.city },
      ].filter((g) => g.items.length > 1),
    [options, budgetBands],
  );

  const { filters, sort } = useMemo(() => {
    const parsed = parseCatalogQuery(searchParams);
    const valid = Object.fromEntries(
      groups.map((g) => [g.key, g.items.map((i) => i.slug)]),
    ) as Partial<Record<FilterKey, string[]>>;
    return { filters: sanitizeFilters(parsed.filters, valid), sort: parsed.sort };
  }, [searchParams, groups]);

  const results = useMemo(
    () => sortPackages(filterPackages(packages, filters, budgetBands), sort),
    [packages, filters, budgetBands, sort],
  );

  const counts = useMemo(() => {
    const map = {} as Record<FilterKey, Record<string, number>>;
    for (const group of groups) {
      const slugs = group.items.map((i) => i.slug);
      map[group.key] = optionCounts(packages, filters, budgetBands, group.key, slugs);
    }
    return map;
  }, [groups, packages, filters, budgetBands]);

  const apply = useCallback(
    (next: CatalogFilters, nextSort: SortKey) => {
      // `replace` rather than `push`: filtering is not navigation, and forty
      // taps on chips should not mean forty presses of the back button.
      router.replace(catalogHref(next, nextSort, pathname), { scroll: false });
    },
    [router, pathname],
  );

  const setFilter = (key: FilterKey, value: string) => {
    const next: CatalogFilters = { ...filters };
    if (value) next[key] = value;
    else delete next[key];
    apply(next, sort);
  };

  const clearAll = () => apply({}, sort);
  const active = activeFilterCount(filters);

  return (
    <div className="mt-10 grid gap-8 lg:grid-cols-[16rem_1fr] lg:gap-10">
      {/* ── Filter rail ────────────────────────────────────────────────── */}
      <div className="lg:sticky lg:top-24 lg:self-start">
        <div className="flex items-center justify-between gap-3 lg:hidden">
          <button
            type="button"
            aria-expanded={panelOpen}
            aria-controls="catalog-filters"
            onClick={() => setPanelOpen((v) => !v)}
            className="inline-flex items-center gap-2 rounded-brand border border-line bg-surface px-4 py-2.5 text-sm font-semibold text-primary"
          >
            <Icon name="sparkle" className="h-4 w-4 text-accent" />
            {panelOpen ? copy.catalog.hideFilters : copy.catalog.showFilters}
            {active ? (
              <span className="inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-accent px-1.5 text-xs font-semibold text-accent-fg">
                {active}
              </span>
            ) : null}
          </button>
          {active ? (
            <button
              type="button"
              onClick={clearAll}
              className="whitespace-nowrap text-sm font-semibold text-accent underline underline-offset-4"
            >
              {copy.catalog.clear}
            </button>
          ) : null}
        </div>

        <div
          id="catalog-filters"
          className={cn(
            "mt-4 rounded-brand-lg border border-line bg-surface p-5 lg:mt-0 lg:block",
            panelOpen ? "block" : "hidden",
          )}
        >
          <div className="hidden items-baseline justify-between gap-3 border-b border-line pb-4 lg:flex">
            <h2 className="text-sm font-semibold uppercase tracking-[0.12em] text-ink-muted">
              {copy.catalog.filtersTitle}
            </h2>
            {active ? (
              <button
                type="button"
                onClick={clearAll}
                className="whitespace-nowrap text-sm font-semibold text-accent underline underline-offset-4"
              >
                {copy.catalog.clear}
              </button>
            ) : null}
          </div>

          <div className="divide-y divide-line">
            {groups.map((group) => (
              <fieldset key={group.key} className="py-5 last:pb-0">
                <legend className="mb-3 text-sm font-semibold text-primary">
                  {copy.catalog.groups[group.key]}
                </legend>
                <div className="flex flex-wrap gap-2">
                  <Chip
                    name={group.key}
                    value=""
                    label={copy.catalog.anyOption[group.key]}
                    checked={!filters[group.key]}
                    onChange={() => setFilter(group.key, "")}
                  />
                  {group.items.map((item) => {
                    const count = counts[group.key]?.[item.slug] ?? 0;
                    return (
                      <Chip
                        key={item.slug}
                        name={group.key}
                        value={item.slug}
                        label={item.label}
                        count={count}
                        // A chip that leads to an empty grid is still selectable
                        // when it is the one already chosen, so a person can
                        // always see and undo the choice that emptied the page.
                        disabled={count === 0 && filters[group.key] !== item.slug}
                        checked={filters[group.key] === item.slug}
                        onChange={() => setFilter(group.key, item.slug)}
                      />
                    );
                  })}
                </div>
              </fieldset>
            ))}
          </div>
        </div>
      </div>

      {/* ── Results ────────────────────────────────────────────────────── */}
      <div>
        <h2 className="sr-only">{copy.catalog.resultsHeading}</h2>
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-line pb-4">
          <p aria-live="polite" className="text-sm font-medium text-ink">
            {copy.catalog.resultCount(results.length)}
            {active ? (
              <span className="font-normal text-ink-muted">
                {" · "}
                {copy.catalog.activeFilterCount(active)}
              </span>
            ) : null}
          </p>
          <div className="flex items-center gap-2">
            <label htmlFor="catalog-sort" className="text-sm text-ink-muted">
              {copy.catalog.sortLabel}
            </label>
            <select
              id="catalog-sort"
              value={sort}
              onChange={(e) => apply(filters, e.target.value as SortKey)}
              className="rounded-brand border border-line bg-surface px-3 py-2 text-sm font-medium text-primary"
            >
              {SORT_KEYS.map((key) => (
                <option key={key} value={key}>
                  {copy.catalog.sortOptions[key]}
                </option>
              ))}
            </select>
          </div>
        </div>

        {results.length ? (
          <div className="mt-8 grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
            {results.map((pkg) => (
              <PackageCard
                key={pkg.slug}
                pkg={pkg}
                headingLevel={headingLevel}
                cityCount={cityCount}
              />
            ))}
          </div>
        ) : (
          /* Nothing matched. The honest move is to offer the thing that
             actually solves it — a conversation — not a shrug. */
          <div className="mt-8 rounded-brand-lg border border-dashed border-line bg-muted p-8">
            <p className="text-lg font-semibold text-primary">{copy.catalog.empty.title}</p>
            <p className="mt-2 max-w-lg leading-relaxed text-ink-muted">
              {copy.catalog.empty.body}
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Button href={whatsappLink()} external data-conversion="whatsapp_click">
                <Icon name="whatsapp" className="h-4 w-4" />
                {copy.cta.whatsapp}
              </Button>
              <Button variant="secondary" onClick={clearAll}>
                {copy.catalog.empty.reset}
              </Button>
            </div>
            <p className="mt-4 text-sm text-ink-muted">
              <a href={`tel:${site.phoneHref}`} className="font-semibold text-accent">
                {site.phone}
              </a>
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

/**
 * A filter chip. A real radio input underneath, visually hidden — the browser
 * then handles arrow-key movement within the group, the announced role and the
 * checked state, none of which a styled <button> gets for free.
 */
function Chip({
  name,
  value,
  label,
  count,
  checked,
  disabled,
  onChange,
}: {
  name: string;
  value: string;
  label: string;
  count?: number;
  checked: boolean;
  disabled?: boolean;
  onChange: () => void;
}) {
  return (
    <label
      className={cn(
        "inline-flex cursor-pointer items-center gap-1.5 rounded-full border px-3 py-1.5 text-sm transition-colors",
        "has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-2",
        checked
          ? "border-accent bg-accent text-accent-fg font-semibold"
          : "border-line bg-surface text-ink-muted hover:border-accent/40 hover:text-accent",
        disabled && "cursor-not-allowed opacity-40 hover:border-line hover:text-ink-muted",
      )}
    >
      <input
        type="radio"
        name={`filter-${name}`}
        value={value}
        checked={checked}
        disabled={disabled}
        onChange={onChange}
        className="sr-only"
      />
      {label}
      {typeof count === "number" ? (
        <span className={cn("text-xs", checked ? "text-accent-fg/75" : "text-ink-muted/70")}>
          {count}
        </span>
      ) : null}
    </label>
  );
}
