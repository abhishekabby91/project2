/** Join class names, dropping falsy values. */
export function cn(...classes: (string | false | null | undefined)[]) {
  return classes.filter(Boolean).join(" ");
}

/** "2026-08-18" → "August 18, 2026" (locale-stable, timezone-safe). */
export function formatDate(iso: string) {
  const [year, month, day] = iso.split("-").map(Number);
  return new Date(Date.UTC(year, month - 1, day)).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
    timeZone: "UTC",
  });
}

/** Initials for avatar fallbacks: "Margaret Chen" → "MC". */
export function initials(name: string) {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("");
}

/** Single-line address, e.g. for structured data and directions links. */
export function formatAddress(address: {
  street: string;
  street2?: string;
  city: string;
  state: string;
  zip: string;
}) {
  return [address.street, address.street2, `${address.city}, ${address.state} ${address.zip}`]
    .filter(Boolean)
    .join(", ");
}

export function directionsUrl(address: Parameters<typeof formatAddress>[0]) {
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
    formatAddress(address),
  )}`;
}
