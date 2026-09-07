import { cn } from "@/lib/utils";
import { Container } from "./Container";

type Tone = "default" | "muted" | "dark";

const tones: Record<Tone, string> = {
  default: "bg-canvas",
  muted: "bg-muted",
  dark: "bg-primary text-primary-fg on-dark",
};

/** Standard vertical rhythm and background treatment for a page section. */
export function Section({
  children,
  tone = "default",
  className,
  containerSize = "default",
  id,
  as: Tag = "section",
  ariaLabelledBy,
}: {
  children: React.ReactNode;
  tone?: Tone;
  className?: string;
  containerSize?: "default" | "narrow" | "wide";
  id?: string;
  as?: "section" | "div" | "article" | "aside";
  ariaLabelledBy?: string;
}) {
  return (
    <Tag
      id={id}
      aria-labelledby={ariaLabelledBy}
      data-surface={tone === "dark" ? "dark" : undefined}
      className={cn("py-16 sm:py-20 lg:py-24", tones[tone], className)}
    >
      <Container size={containerSize}>{children}</Container>
    </Tag>
  );
}

/**
 * Section header: optional eyebrow, heading, and lead paragraph.
 * `level` keeps the document outline correct — pages set it explicitly rather
 * than every section defaulting to h2 in the wrong place.
 */
export function SectionHeading({
  eyebrow,
  title,
  lead,
  align = "left",
  tone = "default",
  level = 2,
  id,
  className,
}: {
  eyebrow?: string;
  title: string;
  lead?: string;
  align?: "left" | "center";
  tone?: Tone;
  level?: 1 | 2 | 3;
  id?: string;
  className?: string;
}) {
  const Heading = `h${level}` as "h1" | "h2" | "h3";
  const dark = tone === "dark";

  return (
    <div
      className={cn(
        "max-w-3xl",
        align === "center" && "mx-auto text-center",
        className,
      )}
    >
      {eyebrow ? (
        <p
          className={cn(
            "rule-accent mb-3 text-xs font-semibold uppercase tracking-[0.14em]",
            align === "center" && "[&::before]:mx-auto",
            dark ? "text-white/70" : "text-accent",
          )}
        >
          {eyebrow}
        </p>
      ) : null}
      <Heading
        id={id}
        className={cn(
          level === 1
            ? "text-[2.125rem] leading-[1.12] sm:text-5xl lg:text-[3.25rem]"
            : "text-[1.75rem] leading-[1.18] sm:text-4xl",
          dark && "text-primary-fg",
        )}
      >
        {title}
      </Heading>
      {lead ? (
        <p
          className={cn(
            "mt-4 text-lg leading-relaxed",
            dark ? "text-white/75" : "text-ink-muted",
          )}
        >
          {lead}
        </p>
      ) : null}
    </div>
  );
}
