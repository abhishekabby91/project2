"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { site, whatsappLink } from "@/content/site";
import { copy } from "@/content/copy";
import { Logo } from "./Logo";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { Icon } from "@/components/ui/Icon";
import { cn } from "@/lib/utils";

/**
 * Site header: logo, primary navigation with a keyboard-operable flyout, and
 * the two conversion actions.
 *
 * The flyout opens on hover for pointer users and on click/Enter for everyone
 * else, and closes on Escape and on outside click. It is a real <button> with
 * aria-expanded rather than a CSS-only hover menu, because a CSS-only menu is
 * unreachable by keyboard and invisible to screen readers.
 */
export function Header() {
  const [openMenu, setOpenMenu] = useState<string | null>(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const navRef = useRef<HTMLElement>(null);
  const pathname = usePathname();

  useEffect(() => {
    setOpenMenu(null);
    setMobileOpen(false);
  }, [pathname]);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpenMenu(null);
        setMobileOpen(false);
      }
    };
    const onClick = (e: MouseEvent) => {
      if (navRef.current && !navRef.current.contains(e.target as Node)) setOpenMenu(null);
    };
    document.addEventListener("keydown", onKey);
    document.addEventListener("mousedown", onClick);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("mousedown", onClick);
    };
  }, []);

  // Scroll lock while the mobile panel is open, restored on close.
  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  const isActive = (href: string) =>
    pathname === href || (href !== "/" && pathname.startsWith(href));

  return (
    <header
      className={cn(
        "no-print sticky top-0 z-50 border-b bg-surface/95 backdrop-blur transition-shadow",
        scrolled ? "border-line shadow-card" : "border-transparent",
      )}
    >
      <Container size="wide">
        <div className="flex h-[4.5rem] items-center justify-between gap-4">
          <Logo />

          <nav ref={navRef} aria-label="Main" className="hidden lg:block">
            <ul className="flex items-center gap-1">
              {site.nav.map((item) => {
                const hasChildren = Boolean(item.children?.length);
                const open = openMenu === item.label;
                return (
                  <li
                    key={item.label}
                    className="relative"
                    onMouseEnter={() => hasChildren && setOpenMenu(item.label)}
                    onMouseLeave={() => hasChildren && setOpenMenu(null)}
                  >
                    {hasChildren ? (
                      <button
                        type="button"
                        aria-expanded={open}
                        onClick={() => setOpenMenu(open ? null : item.label)}
                        className={cn(
                          "inline-flex items-center gap-1.5 rounded-brand px-2 py-2 text-[0.9375rem] font-medium transition-colors xl:px-3",
                          isActive(item.href) ? "text-accent" : "text-primary hover:text-accent",
                        )}
                      >
                        {item.label}
                        <svg
                          aria-hidden="true"
                          viewBox="0 0 12 12"
                          className={cn("h-3 w-3 transition-transform", open && "rotate-180")}
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="1.6"
                        >
                          <path d="M2.5 4.5 6 8l3.5-3.5" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                      </button>
                    ) : (
                      <Link
                        href={item.href}
                        className={cn(
                          "inline-flex rounded-brand px-2 py-2 text-[0.9375rem] font-medium transition-colors xl:px-3",
                          isActive(item.href) ? "text-accent" : "text-primary hover:text-accent",
                        )}
                      >
                        {item.label}
                      </Link>
                    )}

                    {hasChildren && open ? (
                      <ul className="absolute left-0 top-full z-50 w-64 rounded-brand border border-line bg-surface p-2 shadow-float">
                        {item.children!.map((child) => (
                          <li key={child.href}>
                            <Link
                              href={child.href}
                              className="block rounded-brand px-3 py-2 text-sm text-ink transition-colors hover:bg-muted hover:text-accent"
                            >
                              {child.label}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    ) : null}
                  </li>
                );
              })}
            </ul>
          </nav>

          {/* The desktop bar turns on at lg (1024px), which is exactly an iPad
              Pro 12.9 in portrait — and logo plus seven nav items plus both
              calls to action did not fit, overflowing the page by 64px on every
              route. The number drops to its icon between lg and xl so the row
              fits; the aria-label keeps it announced either way. */}
          <div className="hidden items-center gap-2 lg:flex">
            <a
              href={`tel:${site.phoneHref}`}
              aria-label={`${copy.cta.call} ${site.phone}`}
              className="inline-flex items-center gap-2 rounded-brand px-2 py-2 text-sm font-semibold text-primary transition-colors hover:text-accent xl:px-3"
            >
              <Icon name="phone" className="h-4 w-4" />
              <span className="hidden xl:inline">{site.phone}</span>
            </a>
            <Button href={whatsappLink()} external data-conversion="whatsapp_click">
              <Icon name="whatsapp" className="h-4 w-4" />
              {copy.cta.whatsapp}
            </Button>
          </div>

          <button
            type="button"
            aria-controls="mobile-menu"
            aria-expanded={mobileOpen}
            aria-label={mobileOpen ? copy.brand.closeMenu : copy.brand.openMenu}
            onClick={() => setMobileOpen((v) => !v)}
            className="inline-flex h-11 w-11 items-center justify-center rounded-brand border border-line text-primary lg:hidden"
          >
            <svg aria-hidden="true" viewBox="0 0 20 20" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round">
              {mobileOpen ? (
                <path d="M5 5l10 10M15 5L5 15" />
              ) : (
                <path d="M3 6h14M3 10h14M3 14h14" />
              )}
            </svg>
          </button>
        </div>
      </Container>

      <div
        id="mobile-menu"
        hidden={!mobileOpen}
        className="max-h-[calc(100dvh-4.5rem)] overflow-y-auto border-t border-line bg-surface lg:hidden"
      >
        <Container>
          <ul className="py-4">
            {site.nav.map((item) => (
              <li key={item.label} className="border-b border-line/70 last:border-0">
                <Link href={item.href} className="block py-3.5 text-base font-medium text-primary">
                  {item.label}
                </Link>
                {item.children?.length ? (
                  <ul className="-mt-1 pb-3 pl-4">
                    {item.children.map((child) => (
                      <li key={child.href}>
                        <Link href={child.href} className="block py-2 text-sm text-ink-muted">
                          {child.label}
                        </Link>
                      </li>
                    ))}
                  </ul>
                ) : null}
              </li>
            ))}
          </ul>
          <div className="grid gap-2 pb-6">
            <Button href={whatsappLink()} external size="lg" data-conversion="whatsapp_click">
              <Icon name="whatsapp" className="h-4 w-4" />
              {copy.cta.whatsapp}
            </Button>
            <Button href={`tel:${site.phoneHref}`} external variant="secondary" size="lg">
              <Icon name="phone" className="h-4 w-4" />
              {site.phone}
            </Button>
          </div>
        </Container>
      </div>
    </header>
  );
}
