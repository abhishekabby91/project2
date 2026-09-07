type Block = Record<string, unknown> | null | undefined;

/**
 * Renders a JSON-LD block.
 *
 * The payload is always built by `src/lib/schema.ts` from typed content, never
 * from user input, and `<` is escaped so a stray character in copy cannot close
 * the script tag early.
 *
 * `null` entries are dropped rather than rejected: the schema builders return
 * null when the content does not support a block (no FAQs on the page, no
 * reviews to aggregate), and the right response to that is to emit nothing —
 * not to make every caller write the same guard.
 */
export function JsonLd({ data }: { data: Block | Block[] }) {
  const blocks = (Array.isArray(data) ? data : [data]).filter(
    (block): block is Record<string, unknown> => Boolean(block),
  );
  if (!blocks.length) return null;

  const json = JSON.stringify(blocks.length === 1 ? blocks[0] : blocks).replace(/</g, "\\u003c");
  return (
    <script
      type="application/ld+json"
      // eslint-disable-next-line react/no-danger
      dangerouslySetInnerHTML={{ __html: json }}
    />
  );
}
