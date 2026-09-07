import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { JsonLd } from "@/components/seo/JsonLd";
import { breadcrumbSchema } from "@/lib/schema";

export interface Crumb {
  name: string;
  href: string;
}

/**
 * Visual breadcrumbs plus matching BreadcrumbList structured data.
 * The final crumb is the current page and is not a link.
 */
export function Breadcrumbs({ items }: { items: Crumb[] }) {
  const trail: Crumb[] = [{ name: "Home", href: "/" }, ...items];

  return (
    <>
      <nav aria-label="Breadcrumb" className="border-b border-line bg-muted/60">
        <Container>
          <ol className="flex flex-wrap items-center gap-x-2 gap-y-1 py-3 text-sm text-ink-muted">
            {trail.map((crumb, index) => {
              const isLast = index === trail.length - 1;
              return (
                <li key={crumb.href} className="flex items-center gap-2">
                  {isLast ? (
                    <span aria-current="page" className="font-medium text-primary">
                      {crumb.name}
                    </span>
                  ) : (
                    <>
                      <Link
                        href={crumb.href}
                        className="transition-colors hover:text-accent hover:underline"
                      >
                        {crumb.name}
                      </Link>
                      <span aria-hidden="true" className="text-line">
                        /
                      </span>
                    </>
                  )}
                </li>
              );
            })}
          </ol>
        </Container>
      </nav>
      <JsonLd data={breadcrumbSchema(trail)} />
    </>
  );
}
