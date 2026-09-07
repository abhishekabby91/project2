import { site } from "@/content/site";
import { consentConfig } from "@/content/privacy";
import { pageMetadata } from "@/lib/seo";
import { Section, SectionHeading } from "@/components/ui/Section";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import { LegalNotice } from "@/components/legal/LegalNotice";
import { ContactRoute } from "@/components/layout/ContactRoute";

export const metadata = pageMetadata({
  title: "Privacy Policy",
  description: `How ${site.businessName} collects, uses and protects personal information, and the cookies this website sets.`,
  path: "/privacy",
});

export default function PrivacyPage() {
  return (
    <>
      <Breadcrumbs items={[{ name: "Privacy policy", href: "/privacy" }]} />
      <Section as="div" containerSize="narrow">
        <SectionHeading eyebrow="Legal" title="Privacy policy" level={1} />
        <LegalNotice />

        <div className="prose-brand mt-10">
          <p>
            This policy explains what personal information {site.businessName} collects when you
            enquire about or book a decoration setup, what we do with it, and what you can ask us
            to do about it.
          </p>

          <h2>What we collect</h2>
          <p>
            When you send an enquiry — by WhatsApp, phone, or the form on this site — we collect
            your name, phone number, and any email address, event date, city, occasion and
            description of the space that you choose to give us. If you book, we also collect the
            delivery address for the setup and a record of what was paid.
          </p>
          <p>
            We do not ask for and do not want identity documents, payment card numbers by message,
            or any information about anyone other than yourself and the event. Please do not send
            them.
          </p>

          <h2>Why we collect it</h2>
          <ul>
            <li>To quote for the work and answer your questions.</li>
            <li>To plan and carry out a booking you have made, including reaching the venue.</li>
            <li>To keep a record of the transaction, as we are required to.</li>
            <li>To improve this website, where you have agreed to analytics cookies.</li>
          </ul>

          <h2>Who we share it with</h2>
          <p>
            The team member carrying out your setup receives your name, address and phone number,
            because they cannot complete the booking without them. Beyond that we share your
            information only with service providers who host this site and deliver our messages,
            and where the law requires it. We do not sell your information.
          </p>

          <h2>How long we keep it</h2>
          <p>
            Enquiries that do not become bookings are kept for a limited period and then deleted.
            Booking records are kept for as long as we are required to keep transaction records,
            and then deleted.
          </p>
          <p className="text-ink-muted">
            <strong>To confirm before publishing:</strong> the actual retention periods, agreed
            with the business and with legal advice.
          </p>

          <h2>Your rights</h2>
          <p>
            You can ask us what information we hold about you, ask us to correct it, and ask us to
            delete it where we are not required to keep it. Contact us on{" "}
            <ContactRoute /> and we will respond.
          </p>

          <h2>Cookies</h2>
          <p>
            This site sets only the cookies listed below. Nothing beyond the necessary category
            loads until you agree to it, and you can change your choice at any time using the
            cookie preferences link in the footer.
          </p>

          {consentConfig.categories.map((category) => (
            <div key={category.id}>
              <h3>
                {category.label}
                {category.required ? " (always active)" : ""}
              </h3>
              <p>{category.description}</p>
              {category.cookies.length ? (
                <div className="overflow-x-auto">
                  <table className="mt-4 w-full border-collapse text-sm">
                    <thead>
                      <tr className="border-b border-line text-left">
                        <th className="py-2 pr-4 font-semibold">Cookie</th>
                        <th className="py-2 pr-4 font-semibold">Provider</th>
                        <th className="py-2 pr-4 font-semibold">Purpose</th>
                        <th className="py-2 font-semibold">Retention</th>
                      </tr>
                    </thead>
                    <tbody>
                      {category.cookies.map((cookie) => (
                        <tr key={cookie.name} className="border-b border-line/60 align-top">
                          <td className="py-2 pr-4 font-mono text-xs">{cookie.name}</td>
                          <td className="py-2 pr-4">{cookie.provider}</td>
                          <td className="py-2 pr-4">{cookie.purpose}</td>
                          <td className="py-2">{cookie.retention}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <p className="text-ink-muted">No cookies are set in this category.</p>
              )}
            </div>
          ))}

          <h2>Contact</h2>
          <p>
            Questions about this policy go to <ContactRoute />.
          </p>
        </div>
      </Section>
    </>
  );
}
