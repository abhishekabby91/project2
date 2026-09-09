import { copy } from "@/content/copy";
import { cities } from "@/content/cities";
import type { DecorPackage } from "@/content/types";
import { PackageCard } from "@/components/cards/Cards";
import { Rail } from "@/components/sections/Rail";

/**
 * One service category, as a scrollable row of the setups in it.
 *
 * A card that says "Birthday Decoration" asks the visitor to guess what is
 * behind it; a row with ₹2,499 on it answers the question they arrived with.
 *
 * The same setup appearing in more than one rail is not a bug. A balloon arch
 * genuinely is booked for a birthday and for an anniversary, and pretending
 * otherwise would mean publishing two near-identical packages instead of one.
 */
export function CategoryRail({
  title,
  href,
  linkLabel,
  packages,
  id,
  tone = "default",
}: {
  title: string;
  href: string;
  linkLabel: string;
  packages: DecorPackage[];
  id: string;
  tone?: "default" | "muted";
}) {
  return (
    <Rail
      id={id}
      title={title}
      href={href}
      linkLabel={linkLabel}
      tone={tone}
      count={copy.browse.railCount(packages.length)}
      items={packages.map((pkg) => ({
        key: pkg.slug,
        content: <PackageCard pkg={pkg} headingLevel={3} cityCount={cities.length} />,
      }))}
    />
  );
}
