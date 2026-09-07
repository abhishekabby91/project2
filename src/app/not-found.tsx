import Link from "next/link";
import { services } from "@/content/services";
import { cities } from "@/content/cities";
import { copy } from "@/content/copy";
import { Section, SectionHeading } from "@/components/ui/Section";
import { Button } from "@/components/ui/Button";

export default function NotFound() {
  return (
    <Section as="div">
      <SectionHeading title={copy.notFound.title} lead={copy.notFound.body} level={1} />
      <div className="mt-8">
        <Button href="/">{copy.notFound.cta}</Button>
      </div>

      <div className="mt-14 grid gap-10 sm:grid-cols-2">
        <div>
          <h2 className="text-lg">Decorations</h2>
          <ul className="mt-4 space-y-2 text-[0.9375rem]">
            {services.map((service) => (
              <li key={service.slug}>
                <Link href={`/${service.slug}`} className="text-ink-muted underline-offset-4 hover:text-accent hover:underline">
                  {service.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h2 className="text-lg">Areas</h2>
          <ul className="mt-4 space-y-2 text-[0.9375rem]">
            {cities.map((city) => (
              <li key={city.slug}>
                <Link href={`/cities/${city.slug}`} className="text-ink-muted underline-offset-4 hover:text-accent hover:underline">
                  {city.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </Section>
  );
}
