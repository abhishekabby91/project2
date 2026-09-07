/**
 * Draft notice on the legal pages.
 *
 * These pages ship as drafts. They are a starting point for the business's own
 * lawyer, not a substitute for one — the Digital Personal Data Protection Act
 * 2023 and the Consumer Protection Act 2019 both apply here, and neither is
 * satisfied by a template. The notice comes out after review, not before.
 */
export function LegalNotice() {
  return (
    <div
      role="note"
      className="mt-8 rounded-brand-lg border border-dashed border-accent/40 bg-accent/5 p-6 text-sm leading-relaxed text-ink"
    >
      <p className="font-semibold text-primary">Draft — not yet reviewed</p>
      <p className="mt-2 text-ink-muted">
        This page is a template draft. It has not been reviewed by a lawyer and does not yet
        reflect this business&apos;s actual policies. It must be checked against the Digital
        Personal Data Protection Act 2023 and the Consumer Protection Act 2019, completed where it
        is marked incomplete, and approved before this notice is removed.
      </p>
    </div>
  );
}
