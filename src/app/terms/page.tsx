import { site } from "@/content/site";
import { pageMetadata } from "@/lib/seo";
import { Section, SectionHeading } from "@/components/ui/Section";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import { LegalNotice } from "@/components/legal/LegalNotice";

export const metadata = pageMetadata({
  title: "Terms of Service",
  description: `The terms on which ${site.businessName} provides decoration services across Delhi NCR.`,
  path: "/terms",
});

export default function TermsPage() {
  return (
    <>
      <Breadcrumbs items={[{ name: "Terms", href: "/terms" }]} />
      <Section as="div" containerSize="narrow">
        <SectionHeading eyebrow="Legal" title="Terms of service" level={1} />
        <LegalNotice />

        <div className="prose-brand mt-10">
          <h2>What we agree to do</h2>
          <p>
            We provide the setup described in your written quote, at the address and within the
            arrival window agreed there. Where a package page describes what is and is not
            included, that description forms part of the agreement.
          </p>

          <h2>Prices and quotes</h2>
          <p>
            Prices shown on this website are starting prices for the setup as described. Your
            quote is the price, and any travel charge appears on it before you pay anything. We do
            not add charges after the work is done.
          </p>

          <h2>Access to the venue</h2>
          <p>
            You are responsible for arranging access — a gate pass, lift booking, society or venue
            permission, and someone able to let the team in. Where the team cannot reach the
            venue at the agreed time for reasons outside our control, we will do what we can to
            complete the setup, but a shortened setup window may change what is possible.
          </p>

          <h2>The venue&apos;s own rules</h2>
          <p>
            Some venues prohibit adhesives on walls, open flame, confetti or fixings to ceilings.
            Tell us before the day. We will not breach a venue&apos;s rules, and where a rule
            prevents part of a setup we will propose an alternative rather than proceed anyway.
          </p>

          <h2>Changes, cancellation and refunds</h2>
          <p className="text-ink-muted">
            <strong>To be completed before publishing:</strong> the deposit, cancellation window,
            rescheduling and refund terms the business actually operates. These must match what
            the FAQs say and must comply with the Consumer Protection Act 2019. Have them
            reviewed before this page goes live.
          </p>

          <h2>Damage and safety</h2>
          <p>
            We use fixings appropriate to the surface and remove everything we brought. Balloons
            and decorative items are not toys; uninflated and burst latex balloons are a choking
            hazard for young children, and the setup should be supervised while children are near
            it.
          </p>

          <h2>Photography</h2>
          <p>
            We may photograph a finished setup for our own portfolio. Tell us if you would rather
            we did not, and we will not. We do not photograph guests.
          </p>

          <h2>Contact</h2>
          <p>
            Questions about these terms go to <a href={`mailto:${site.email}`}>{site.email}</a>.
          </p>
        </div>
      </Section>
    </>
  );
}
