import Image from "next/image";
import Link from "next/link";
import { site } from "@/content/site";
import { cn } from "@/lib/utils";

/**
 * Brand lockup. Renders `site.logo` when one is set; otherwise draws a monogram
 * from the config so the site has a credible mark before artwork exists.
 */
export function Logo({
  tone = "light",
  className,
}: {
  tone?: "light" | "dark";
  className?: string;
}) {
  const onDark = tone === "dark";

  return (
    <Link
      href="/"
      className={cn("group inline-flex items-center gap-3", className)}
      aria-label={`${site.businessName} — home`}
    >
      {site.logo ? (
        <Image src={site.logo} alt={site.businessName} width={168} height={40} priority className="h-9 w-auto" />
      ) : (
        <>
          <span
            aria-hidden="true"
            className={cn(
              "flex h-10 w-10 shrink-0 items-center justify-center rounded-brand font-heading text-[0.9375rem] font-semibold tracking-tight transition-colors",
              onDark ? "bg-primary-fg text-primary" : "bg-accent text-accent-fg group-hover:bg-accent-hover",
            )}
          >
            {site.monogram}
          </span>
          <span className="flex flex-col leading-none">
            <span
              className={cn(
                "font-heading text-[1.0625rem] font-semibold leading-tight tracking-tight sm:text-[1.125rem]",
                onDark ? "text-primary-fg" : "text-primary",
              )}
            >
              {site.businessName}
            </span>
            <span
              className={cn(
                "mt-1 hidden text-[0.625rem] font-medium uppercase tracking-[0.16em] sm:block",
                onDark ? "text-white/60" : "text-ink-muted",
              )}
            >
              {site.tagline}
            </span>
          </span>
        </>
      )}
    </Link>
  );
}
