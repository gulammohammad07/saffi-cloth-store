import type { Metadata } from "next";
import {
  getStorefrontCategories,
  getStorefrontProducts,
} from "@/lib/services/storefront-data";
import { getActiveOccasions } from "@/lib/actions/occasion.actions";
import type { ActiveOccasion } from "@/lib/actions/occasion.actions";
import type { StorefrontCategory } from "@/lib/services/storefront-data";
import type { Product } from "@/lib/data/products";

import LuxuryProductGrid, {
  type SortOption,
} from "@/components/plp/LuxuryProductGrid";
import TrendingNow from "@/components/plp/TrendingNow";
import Link from "next/link";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Shop",
  description: "Discover our collection of premium clothing.",
};

const VALID_SORTS: SortOption[] = ["popularity", "price-asc", "price-desc", "newest"];

export default async function ShopPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const sp = await searchParams;
  const [products, categories, occasions] = await Promise.all([
    getStorefrontProducts(),
    getStorefrontCategories(),
    getActiveOccasions(),
  ]) as [Product[], StorefrontCategory[], ActiveOccasion[]];

  const categoryParam =
    typeof sp.category === "string" ? sp.category.toLowerCase() : null;
  const occasionParam =
    typeof sp.occasion === "string" ? sp.occasion.toLowerCase() : null;
  const typeParam = typeof sp.type === "string" ? sp.type.toLowerCase() : null;
  const sortParam = typeof sp.sort === "string" ? sp.sort : "popularity";
  const initialSort: SortOption = VALID_SORTS.includes(sortParam as SortOption)
    ? (sortParam as SortOption)
    : "popularity";

  // Categories are linked by slug from the navbar, so match on either the
  // slug or the display name (legacy links used the name).
  const categoryByKey = new Map<string, StorefrontCategory>();
  for (const c of categories) {
    categoryByKey.set(c.slug.toLowerCase(), c);
    categoryByKey.set(c.name.toLowerCase(), c);
  }

  const activeCategory = categoryParam
    ? categoryByKey.get(categoryParam)
    : null;
  const activeOccasion = occasions.find(
    (o) => o.name.toLowerCase().replace(/\s+/g, "-") === occasionParam,
  );

  let filteredProducts = products;
  if (activeCategory) {
    filteredProducts = filteredProducts.filter(
      (p) => p.category.toLowerCase() === activeCategory.name.toLowerCase(),
    );
  }
  if (activeOccasion) {
    filteredProducts = filteredProducts.filter((p) =>
      p.occasions.some(
        (o) => o.toLowerCase() === activeOccasion.name.toLowerCase(),
      ),
    );
  }
  if (typeParam === "men" || typeParam === "women" || typeParam === "kids") {
    filteredProducts = filteredProducts.filter((p) =>
      p.productType.toLowerCase() === typeParam,
    );
  }

  const trending = [...products].sort((a, b) => b.rating - a.rating).slice(0, 8);

  // Category stats split by gender so the chip rail can show only the
  // categories that actually have stock for the selected type (Men/Women/Kids)
  // — clothing stores grow long category lists, so scope them per gender.
  type TypeKey = "men" | "women" | "kids";
  const statByCategory = new Map<
    string,
    { name: string; byType: Record<TypeKey, number> }
  >();
  for (const p of products) {
    const type = (p.productType || "MEN").toLowerCase() as TypeKey;
    const key = p.category.toLowerCase();
    const entry = statByCategory.get(key) ?? {
      name: p.category,
      byType: { men: 0, women: 0, kids: 0 },
    };
    if (type in entry.byType) entry.byType[type] += 1;
    statByCategory.set(key, entry);
  }
  const validTypeParam: TypeKey | null =
    typeParam === "men" || typeParam === "women" || typeParam === "kids"
      ? typeParam
      : null;
  const categoryChips = [...statByCategory.values()]
    .map((entry) => {
      const count = validTypeParam
        ? entry.byType[validTypeParam]
        : entry.byType.men + entry.byType.women + entry.byType.kids;
      const matched = categoryByKey.get(entry.name.toLowerCase());
      return {
        name: entry.name,
        slug: matched?.slug ?? entry.name.toLowerCase().replace(/\s+/g, "-"),
        count,
      };
    })
    .filter((chip) => chip.count > 0)
    .sort((a, b) => b.count - a.count)
    .slice(0, 24);

  const shopUrl = ({
    type,
    category,
  }: {
    type?: TypeKey | null;
    category?: string | null;
  }) => {
    const params = new URLSearchParams();
    if (type) params.set("type", type);
    if (category) params.set("category", category);
    const query = params.toString();
    return query ? `/shop?${query}` : "/shop";
  };

  const isNewArrivals = !activeCategory && !activeOccasion && initialSort === "newest";
  const sectionEyebrow = activeCategory
    ? "Curated"
    : activeOccasion
      ? "Perfect For"
      : typeParam
        ? "Collections"
        : isNewArrivals
          ? "Just Landed"
          : "The Collection";
  const sectionTitle = activeCategory
    ? activeCategory.name
    : activeOccasion
      ? activeOccasion.name
      : typeParam
        ? typeParam === "men"
          ? "Men"
          : typeParam === "women"
            ? "Women"
            : "Kids"
        : isNewArrivals
          ? "New Arrivals"
          : "All Clothing";

  return (
    <>
      <section className="scroll-mt-24 bg-[#F4EFE6] pb-6 pt-10 sm:pb-8 sm:pt-14">
        <div className="mx-auto max-w-7xl px-6">
          {/* Gender — the first cut for clothing. Switching keeps the chosen
              category (e.g. Men → Women while staying on T-Shirts). */}
          <div className="flex flex-wrap items-center gap-3 text-sm">
            {(
              [
                { type: null as TypeKey | null, label: "All" },
                { type: "men" as TypeKey, label: "Men" },
                { type: "women" as TypeKey, label: "Women" },
                { type: "kids" as TypeKey, label: "Kids" },
              ]
            ).map((option) => {
              const isActive = (validTypeParam ?? null) === option.type;
              return (
                <Link
                  key={option.label}
                  href={shopUrl({ type: option.type, category: categoryParam })}
                  aria-current={isActive ? "page" : undefined}
                  className={`rounded-full border px-5 py-2.5 text-xs font-semibold tracking-[0.14em] uppercase transition-all duration-300 ${
                    isActive
                      ? "border-[#131110] bg-[#131110] text-white shadow-[0_8px_20px_-8px_rgba(19,17,16,0.4)]"
                      : "border-gold/30 bg-white/70 text-ink/60 hover:border-gold hover:text-ink"
                  }`}
                >
                  {option.label}
                </Link>
              );
            })}
          </div>

          {/* Category rail — scoped to the selected gender, newest stock first.
              Hidden until products exist so an empty store stays clean. */}
          {categoryChips.length > 0 && (
            <div className="mt-6 flex items-center gap-2.5 overflow-x-auto pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
              {activeCategory && (
                <Link
                  href={shopUrl({ type: validTypeParam, category: null })}
                  className="flex shrink-0 items-center gap-1.5 rounded-full border border-gold/50 bg-gold/10 px-4 py-2 text-xs font-semibold tracking-[0.14em] text-gold uppercase transition-colors duration-300 hover:bg-gold/20"
                >
                  ✕ All categories
                </Link>
              )}
              {categoryChips.map((chip) => {
                const isActive =
                  categoryParam !== null &&
                  (chip.slug.toLowerCase() === categoryParam ||
                    chip.name.toLowerCase() === categoryParam);
                return (
                  <Link
                    key={chip.slug}
                    href={shopUrl({
                      type: validTypeParam,
                      category: chip.slug,
                    })}
                    aria-current={isActive ? "page" : undefined}
                    className={`flex shrink-0 items-center gap-2 rounded-full border px-4 py-2 text-xs transition-colors duration-300 ${
                      isActive
                        ? "border-[#BC4E22] bg-[#BC4E22]/10 text-gold-dark"
                        : "border-[#1C1A17]/12 bg-white/70 text-ink/60 hover:border-gold hover:text-ink"
                    }`}
                  >
                    <span className="font-medium tracking-[0.1em] uppercase">
                      {chip.name}
                    </span>
                    <span
                      className={`flex h-4.5 min-w-4.5 items-center justify-center rounded-full px-1 text-xs font-bold ${
                        isActive
                          ? "bg-[#BC4E22] text-white"
                          : "bg-[#1C1A17]/10 text-mute"
                      }`}
                    >
                      {chip.count}
                    </span>
                  </Link>
                );
              })}
            </div>
          )}
        </div>
      </section>

      <LuxuryProductGrid
        key={categoryParam ?? "all"}
        products={filteredProducts}
        initialSort={initialSort}
        sectionEyebrow={sectionEyebrow}
        sectionTitle={sectionTitle}
      />
      <TrendingNow products={trending} />
    </>
  );
}