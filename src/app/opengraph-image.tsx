import { ImageResponse } from "next/og";
import { site } from "@/content/site";
import { cities } from "@/content/cities";

export const alt = `${site.businessName} — ${site.tagline}`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

/**
 * Default social share card, generated from the site config so it re-brands
 * along with everything else. Individual pages can override it by passing an
 * `image` to `pageMetadata`.
 */
export default function OpengraphImage() {
  const { theme } = site;

  return new ImageResponse(
    (
      <div
        style={{
          height: "100%",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: theme.primary,
          padding: "72px",
          position: "relative",
        }}
      >
        <div
          style={{
            position: "absolute",
            top: -180,
            right: -140,
            width: 620,
            height: 620,
            borderRadius: "50%",
            background: theme.accent,
            opacity: 0.28,
            display: "flex",
          }}
        />

        <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
          <div
            style={{
              width: 72,
              height: 72,
              borderRadius: 14,
              background: theme.primaryForeground,
              color: theme.primary,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 30,
              fontWeight: 700,
            }}
          >
            {site.monogram}
          </div>
          <div style={{ display: "flex", flexDirection: "column" }}>
            <div style={{ color: theme.primaryForeground, fontSize: 34, fontWeight: 600 }}>
              {site.businessName}
            </div>
            <div
              style={{
                color: theme.highlight,
                fontSize: 17,
                letterSpacing: 3,
                textTransform: "uppercase",
                marginTop: 6,
              }}
            >
              {site.tagline}
            </div>
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", maxWidth: 900 }}>
          <div
            style={{
              color: theme.primaryForeground,
              fontSize: 62,
              lineHeight: 1.15,
              fontWeight: 600,
            }}
          >
            Clarity for your finances.
          </div>
          <div style={{ color: "rgba(255,255,255,0.65)", fontSize: 62, lineHeight: 1.15 }}>
            Confidence for what&rsquo;s next.
          </div>
        </div>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            borderTop: "1px solid rgba(255,255,255,0.18)",
            paddingTop: 28,
            color: "rgba(255,255,255,0.72)",
            fontSize: 24,
          }}
        >
          <div style={{ display: "flex" }}>
            {cities.map((c) => c.name).join(" · ")}
          </div>
        </div>
      </div>
    ),
    { ...size },
  );
}
