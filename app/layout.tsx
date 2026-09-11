import type { Metadata } from "next";
import { Fraunces, Manrope } from "next/font/google";
import "./globals.css";
import { Providers } from "@/lib/store/providers";
import { Toaster } from "@/components/ui/sonner";
import { getStoreSettings } from "@/lib/services/settings.service";
import { siteUrl } from "@/lib/site";

const manrope = Manrope({
  variable: "--font-sans",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

const fraunces = Fraunces({
  variable: "--font-display",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  display: "swap",
});

const metadataDefaults: Metadata = {
  // Needed so relative OG/twitter image paths resolve to absolute URLs, and so
  // the canonical origin matches what robots.ts and sitemap.ts advertise.
  metadataBase: new URL(siteUrl),
  title: {
    default: "Libaas — Premium Clothing Store",
    template: "%s | Libaas",
  },
  description:
    "Hand-curated clothing for men, women and kids. Discover modern style with Libaas.",
  keywords: [
    "clothing",
    "fashion",
    "apparel",
    "menswear",
    "womenswear",
    "Libaas",
  ],
  openGraph: {
    title: "Libaas — Premium Clothing Store",
    description:
      "Hand-curated clothing for men, women and kids. Discover modern style with Libaas.",
    type: "website",
  },
};

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getStoreSettings();
  const title = settings.navbarTitle || settings.storeName;

  return {
    ...metadataDefaults,
    title: { default: title, template: `%s | ${title}` },
    openGraph: { ...metadataDefaults.openGraph, title },
  };
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      data-scroll-behavior="smooth"
      className={`${manrope.variable} ${fraunces.variable} h-full antialiased`}
    >
      <body suppressHydrationWarning className="min-h-full flex flex-col bg-[#F4EFE6] text-ink">
        <Providers>
          <main className="flex-1">{children}</main>
          <Toaster richColors position="bottom-right" />
        </Providers>
      </body>
    </html>
  );
}
