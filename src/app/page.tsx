import Link from "next/link";
import { site, whatsappLink, formatPrice } from "@/content/site";
import { copy } from "@/content/copy";
import { services } from "@/content/services";
import { occasions } from "@/content/occasions";
import { themes } from "@/content/themes";
import { packages, packagesFor, lowestPrice } from "@/content/packages";
import { cities } from "@/content/cities";
import { homeFaqs } from "@/content/faqs";
import { reviews } from "@/content/reviews";
import { Section, SectionHeading } from "@/components/ui/Section";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { Icon } from "@/components/ui/Icon";
import { OccasionCard, ThemeCard, PackageCard, CityCard } from "@/components/cards/Cards";
import { Faqs } from "@/components/sections/Faqs";
import { Process } from "@/components/sections/Process";
import { Cta } from "@/components/sections/Cta";
import { BudgetBands } from "@/components/sections/BudgetBands";
import { BrowseNav } from "@/components/sections/BrowseNav";
import { CategoryRail } from "@/components/sections/CategoryRail";
import { CityCategoryLinks } from "@/components/sections/CityCategoryLinks";
import { JsonLd } from "@/components/seo/JsonLd";
import { faqSchema } from "@/lib/schema";

export default function HomePage() {
  const featured = packages.filter((p) => p.featured);

  return (
    <>
      {/* ── Hero ─────────────────────────────────────────────────────────── */}
      <section className="relative overflow-hidden bg-primary text-primary-fg on-dark" data-surface="dark">
        {/* Decorative palette band — carries the brand without a photograph,
            which matters while the gallery is genuinely empty. */}
        <div aria-hidden="true" className="pointer-events-none absolute inset-0 opacity-[0.18]">
          <div className="absolute -right-24 -top-24 h-96 w-96 rounded-full bg-accent blur-3xl" />
          <div className="absolute -bottom-32 left-1/4 h-80 w-80 rounded-full bg-highlight blur-3xl" />
        </div>

        <Container size="wide" className="relative">
          <div className="grid items-center gap-12 py-20 lg:grid-cols-[1.15fr_1fr] lg:py-28">
            <div>
              <p className="rule-accent text-xs font-semibold uppercase tracking-[0.14em] text-white/70">
                {copy.home.heroEyebrow}
              </p>
              <h1 className="mt-3 text-[2.375rem] leading-[1.08] text-primary-fg sm:text-5xl lg:text-[3.5rem]">
                {copy.home.heroTitle}
              </h1>
              <p className="mt-6 max-w-xl text-lg leading-relaxed text-white/80">
                {copy.home.heroLead}
              </p>
              <p className="mt-4 text-sm font-medium text-highlight">
                {copy.home.heroPriceNote(formatPrice(lowestPrice()))}
              </p>

              <div className="mt-9 flex flex-col gap-3 sm:flex-row">
                <Button href={whatsappLink()} external size="lg" data-conversion="whatsapp_click">
                  <Icon name="whatsapp" className="h-4 w-4" />
                  {copy.cta.whatsapp}
                </Button>
                <Button href="/packages" variant="outlineDark" size="lg">
                  {copy.cta.seePackages}
                </Button>
              </div>

              <ul className="mt-10 grid gap-x-6 gap-y-3 sm:grid-cols-2">
                {site.trustPoints.map((point) => (
                  <li key={point.label} className="flex items-center gap-2.5 text-sm text-white/75">
                    <Icon name={point.icon} className="h-4 w-4 shrink-0 text-highlight" />
                    {point.label}
                  </li>
                ))}
              </ul>
            </div>

            {/* Theme palettes as the hero visual. Real product, no stock photo. */}
            <div className="hidden lg:block">
              <div className="grid grid-cols-2 gap-3">
                {themes.slice(0, 6).map((theme) => (
                  <Link
                    key={theme.slug}
                    href={`/themes/${theme.slug}`}
                    className="group overflow-hidden rounded-brand-lg border border-white/15 bg-white/5 transition-colors hover:border-white/40"
                  >
                    <span aria-hidden="true" className="flex h-16 w-full">
                      {theme.palette.map((hex) => (
                        <span key={hex} className="flex-1" style={{ backgroundColor: hex }} />
                      ))}
                    </span>
                    <span className="block px-3.5 py-2.5 text-sm font-medium text-white/85 group-hover:text-primary-fg">
                      {theme.name}
                    </span>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* Everything on offer, before a single scroll. */}
      <BrowseNav />

      {/* ── One rail per category ────────────────────────────────────────── */}
      {/* A row of real setups with real prices beats a card that only names
          the category — someone who came to find out what a birthday costs
          finds out here. Alternating tone keeps six rails legible as six. */}
      {services.map((service, i) => (
        <CategoryRail
          key={service.slug}
          id={`rail-${service.slug}`}
          title={service.name}
          href={`/${service.slug}`}
          linkLabel={copy.browse.railViewAll(service.name)}
          packages={packagesFor("services", service.slug)}
          tone={i % 2 === 1 ? "muted" : "default"}
        />
      ))}

      {/* ── Prices ───────────────────────────────────────────────────────── */}
      <Section tone="muted" ariaLabelledBy="packages-heading">
        <SectionHeading
          eyebrow={copy.home.packagesEyebrow}
          title={copy.home.packagesTitle}
          lead={copy.home.packagesLead}
          id="packages-heading"
        />
        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {featured.map((pkg) => (
            <PackageCard key={pkg.slug} pkg={pkg} headingLevel={3} cityCount={cities.length} />
          ))}
        </div>

        {/* Straight after three prices, because that is the moment someone
            wants to enter the catalog at their own number rather than ours. */}
        <BudgetBands />

        <div className="mt-10">
          <Button href="/packages" variant="secondary">
            {copy.cta.viewAll} packages
          </Button>
        </div>
      </Section>

      {/* ── Occasions ────────────────────────────────────────────────────── */}
      <Section ariaLabelledBy="occasions-heading">
        <SectionHeading
          eyebrow={copy.home.occasionsEyebrow}
          title={copy.home.occasionsTitle}
          lead={copy.home.occasionsLead}
          id="occasions-heading"
        />
        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {occasions.map((occasion) => (
            <OccasionCard key={occasion.slug} occasion={occasion} headingLevel={3} />
          ))}
        </div>
      </Section>

      {/* ── Themes ───────────────────────────────────────────────────────── */}
      <Section tone="muted" ariaLabelledBy="themes-heading">
        <SectionHeading
          eyebrow={copy.home.themesEyebrow}
          title={copy.home.themesTitle}
          lead={copy.home.themesLead}
          id="themes-heading"
        />
        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {themes.map((theme) => (
            <ThemeCard key={theme.slug} theme={theme} headingLevel={3} />
          ))}
        </div>
      </Section>

      <Process />

      {/* ── Cities ───────────────────────────────────────────────────────── */}
      <Section tone="muted" ariaLabelledBy="cities-heading">
        <SectionHeading
          eyebrow={copy.home.citiesEyebrow}
          title={copy.home.citiesTitle}
          lead={copy.home.citiesLead}
          id="cities-heading"
        />
        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {cities.map((city) => (
            <CityCard key={city.slug} city={city} headingLevel={3} />
          ))}
        </div>
      </Section>

      <CityCategoryLinks />

      {/* Reviews render only when there are real ones. See content/reviews.ts. */}
      {reviews.length ? (
        <Section ariaLabelledBy="reviews-heading">
          <SectionHeading
            eyebrow={copy.home.reviewsEyebrow}
            title={copy.home.reviewsTitle}
            lead={copy.home.reviewsLead}
            id="reviews-heading"
          />
          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {reviews.slice(0, 6).map((review) => (
              <figure key={review.quote} className="rounded-brand-lg border border-line bg-surface p-6">
                <blockquote className="text-[0.9375rem] leading-relaxed text-ink">
                  {review.quote}
                </blockquote>
                <figcaption className="mt-4 text-sm font-semibold text-primary">
                  {review.author}
                  {review.city ? <span className="font-normal text-ink-muted"> · {review.city}</span> : null}
                </figcaption>
              </figure>
            ))}
          </div>
        </Section>
      ) : null}

      <Faqs
        items={homeFaqs}
        eyebrow={copy.home.faqEyebrow}
        title={copy.home.faqTitle}
        lead={copy.home.faqLead}
      />

      <Cta />

      <JsonLd data={faqSchema(homeFaqs)} />
    </>
  );
}
