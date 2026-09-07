import Link from "next/link";
import { Icon } from "@/components/ui/Icon";
import { formatPrice } from "@/content/site";
import { copy } from "@/content/copy";
import type { City, DecorPackage, IconName, Occasion, Service, Theme } from "@/content/types";
import { cn } from "@/lib/utils";

/**
 * Cards used across the site.
 *
 * Every card takes `headingLevel` so the document outline stays correct — a
 * grid sitting directly under the page h1 passes 2, one inside a section that
 * already has an h2 passes 3.
 */
type Level = 2 | 3 | 4;

function CardHeading({ level, children, className }: { level: Level; children: React.ReactNode; className?: string }) {
  const Tag = `h${level}` as "h2" | "h3" | "h4";
  return <Tag className={cn("text-lg leading-snug", className)}>{children}</Tag>;
}

const cardBase =
  "group relative flex h-full flex-col rounded-brand-lg border border-line bg-surface p-6 " +
  "transition-[border-color,box-shadow,transform] duration-200 hover:-translate-y-0.5 hover:border-accent/40 hover:shadow-raised";

/** The link that covers the whole card, so the entire surface is clickable. */
function CoverLink({ href, label }: { href: string; label: string }) {
  return (
    <Link href={href} className="absolute inset-0 rounded-brand-lg focus-visible:outline-2 focus-visible:outline-offset-2">
      <span className="sr-only">{label}</span>
    </Link>
  );
}

function Chevron() {
  return (
    <svg aria-hidden="true" viewBox="0 0 16 16" className="h-4 w-4 transition-transform group-hover:translate-x-0.5" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <path d="M6 3.5 10.5 8 6 12.5" />
    </svg>
  );
}

function IconBadge({ name }: { name: IconName }) {
  return (
    <span aria-hidden="true" className="mb-5 inline-flex h-11 w-11 items-center justify-center rounded-brand bg-accent/10 text-accent">
      <Icon name={name} className="h-5 w-5" />
    </span>
  );
}

export function ServiceCard({ service, headingLevel = 3, city }: { service: Service; headingLevel?: Level; city?: City }) {
  const href = city ? `/${service.slug}/${city.slug}` : `/${service.slug}`;
  const title = city ? `${service.name} in ${city.name}` : service.name;
  return (
    <article className={cardBase}>
      <IconBadge name={service.icon} />
      <CardHeading level={headingLevel}>{title}</CardHeading>
      <p className="mt-2.5 flex-1 text-sm leading-relaxed text-ink-muted">{service.summary}</p>
      <span className="mt-5 inline-flex items-center gap-1.5 text-sm font-semibold text-accent">
        {copy.cta.seePackages}
        <Chevron />
      </span>
      <CoverLink href={href} label={title} />
    </article>
  );
}

export function OccasionCard({ occasion, headingLevel = 3 }: { occasion: Occasion; headingLevel?: Level }) {
  return (
    <article className={cardBase}>
      <IconBadge name={occasion.icon} />
      <CardHeading level={headingLevel}>{occasion.name}</CardHeading>
      <p className="mt-2.5 flex-1 text-sm leading-relaxed text-ink-muted">{occasion.summary}</p>
      <span className="mt-5 inline-flex items-center gap-1.5 text-sm font-semibold text-accent">
        Read more <Chevron />
      </span>
      <CoverLink href={`/occasions/${occasion.slug}`} label={occasion.name} />
    </article>
  );
}

/**
 * A theme's palette is the product. Rendering the actual swatches means the
 * card shows what you get instead of describing it — and it works without a
 * single photograph, which matters while the gallery is still empty.
 */
export function ThemeCard({ theme, headingLevel = 3 }: { theme: Theme; headingLevel?: Level }) {
  return (
    <article className={cn(cardBase, "overflow-hidden p-0")}>
      <div aria-hidden="true" className="flex h-28 w-full">
        {theme.palette.map((hex) => (
          <span key={hex} className="flex-1" style={{ backgroundColor: hex }} />
        ))}
      </div>
      <div className="flex flex-1 flex-col p-6">
        <CardHeading level={headingLevel}>{theme.name}</CardHeading>
        <p className="mt-2.5 flex-1 text-sm leading-relaxed text-ink-muted">{theme.summary}</p>
        <span className="mt-5 inline-flex items-center gap-1.5 text-sm font-semibold text-accent">
          {copy.cta.viewAll} <Chevron />
        </span>
      </div>
      <CoverLink href={`/themes/${theme.slug}`} label={theme.name} />
    </article>
  );
}

export function PackageCard({ pkg, headingLevel = 3 }: { pkg: DecorPackage; headingLevel?: Level }) {
  const image = pkg.images[0];
  return (
    <article className={cn(cardBase, "overflow-hidden p-0")}>
      {image ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={image.src} alt={image.alt} className="h-44 w-full object-cover" loading="lazy" />
      ) : (
        /* No photograph yet. A muted panel is honest; a stock photo of someone
           else's work is not. */
        <div aria-hidden="true" className="flex h-44 w-full items-center justify-center bg-muted">
          <Icon name="camera" className="h-7 w-7 text-ink-muted/40" />
        </div>
      )}
      <div className="flex flex-1 flex-col p-6">
        <CardHeading level={headingLevel}>{pkg.name}</CardHeading>
        <p className="mt-2.5 flex-1 text-sm leading-relaxed text-ink-muted">{pkg.summary}</p>
        <div className="mt-5 flex items-end justify-between gap-3">
          <span className="text-sm text-ink-muted">
            <span className="block text-xs uppercase tracking-wide">{copy.packages.priceFromLabel}</span>
            <span className="text-xl font-semibold text-primary">{formatPrice(pkg.priceFrom)}</span>
          </span>
          <span className="inline-flex items-center gap-1.5 pb-1 text-sm font-semibold text-accent">
            Details <Chevron />
          </span>
        </div>
      </div>
      <CoverLink href={`/packages/${pkg.slug}`} label={pkg.name} />
    </article>
  );
}

export function CityCard({ city, headingLevel = 3 }: { city: City; headingLevel?: Level }) {
  return (
    <article className={cardBase}>
      <IconBadge name="pin" />
      <CardHeading level={headingLevel}>{city.name}</CardHeading>
      <p className="mt-2.5 text-sm leading-relaxed text-ink-muted">
        {city.localities.slice(0, 4).map((l) => l.name).join(" · ")}
        {city.localities.length > 4 ? ` and ${city.localities.length - 4} more` : ""}
      </p>
      <span className="mt-5 inline-flex items-center gap-1.5 text-sm font-semibold text-accent">
        {copy.cta.checkAvailability} <Chevron />
      </span>
      <CoverLink href={`/cities/${city.slug}`} label={`Decoration in ${city.name}`} />
    </article>
  );
}

/** Simple bullet list with an accent marker. Used for includes/excludes. */
export function CheckList({ items, tone = "positive" }: { items: string[]; tone?: "positive" | "negative" }) {
  return (
    <ul className="space-y-3">
      {items.map((item) => (
        <li key={item} className="flex gap-3 text-[0.9375rem] leading-relaxed text-ink">
          <span
            aria-hidden="true"
            className={cn(
              "mt-1 inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-full",
              tone === "positive" ? "bg-accent/10 text-accent" : "bg-muted text-ink-muted",
            )}
          >
            {tone === "positive" ? (
              <Icon name="check" className="h-3 w-3" />
            ) : (
              <svg viewBox="0 0 12 12" className="h-2.5 w-2.5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
                <path d="M3 6h6" />
              </svg>
            )}
          </span>
          <span>{item}</span>
        </li>
      ))}
    </ul>
  );
}
