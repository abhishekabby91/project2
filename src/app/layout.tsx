import type { Metadata, Viewport } from "next";
import { Inter, Fraunces } from "next/font/google";
import { site, siteUrl } from "@/content/site";
import { themeCss } from "@/lib/theme";
import { organizationSchema, websiteSchema } from "@/lib/schema";
import { JsonLd } from "@/components/seo/JsonLd";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { MobileCtaBar } from "@/components/layout/MobileCtaBar";
import { SkipLink } from "@/components/layout/SkipLink";
import { Analytics } from "@/components/analytics/Analytics";
import { ConsentManager } from "@/components/consent/ConsentManager";
import { consentModeBootstrap } from "@/lib/consent";
import "./globals.css";

/* Self-hosted at build time by next/font — no render-blocking third-party
   request and no layout shift, because the metrics are inlined. */
const inter = Inter({ subsets: ["latin"], display: "swap", variable: "--font-inter" });

const display = Fraunces({
  subsets: ["latin"],
  display: "swap",
  weight: "variable",
  axes: ["SOFT", "WONK"],
  variable: "--font-serif-display",
});

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: `${site.businessName} | ${site.tagline} in Delhi NCR`,
    template: `%s | ${site.businessName}`,
  },
  description: site.description,
  applicationName: site.businessName,
  authors: [{ name: site.businessName, url: siteUrl }],
  creator: site.businessName,
  publisher: site.businessName,
  formatDetection: { telephone: true, address: true, email: true },
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    locale: "en_IN",
    url: siteUrl,
    siteName: site.businessName,
    title: `${site.businessName} | ${site.tagline}`,
    description: site.description,
  },
  twitter: {
    card: "summary_large_image",
    title: `${site.businessName} | ${site.tagline}`,
    description: site.description,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-image-preview": "large", "max-snippet": -1 },
  },
  ...(process.env.GOOGLE_SITE_VERIFICATION
    ? { verification: { google: process.env.GOOGLE_SITE_VERIFICATION } }
    : {}),
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: site.theme.primary,
  colorScheme: "light",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en-IN" className={`${inter.variable} ${display.variable}`}>
      <head>
        {/* Brand tokens from content/site.ts, before first paint so a re-skin
            never flashes the fallback palette. */}
        <style dangerouslySetInnerHTML={{ __html: themeCss() }} />
        {/* Google Consent Mode v2 defaults. MUST run before gtag.js so nothing
            ever fires with storage granted by accident. */}
        <script dangerouslySetInnerHTML={{ __html: consentModeBootstrap() }} />
        <script dangerouslySetInnerHTML={{ __html: "document.documentElement.classList.add('js')" }} />
      </head>
      <body className="min-h-dvh bg-canvas antialiased">
        <SkipLink />
        <Header />
        <main id="main" className="pb-16 lg:pb-0">
          {children}
        </main>
        <Footer />
        <MobileCtaBar />
        <JsonLd data={[organizationSchema(), websiteSchema()]} />
        <Analytics />
        <ConsentManager />
      </body>
    </html>
  );
}
