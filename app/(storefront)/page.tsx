import Hero from "@/components/landing/Hero";
import Marquee from "@/components/landing/Marquee";
import dynamic from "next/dynamic";

const HomeSections = dynamic(() => import("@/components/landing/HomeSections"), {
  loading: () => (
    <div className="mx-auto max-w-7xl px-6 py-24">
      <div className="h-8 w-48 animate-pulse rounded bg-[#1C1A17]/10" />
      <div className="mt-6 h-4 w-72 animate-pulse rounded bg-[#1C1A17]/10" />
    </div>
  ),
});

import {
  getStorefrontBanners,
  getStorefrontCategories,
  getStorefrontProducts,
} from "@/lib/services/storefront-data";
import { getStoreSettings } from "@/lib/services/settings.service";

export const revalidate = 60;

export default async function Home() {
  const [products, categories, banners, settings] = await Promise.all([
    getStorefrontProducts(),
    getStorefrontCategories(),
    getStorefrontBanners(),
    getStoreSettings(),
  ]);

  const heroBanner = banners.find((b) => b.section === "hero");

  return (
    <>
      <Hero banner={heroBanner} />
      <Marquee freeShippingThreshold={settings.freeShippingThreshold} />
      <HomeSections products={products} categories={categories} />
    </>
  );
}
