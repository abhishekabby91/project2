import Link from "next/link";
import { site, whatsappLink } from "@/content/site";
import { copy } from "@/content/copy";
import { services } from "@/content/services";
import { cities } from "@/content/cities";
import { Container } from "@/components/ui/Container";
import { Icon } from "@/components/ui/Icon";
import { Logo } from "./Logo";
import { CookiePreferencesLink } from "@/components/consent/ConsentManager";

const year = new Date().getFullYear();

export function Footer() {
  return (
    <footer className="no-print border-t border-line bg-primary text-primary-fg on-dark" data-surface="dark">
      <Container size="wide">
        <div className="grid gap-10 py-14 sm:grid-cols-2 lg:grid-cols-4 lg:py-16">
          <div className="lg:col-span-1">
            <Logo tone="dark" />
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-white/70">
              {copy.footer.tagline}
            </p>
            <div className="mt-6 space-y-3 text-sm">
              <a
                href={whatsappLink()}
                data-conversion="whatsapp_click"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 font-semibold text-primary-fg underline-offset-4 hover:underline"
              >
                <Icon name="whatsapp" className="h-4 w-4" />
                {copy.cta.whatsapp}
              </a>
              <a
                href={`tel:${site.phoneHref}`}
                className="flex items-center gap-2 text-white/80 hover:text-primary-fg"
              >
                <Icon name="phone" className="h-4 w-4" />
                {site.phone}
              </a>
              {site.email ? (
                <a
                  href={`mailto:${site.email}`}
                  className="flex items-center gap-2 text-white/80 hover:text-primary-fg"
                >
                  <Icon name="mail" className="h-4 w-4" />
                  {site.email}
                </a>
              ) : null}
            </div>
          </div>

          <nav aria-labelledby="footer-services">
            <h2 id="footer-services" className="text-sm font-semibold uppercase tracking-[0.12em] text-white/60">
              {copy.footer.servicesTitle}
            </h2>
            <ul className="mt-4 space-y-2.5 text-sm">
              {services.map((service) => (
                <li key={service.slug}>
                  <Link href={`/${service.slug}`} className="text-white/80 transition-colors hover:text-primary-fg">
                    {service.name}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <nav aria-labelledby="footer-cities">
            <h2 id="footer-cities" className="text-sm font-semibold uppercase tracking-[0.12em] text-white/60">
              {copy.footer.citiesTitle}
            </h2>
            <ul className="mt-4 space-y-2.5 text-sm">
              {cities.map((city) => (
                <li key={city.slug}>
                  <Link href={`/balloon-decoration/${city.slug}`} className="text-white/80 transition-colors hover:text-primary-fg">
                    Balloon decoration in {city.name}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div>
            <h2 className="text-sm font-semibold uppercase tracking-[0.12em] text-white/60">
              {copy.footer.companyTitle}
            </h2>
            <ul className="mt-4 space-y-2.5 text-sm">
              <li><Link href="/occasions" className="text-white/80 hover:text-primary-fg">Occasions</Link></li>
              <li><Link href="/themes" className="text-white/80 hover:text-primary-fg">Themes</Link></li>
              <li><Link href="/packages" className="text-white/80 hover:text-primary-fg">Packages &amp; prices</Link></li>
              <li><Link href="/gallery" className="text-white/80 hover:text-primary-fg">Gallery</Link></li>
              <li><Link href="/faqs" className="text-white/80 hover:text-primary-fg">FAQs</Link></li>
              <li><Link href="/contact" className="text-white/80 hover:text-primary-fg">Contact</Link></li>
            </ul>

            <h2 className="mt-8 text-sm font-semibold uppercase tracking-[0.12em] text-white/60">
              {copy.footer.legalTitle}
            </h2>
            <ul className="mt-4 space-y-2.5 text-sm">
              <li><Link href="/privacy" className="text-white/80 hover:text-primary-fg">Privacy policy</Link></li>
              <li><Link href="/terms" className="text-white/80 hover:text-primary-fg">Terms</Link></li>
              <li><CookiePreferencesLink className="text-white/80 underline-offset-4 hover:text-primary-fg hover:underline" /></li>
            </ul>
          </div>
        </div>

        <div className="flex flex-col gap-3 border-t border-white/15 py-6 text-xs text-white/60 sm:flex-row sm:items-center sm:justify-between">
          <p>{copy.footer.rights(year, site.businessName)}</p>
          <p>
            Serving {cities.map((c) => c.name).join(", ")}.
          </p>
        </div>
      </Container>
    </footer>
  );
}
