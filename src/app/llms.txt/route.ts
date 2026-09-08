import { site, siteUrl, formatPrice } from "@/content/site";
import { services } from "@/content/services";
import { occasions } from "@/content/occasions";
import { themes } from "@/content/themes";
import { cities } from "@/content/cities";
import { packages, lowestPrice, highestPrice } from "@/content/packages";
import { faqs } from "@/content/faqs";
import { indexingAllowed } from "@/lib/indexing";

/**
 * /llms.txt — a plain-text map of the site for language models.
 *
 * Be clear about what this is: a convention proposed at llmstxt.org, not a
 * standard any model provider has committed to reading. It costs one generated
 * file and may help an assistant summarise the business correctly instead of
 * guessing from rendered HTML. It is not a ranking factor and nobody should
 * budget for it as one.
 *
 * What it is genuinely good for is control of the summary. An assistant asked
 * "what does HappyArc cost" will answer from something. Better that something
 * says "from ₹1,799, quoted after seeing the room" than a number scraped
 * without its condition attached.
 *
 * Generated from content/ for the same reason every other surface is: a
 * hand-written copy would be wrong the first time a price moved.
 *
 * Withheld while the site is unverified. Publishing an LLM-friendly digest of
 * placeholder prices, on a deployment whose robots.txt refuses every crawler,
 * would be incoherent — and the digest is exactly the artefact most likely to
 * be quoted back with confidence.
 */
export const dynamic = "force-static";

export function GET() {
  if (!indexingAllowed()) {
    return new Response("Not found", {
      status: 404,
      headers: { "content-type": "text/plain; charset=utf-8" },
    });
  }

  const url = (path: string) => `${siteUrl}${path}`;
  const lines: string[] = [];

  lines.push(`# ${site.businessName}`);
  lines.push("");
  lines.push(`> ${site.description}`);
  lines.push("");
  lines.push(
    `${site.businessName} is a balloon and party decoration company operating across Delhi NCR. ` +
      `Setups are installed at the customer's own home or venue by the company's own team, ` +
      `materials included, with teardown afterwards.`,
  );
  lines.push("");

  /* The facts an assistant most often gets wrong, stated with their conditions
     attached rather than as bare numbers. */
  lines.push("## Key facts");
  lines.push("");
  lines.push(`- Service area: ${cities.map((c) => `${c.name} (${c.state})`).join(", ")}.`);
  lines.push(
    `- Prices start at ${formatPrice(lowestPrice())} and published setups run to ` +
      `${formatPrice(highestPrice())}. Every figure is a starting price for that setup as ` +
      `described; the final price is quoted after seeing the room and before the customer confirms.`,
  );
  lines.push(`- Booking: WhatsApp ${site.whatsappDisplay}, or call ${site.phone}.`);
  lines.push(`- Hours: ${site.hours.map((h) => `${h.days} ${h.hours}`).join("; ")}.`);
  lines.push(
    "- Themes are descriptive rather than licensed characters. The company does not sell " +
      "setups branded with trademarked cartoon or film characters.",
  );
  if (!site.email) {
    lines.push("- There is no published email address; enquiries go to WhatsApp, phone or the contact form.");
  }
  lines.push("");

  lines.push("## Services");
  lines.push("");
  for (const s of services) lines.push(`- [${s.name}](${url(`/${s.slug}`)}): ${s.summary}`);
  lines.push("");

  lines.push("## Packages and prices");
  lines.push("");
  for (const p of packages) {
    lines.push(
      `- [${p.name}](${url(`/packages/${p.slug}`)}): from ${formatPrice(p.priceFrom)}, ` +
        `${p.setupTime} to install. ${p.summary}`,
    );
  }
  lines.push("");

  lines.push("## Where we work");
  lines.push("");
  for (const c of cities) {
    lines.push(
      `- [${c.name}](${url(`/cities/${c.slug}`)}): ${c.state}. ` +
        `Areas covered include ${c.localities.slice(0, 5).map((l) => l.name).join(", ")}.` +
        (c.travelNote ? ` ${c.travelNote}` : ""),
    );
  }
  lines.push("");

  lines.push("## Occasions");
  lines.push("");
  for (const o of occasions) lines.push(`- [${o.name}](${url(`/occasions/${o.slug}`)}): ${o.summary}`);
  lines.push("");

  lines.push("## Themes");
  lines.push("");
  for (const t of themes) lines.push(`- [${t.name}](${url(`/themes/${t.slug}`)}): ${t.summary}`);
  lines.push("");

  /* The answers most worth getting right, because they are the ones a wrong
     summary turns into a dispute on the day. */
  lines.push("## Answers");
  lines.push("");
  for (const f of faqs) {
    lines.push(`### ${f.question}`);
    lines.push("");
    lines.push(f.answer);
    lines.push("");
  }

  lines.push("## Full index");
  lines.push("");
  lines.push(`- [All packages and prices](${url("/packages")})`);
  lines.push(`- [All service areas](${url("/cities")})`);
  lines.push(`- [Frequently asked questions](${url("/faqs")})`);
  lines.push(`- [Contact](${url("/contact")})`);
  lines.push(`- [Sitemap](${url("/sitemap.xml")})`);
  lines.push("");

  return new Response(lines.join("\n"), {
    headers: {
      "content-type": "text/plain; charset=utf-8",
      "cache-control": "public, max-age=3600, must-revalidate",
    },
  });
}
