import Navbar, { type Department, type NavCategory } from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import WhatsAppButton from "@/components/contact/WhatsAppButton";
import SmoothScroll from "@/components/landing/SmoothScroll";
import { getStorefrontProducts } from "@/lib/services/storefront-data";
import { getStoreSettings } from "@/lib/services/settings.service";

export default async function StorefrontLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [products, settings] = await Promise.all([
    getStorefrontProducts(),
    getStoreSettings(),
  ]);

  // Gender-first category navigation: the navbar is organised around the main
  // categories (Men / Women / Kids) and each carries only its own
  // sub-categories. Group live product counts per (gender, category).
  const perCategory = new Map<
    string,
    { name: string; counts: Record<"men" | "women" | "kids", number> }
  >();
  for (const product of products) {
    const type = (product.productType || "MEN").toLowerCase() as
      | "men"
      | "women"
      | "kids";
    const key = product.category.toLowerCase();
    const entry = perCategory.get(key) ?? {
      name: product.category,
      counts: { men: 0, women: 0, kids: 0 },
    };
    entry.counts[type] += 1;
    perCategory.set(key, entry);
  }

  const departments: Department[] = (["men", "women", "kids"] as const).map(
    (key) => {
      const categories: NavCategory[] = [...perCategory.values()]
        .filter((entry) => entry.counts[key] > 0)
        // The raw category name is used as the URL param — the shop page
        // resolves categories by slug OR display name, so this stays correct
        // for names with hyphens (e.g. "Co-ord Sets") too.
        .map((entry) => ({
          slug: entry.name,
          name: entry.name,
          count: entry.counts[key],
        }))
        .sort((a, b) => b.count - a.count)
        .slice(0, 16);

      const totalCount = categories.reduce((sum, c) => sum + c.count, 0);
      return {
        key,
        title: key === "men" ? "Men" : key === "women" ? "Women" : "Kids",
        tagline:
          key === "men"
            ? "Shirts, kurtas, denim & everyday staples"
            : key === "women"
              ? "Dresses, ethnic wear, tops & more"
              : "Play-ready essentials for little ones",
        totalCount,
        categories,
      };
    },
  );

  return (
    <>
      <SmoothScroll />
      <Navbar
        departments={departments}
        branding={{
          title: settings.navbarTitle,
          titleColor: settings.navbarTitleColor,
          logoUrl: settings.navbarLogoUrl,
          displayMode: settings.navbarDisplayMode,
        }}
      />
      <main className="flex-1">{children}</main>
      <Footer freeShippingThreshold={settings.freeShippingThreshold} />
      <WhatsAppButton phone={settings.supportPhone} storeName={settings.storeName} />
    </>
  );
}
