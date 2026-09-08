/**
 * Which AI crawlers may read this site.
 *
 * This is a commercial decision, not a technical one, which is why it lives
 * here rather than in `src/`. The trade is straightforward and worth stating
 * plainly before anyone changes a line of it:
 *
 *   • A crawler that can *cite* you sends customers. Someone asking an
 *     assistant "who does balloon decoration in Noida" is further down the
 *     funnel than someone typing it into a search box, and a business that
 *     blocked the crawler cannot be the answer.
 *   • A crawler that only harvests text for training sends nothing back. You
 *     are paying bandwidth to furnish a model that will never name you.
 *
 * So the default below allows anything that attributes and can send a booking,
 * and refuses the bulk harvesters that cannot. Reasonable owners land in
 * different places on this; the `purpose` note on each is there so the choice
 * can be revisited knowingly rather than copied from a blog post.
 *
 * None of this applies while the site is unverified — `src/app/robots.ts`
 * refuses every crawler, AI or otherwise, until content/verification.ts is
 * signed off. See src/lib/indexing.ts.
 *
 * ⚠️  robots.txt is a request, not a fence. It is honoured by the operators
 * below and ignored by anyone who does not care. Nothing here protects
 * content; it expresses a preference to those who read it.
 */

export interface CrawlerPolicy {
  /** The user-agent token, exactly as the operator documents it. */
  agent: string;
  allow: boolean;
  /** What it does, and therefore what allowing or refusing it costs. */
  purpose: string;
}

export const aiCrawlers: CrawlerPolicy[] = [
  /* ---- Retrieval and citation: these can send a customer ---------------- */
  {
    agent: "OAI-SearchBot",
    allow: true,
    purpose: "Builds ChatGPT's search index. Results are cited and linked.",
  },
  {
    agent: "ChatGPT-User",
    allow: true,
    purpose: "Fetches a page live when someone asks ChatGPT about it.",
  },
  {
    agent: "GPTBot",
    allow: true,
    purpose:
      "OpenAI's general crawler. Refusing it also removes the site from where ChatGPT looks, which costs more reach than the training use is worth to a local business.",
  },
  {
    agent: "Claude-SearchBot",
    allow: true,
    purpose: "Indexes pages so Claude can cite them in an answer.",
  },
  {
    agent: "Claude-User",
    allow: true,
    purpose: "Fetches a page live when someone asks Claude about it.",
  },
  {
    agent: "ClaudeBot",
    allow: true,
    purpose: "Anthropic's general crawler.",
  },
  {
    agent: "PerplexityBot",
    allow: true,
    purpose: "Perplexity's index. Answers there carry a visible source link.",
  },
  {
    agent: "Perplexity-User",
    allow: true,
    purpose: "Fetches a page live for a Perplexity user.",
  },
  {
    agent: "Google-Extended",
    allow: true,
    purpose:
      "Not a crawler — the token that lets Gemini and AI Overviews use pages Googlebot already has. Refusing it removes the site from AI Overviews without improving ordinary ranking.",
  },
  {
    agent: "Applebot-Extended",
    allow: true,
    purpose: "Lets Apple Intelligence use pages Applebot already has.",
  },

  /* ---- Bulk harvesting: no attribution, no referral --------------------- */
  {
    agent: "CCBot",
    allow: false,
    purpose:
      "Common Crawl. A public archive that many training sets are built from. It never sends a visitor and never names the source.",
  },
  {
    agent: "Bytespider",
    allow: false,
    purpose:
      "ByteDance. Widely reported to crawl aggressively, and offers no route back to the business.",
  },
  {
    agent: "meta-externalagent",
    allow: false,
    purpose: "Meta's training crawler. No citation, no referral.",
  },
];

export const allowedAiCrawlers = () => aiCrawlers.filter((c) => c.allow);
export const blockedAiCrawlers = () => aiCrawlers.filter((c) => !c.allow);
