import type { IconName } from "@/content/types";

/**
 * A small, self-contained stroke icon set.
 *
 * Kept inline rather than pulled from an icon package: it's a handful of
 * kilobytes, ships no runtime JavaScript, and avoids a dependency that would
 * need updating. Add a key here and to `IconName` in content/types.ts to extend it.
 */
const paths: Record<IconName, React.ReactNode> = {
  balloon: (
    <>
      <path d="M12 2.5c3.6 0 6 3 6 6.8 0 4.4-3.4 7.7-6 7.7s-6-3.3-6-7.7c0-3.8 2.4-6.8 6-6.8z" />
      <path d="M10.8 17l1.2 1.5 1.2-1.5" />
      <path d="M12 18.5c0 1.3 1.6 1.3 1.6 2.6" />
    </>
  ),
  cake: (
    <>
      <path d="M3.5 20.5h17v-6a2 2 0 00-2-2h-13a2 2 0 00-2 2z" />
      <path d="M3.5 16.5c1.5 0 1.5 1.5 3 1.5s1.5-1.5 3-1.5 1.5 1.5 3 1.5 1.5-1.5 3-1.5 1.5 1.5 3 1.5" />
      <path d="M8 12.5V9M12 12.5V8M16 12.5V9M8 6.5v.01M12 5.5v.01M16 6.5v.01" />
    </>
  ),
  heart: (
    <path d="M12 20.5S3.5 15.2 3.5 9.2A4.7 4.7 0 0112 6.6a4.7 4.7 0 018.5 2.6c0 6-8.5 11.3-8.5 11.3z" />
  ),
  gift: (
    <>
      <rect x="3" y="9" width="18" height="12" rx="1.5" />
      <path d="M2 9h20M12 9v12" />
      <path d="M12 9S9.5 3.5 7 5.2 9.5 9 12 9zM12 9s2.5-5.5 5-3.8S14.5 9 12 9z" />
    </>
  ),
  sparkle: (
    <>
      <path d="M12 2.5l2.2 6.3L20.5 11l-6.3 2.2L12 19.5l-2.2-6.3L3.5 11l6.3-2.2z" />
      <path d="M19 3v3M20.5 4.5h-3" />
    </>
  ),
  camera: (
    <>
      <path d="M3 8.5h3l1.5-2.5h9L18 8.5h3v11H3z" />
      <circle cx="12" cy="13.5" r="3.5" />
    </>
  ),
  star: (
    <path d="M12 2.5l2.9 6 6.6.9-4.8 4.6 1.2 6.5-5.9-3.2-5.9 3.2 1.2-6.5L2.5 9.4l6.6-.9z" />
  ),
  phone: (
    <path d="M6.6 3h-2A1.6 1.6 0 003 4.7C3 13.1 9.9 20 18.3 20a1.6 1.6 0 001.7-1.6v-2a1.2 1.2 0 00-1-1.2l-3-.6a1.2 1.2 0 00-1.2.5l-1 1.4a13.5 13.5 0 01-5.3-5.3l1.4-1a1.2 1.2 0 00.5-1.2l-.6-3A1.2 1.2 0 006.6 3z" />
  ),
  whatsapp: (
    <>
      <path d="M3 21l1.4-4.6A8.6 8.6 0 1112 20.6a8.5 8.5 0 01-4.3-1.2z" />
      <path d="M8.8 8c.2-.5.4-.5.7-.5h.5c.2 0 .4 0 .6.5l.7 1.7c.1.3 0 .5-.1.7l-.4.5c-.1.2-.2.3 0 .6a7 7 0 003 2.6c.3.1.5.1.6 0l.6-.7c.2-.2.4-.2.6-.1l1.6.8c.3.1.4.3.4.5 0 .6-.4 1.5-1.5 1.6a5 5 0 01-3-.8 11 11 0 01-4-4.2c-.6-1-.8-2-.6-2.7z" />
    </>
  ),
  mail: (
    <>
      <rect x="2.5" y="4.5" width="19" height="15" rx="2.5" />
      <path d="M3 7l9 6 9-6" />
    </>
  ),
  pin: (
    <>
      <path d="M12 21.5s7-6.2 7-11.5a7 7 0 10-14 0c0 5.3 7 11.5 7 11.5z" />
      <circle cx="12" cy="10" r="2.8" />
    </>
  ),
  clock: (
    <>
      <circle cx="12" cy="12" r="9.5" />
      <path d="M12 6.5V12l3.5 2" />
    </>
  ),
  check: <path d="M4.5 12.5l5 5 10-11" />,
  shield: (
    <>
      <path d="M12 2.5l7.5 3v6c0 4.6-3.1 8.8-7.5 10-4.4-1.2-7.5-5.4-7.5-10v-6z" />
      <path d="M9 12l2 2 4-4" />
    </>
  ),
  truck: (
    <>
      <path d="M2.5 6.5h11v10h-11z" />
      <path d="M13.5 10h4l3 3v3.5h-7z" />
      <circle cx="6.5" cy="18.5" r="1.8" />
      <circle cx="17" cy="18.5" r="1.8" />
    </>
  ),
  rupee: (
    <>
      <path d="M7 4.5h10M7 9h10M16 4.5c0 3.5-2.5 4.5-5.5 4.5H7l8 10" />
    </>
  ),
  calendar: (
    <>
      <rect x="3.5" y="5" width="17" height="16" rx="2" />
      <path d="M3.5 10h17M8 3v4M16 3v4" />
    </>
  ),
  users: (
    <>
      <circle cx="9" cy="8" r="3.5" />
      <path d="M2.5 20.5a6.5 6.5 0 0113 0" />
      <path d="M16 5.2a3.5 3.5 0 010 5.6M17.5 15a6.5 6.5 0 014 5.5" />
    </>
  ),
};

export function Icon({
  name,
  className = "h-5 w-5",
  strokeWidth = 1.5,
}: {
  name: IconName;
  className?: string;
  strokeWidth?: number;
}) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
      focusable="false"
    >
      {paths[name]}
    </svg>
  );
}
