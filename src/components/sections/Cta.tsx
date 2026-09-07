import { site, whatsappLink } from "@/content/site";
import { copy } from "@/content/copy";
import { Section, SectionHeading } from "@/components/ui/Section";
import { Button } from "@/components/ui/Button";
import { Icon } from "@/components/ui/Icon";

/**
 * Closing call to action. WhatsApp is the primary path in this market and the
 * phone number is the fallback — the ordering is deliberate, not stylistic.
 */
export function Cta({
  title = copy.home.ctaTitle,
  body = copy.home.ctaBody,
  context,
}: {
  title?: string;
  body?: string;
  /** Pre-fills the WhatsApp message, e.g. "Birthday decoration in Noida". */
  context?: string;
}) {
  return (
    <Section tone="dark">
      <div className="flex flex-col items-start gap-8 lg:flex-row lg:items-center lg:justify-between">
        <SectionHeading title={title} lead={body} tone="dark" className="max-w-2xl" />
        <div className="flex shrink-0 flex-col gap-3 sm:flex-row lg:flex-col xl:flex-row">
          <Button href={whatsappLink(context)} external size="lg" data-conversion="whatsapp_click">
            <Icon name="whatsapp" className="h-4 w-4" />
            {copy.cta.whatsapp}
          </Button>
          <Button href={`tel:${site.phoneHref}`} external variant="outlineDark" size="lg">
            <Icon name="phone" className="h-4 w-4" />
            {site.phone}
          </Button>
        </div>
      </div>
    </Section>
  );
}
