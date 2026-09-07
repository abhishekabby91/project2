import { ImageResponse } from "next/og";
import { site } from "@/content/site";

export const size = { width: 32, height: 32 };
export const contentType = "image/png";

/** Favicon drawn from the configured monogram and brand color. */
export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: site.theme.primary,
          color: site.theme.primaryForeground,
          fontSize: site.monogram.length > 2 ? 12 : 15,
          fontWeight: 700,
          letterSpacing: -0.5,
          borderRadius: 6,
        }}
      >
        {site.monogram}
      </div>
    ),
    { ...size },
  );
}
