import type { NextConfig } from "next";
import { redirects as clientRedirects } from "./content/redirects";

/**
 * Security headers applied to every response.
 * Adjust the CSP if you add third-party scripts (analytics, chat widgets,
 * scheduling embeds). Keep it as tight as your integrations allow.
 */
const securityHeaders = [
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "X-Frame-Options", value: "SAMEORIGIN" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "X-DNS-Prefetch-Control", value: "on" },
  {
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=(), interest-cohort=()",
  },
  {
    key: "Strict-Transport-Security",
    value: "max-age=63072000; includeSubDomains; preload",
  },
];

const nextConfig: NextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  images: {
    formats: ["image/avif", "image/webp"],
    // Add the hostnames of your image CDN / DAM here when you swap in real photography.
    remotePatterns: [],
  },
  async headers() {
    return [{ source: "/:path*", headers: securityHeaders }];
  },
  /**
   * Redirects from the client's previous site, so a redesign keeps the rankings
   * and inbound links the business already earned. See content/redirects.ts.
   */
  async redirects() {
    return clientRedirects.map((r) => ({
      source: r.source,
      destination: r.destination,
      permanent: r.permanent ?? true,
    }));
  },
};

export default nextConfig;
