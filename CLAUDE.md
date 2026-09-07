# CLAUDE.md

Guidance for working in this repository — HappyArc, a balloon and party
decoration site for Delhi NCR.

## What this is

A Next.js site for a decoration business operating in Delhi, Gurugram, Noida,
Greater Noida and Faridabad. It shares its architecture with a white-label CPA
template: everything business-specific lives in `content/*.ts`, and `src/` is
generic machinery that renders whatever is in there.

Read [README.md](README.md) for the routing model and why it is shaped this way.

## The one rule that matters

**Never edit `src/` to change something about the business.**

If a price, a place, a service, a theme or a sentence needs to change, it
changes in `content/`. `src/` only changes when the *behaviour* changes.

| You want to change | It goes in |
| --- | --- |
| Any wording outside the catalog | `content/copy.ts` |
| Brand, colours, phone, WhatsApp, address, nav | `content/site.ts` |
| Cities, localities, what booking there involves | `content/cities.ts` |
| Services, occasions, themes | the matching `content/*.ts` |
| Packages, prices, what's included and excluded | `content/packages.ts` |
| Questions and answers | `content/faqs.ts` |
| Cookie disclosures | `content/privacy.ts` |

Run `npm run check:upstream` to see how far this has drifted from the template
it was forked from.

## Commands

```bash
npm run dev            # local development
npm run build          # production build — must pass before any handover
npm run typecheck      # tsc --noEmit
npm run check:content  # placeholders, leftovers, doorway pages, catalog, sign-off
npm run qa             # accessibility, consent, interaction — against a running site
npm run check:upstream # drift from the template
```

`npm run check:content` **fails right now, by design.** The contact details are
placeholders and nothing in `content/verification.ts` is signed off. That is the
correct state for a site that has not been handed real information yet.

## Content rules

This site makes commercial promises to people planning a wedding anniversary or
their child's first birthday. Some things must never be invented, however
convenient it would be.

**If you are here to "fill in the content" and you do not have the business's
real information, stop and ask for it.** Plausible prices, service areas and
reviews are the most damaging thing that can be done to this repository.
`npm run check:content` cannot catch them — an invented price and a real one are
identical in source — which is why `content/verification.ts` requires a named
person to sign off each class of claim. **Do not fill that file in yourself.**

The specifics:

- **Prices.** Every figure in `packages.ts` is currently a market-derived
  starting point, not the business's own. Publishing one unchanged advertises a
  price the owner has not agreed to honour. Replace them, then sign off
  `pricing`.
- **Service areas.** The localities in `cities.ts` are real places; that
  HappyArc will *travel* to them is not yet established. Coverage is a promise
  to someone who cannot rebook if you miss. Confirm with whoever dispatches the
  team, delete what they won't reach, sign off `locations`.
- **Reviews.** `content/reviews.ts` is empty and must stay empty until there are
  real quotes with written permission to publish. Writing one is fabrication,
  and in India also a prohibited unfair trade practice under the Consumer
  Protection Act (and IS 19000:2022). Every review section hides itself while
  the array is empty, so there is no gap to fill.
- **Photographs.** `images: []` on every package is deliberate. Stock photos of
  someone else's setups are the fastest way to lose a customer at the door. Only
  photographs of setups this team actually built go in, with alt text that
  describes the setup.
- **Policies.** Deposit, cancellation, travel charges and rescheduling terms in
  `faqs.ts` must match what the business actually does. Two FAQ answers describe
  limits rather than benefits — the travel charge and the cancellation window.
  Those are the answers that prevent a dispute on the day. Do not soften them.
- **Trust points.** The four figures in `site.ts` are `PLACEHOLDER`. Replace
  with something substantiable or delete them.
- **Licensed characters.** Competitors publish pages for named cartoon and film
  characters. Those are registered trademarks and selling a service under them
  is trademark use, not fan art. Themes here are descriptive for that reason.
  Adding a licensed one is the owner's commercial decision to take with their
  own legal advice — not a default to copy because a competitor did it.

Legal pages ship as drafts with visible notices. They go to a lawyer, and the
notices come out only after review.

## The doorway-page rule

Six services across five cities is thirty pages. Generated from a template,
those are doorway pages — Google has demoted the pattern since 2015, and it is
the specific way this vertical goes wrong.

A service × city page only generates when the city carries genuinely local
content: **at least 3 localities and 2 `localNotes`**. The gate lives in three
places and they must stay in step:

- `src/app/[service]/[city]/page.tsx` — `pairIsSubstantive()`, calls `notFound()`
- `src/app/sitemap.ts` — same predicate, so nothing thin is ever submitted
- `scripts/check-content.mjs` — asserts the thresholds, and additionally fails
  when two cities share a `localNote` that differs only by the place name

If you add a city, write real notes about what booking there actually involves.
Not adjectives — the gate pass, the lift, the border crossing, the drive.

## Conventions

- Semantic design tokens only (`bg-primary`, `text-accent`, `border-line`,
  `rounded-brand`). A raw Tailwind palette colour stops responding to the theme
  in `site.ts`.
- Page metadata goes through `pageMetadata()` in `src/lib/seo.ts`, which returns
  `title.absolute`. Don't add a second brand suffix.
- Structured-data builders in `src/lib/schema.ts` omit what the content doesn't
  support. `aggregateRating` stays absent until there are at least five real
  ratings. Never add review counts or price ranges that aren't real.
- Card components take a `headingLevel` so the document outline stays correct —
  pass `2` when a grid sits directly under the page `h1`.
- Icons are an inline set in `src/components/ui/Icon.tsx`. Add a key there and to
  `IconName` in `content/types.ts` rather than pulling in an icon package.
- Prices render through `formatPrice()` in `site.ts` (Indian digit grouping).
  Never hardcode a rupee figure in a component.
- **Never load a third-party script outside the consent gate.** Consent Mode v2
  boots denied in `<head>` before gtag.js; a `<Script>` that bypasses it makes
  the site non-compliant silently. `npm run qa` asserts that no measurement
  request leaves the browser before the visitor chooses.

## Before handing this site over

```bash
npm run check:content && npm run typecheck && npm run build && npm run qa
```

`check:content` will keep failing until `content/verification.ts` is signed off.
That is deliberate: it forces a conversation with the owner, who is the only
person who can substantiate a price, a service area or a photograph.
