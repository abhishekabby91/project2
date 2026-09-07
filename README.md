# HappyArc

Balloon and party decoration across Delhi NCR — Delhi, Gurugram, Noida,
Greater Noida and Faridabad.

Next.js 15 (App Router), React 19, TypeScript, Tailwind v4. 85 static pages.

> **This site is not ready to publish.** Contact details are placeholders,
> prices are market-derived starting points rather than the business's own, and
> nothing in `content/verification.ts` is signed off. `npm run check:content`
> fails until it is. See [CLAUDE.md](CLAUDE.md) for what needs to be confirmed
> and by whom.

## Running it

```bash
npm install
npm run dev
```

## Architecture

Everything about the business lives in `content/`. `src/` is generic machinery
that renders whatever is there — it contains no prices, no place names and no
sentences about HappyArc.

```
content/
  site.ts          brand, contact, theme colours, navigation
  cities.ts        the five NCR cities, their localities and local notes
  services.ts      what the team does — six services
  occasions.ts     why people book — seven occasions
  themes.ts        how it looks — ten themes
  packages.ts      the catalog: prices, inclusions, exclusions, setup times
  copy.ts          every other user-facing string
  faqs.ts          questions and answers
  reviews.ts       empty, and stays empty until there are real ones
  verification.ts  the human sign-off gate
  privacy.ts       cookie categories and disclosures
  redirects.ts     map from the previous site's URLs
```

Re-theming is `site.ts`. Re-voicing is `copy.ts`. Neither touches `src/`.

## Routing

The URL shape follows how this market searches, which is not how a
professional-services site is organised.

| Route | What it is |
| --- | --- |
| `/` | home |
| `/balloon-decoration` | a service, at the top level — not under `/services/` |
| `/balloon-decoration/noida` | service × city, where the search demand is |
| `/themes/unicorn-pastel` | a theme, which is its own demand |
| `/occasions/first-birthday` | an occasion, and what goes wrong at one |
| `/packages/classic-balloon-arch` | a package, with price and exclusions |
| `/cities/gurugram` | a city, and what booking there involves |
| `/gallery`, `/faqs`, `/contact` | supporting pages |
| `/privacy`, `/terms` | legal drafts, with visible notices |

Services sit at the root because people search "balloon decoration in noida",
and the winning competitors put that phrase in a top-level path.

### Why not all 30 service × city pages

Six services across five cities, generated from one template, is thirty pages
that differ by a place name. That is a doorway page, demoted since 2015.

A pairing only generates when the city has **≥3 localities and ≥2 local notes**
— real things about booking there, like the gate pass, the lift, the Badarpur
crossing, the drive to Greater Noida. The gate runs identically in the route,
the sitemap and the content check, and the content check additionally fails
when two cities share a note that differs only by the city name.

Adding a city means writing that content. There is no way to skip it.

## Conversion

WhatsApp first, phone second, form third — in that order, because that is the
order this market uses. Every WhatsApp link is pre-filled with context about
what the visitor was looking at when they tapped it.

## Checks

```bash
npm run check:content  # placeholders, leftovers, doorway pages, catalog, sign-off
npm run typecheck
npm run build
npm run qa             # accessibility, consent, interaction (needs a running site)
npm run check:upstream # drift from the template this was forked from
```

`check:content` covers five failure classes:

1. **Placeholders** — markers, example domains, unset `+91` numbers.
2. **Leftovers** — CPA-template vocabulary that survived the fork.
3. **Doorway pages** — thin cities, and cities sharing a "local" note.
4. **Catalog integrity** — a package pointing at a service, theme, occasion or
   city that doesn't exist, so a page links to a 404.
5. **Unverified claims** — every key in `verification.ts`, unsigned.

The last one is the important one. The first four compare text; a fabricated
price and a real one are identical in source, so the only real check is a named
person who confirmed it.

## Before you go live

- [ ] Real phone, WhatsApp number, email and address in `site.ts`
- [ ] Every `priceFrom` replaced with a costed figure the owner will honour
- [ ] Service areas confirmed with whoever dispatches the team
- [ ] Photographs of this team's own setups, with descriptive alt text
- [ ] Deposit, cancellation and travel-charge terms confirmed
- [ ] Trust points on the home page replaced or deleted
- [ ] Legal pages reviewed by a lawyer, template notices removed
- [ ] Cookie scan run against the built site, `privacy.ts` reconciled
- [ ] `content/verification.ts` signed off by the owner, with names and dates
- [ ] Redirects mapped from the previous site, if there is one
- [ ] `NEXT_PUBLIC_SITE_URL` and the form endpoint set in the environment
- [ ] `npm run check:content && npm run typecheck && npm run build && npm run qa`
