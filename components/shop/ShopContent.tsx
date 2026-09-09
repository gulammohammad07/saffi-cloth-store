"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";
import { AnimatePresence, m as motion } from "framer-motion";
import { LayoutGrid, List } from "lucide-react";
import type { Product } from "@/lib/data/products";
import ProductCard from "@/components/product/ProductCard";
import ProductSkeleton from "@/components/shop/ProductSkeleton";
import { cn } from "@/lib/utils";

export type SortOption =
  | "popularity"
  | "price-asc"
  | "price-desc"
  | "newest";

const SORT_LABELS: Record<SortOption, string> = {
  popularity: "Popularity",
  "price-asc": "Price: Low to High",
  "price-desc": "Price: High to Low",
  newest: "Newest",
};

const PAGE_SIZE = 8;

export default function ShopContent({ products }: { products: Product[] }) {
  const searchParams = useSearchParams();
  const [params, setParams] = useState({
    category: null as string | null,
    occasion: null as string | null,
    note: null as string | null,
  });
  const [sort, setSort] = useState<SortOption>("popularity");
  const [visible, setVisible] = useState(PAGE_SIZE);
  const [layout, setLayout] = useState<"grid" | "list">("grid");
  const [loading, setLoading] = useState(false);

  const sentinelRef = useRef<HTMLDivElement>(null);
  const timeoutRef = useRef<ReturnType<typeof setTimeout>>(null);

  // Read initial URL params (navbar deep links to category / occasion / note)
  useEffect(() => {
    // URL is external state; syncing from it on navigation is intentional
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setParams({
      category: searchParams.get("category"),
      occasion: searchParams.get("occasion"),
      note: searchParams.get("note"),
    });

    const sortParam = searchParams.get("sort");
    if (sortParam && sortParam in SORT_LABELS) {
      setSort(sortParam as SortOption);
    }
  }, [searchParams]);

  const handleSortChange = (next: SortOption) => {
    setSort(next);
    setVisible(PAGE_SIZE);
  };

  const filtered = useMemo(() => {
    let result = products.filter((product) => {
      if (
        params.category &&
        product.category.toLowerCase() !== params.category.toLowerCase()
      ) {
        return false;
      }
      if (
        params.occasion &&
        !product.occasions.some(
          (o) => o.toLowerCase() === params.occasion!.toLowerCase(),
        )
      ) {
        return false;
      }
      if (params.note) {
        const productNotes = new Set(
          [
            ...product.notes.top,
            ...product.notes.heart,
            ...product.notes.base,
          ].map((n) => n.name.toLowerCase()),
        );
        if (!productNotes.has(params.note.toLowerCase())) return false;
      }
      return true;
    });

    switch (sort) {
      case "price-asc":
        result = [...result].sort(
          (a, b) => (a.salePrice ?? a.price) - (b.salePrice ?? b.price),
        );
        break;
      case "price-desc":
        result = [...result].sort(
          (a, b) => (b.salePrice ?? b.price) - (a.salePrice ?? a.price),
        );
        break;
      case "newest":
        result = [...result].sort((a, b) => b.id.localeCompare(a.id));
        break;
      default:
        result = [...result].sort((a, b) => b.rating - a.rating);
    }

    return result;
  }, [products, params, sort]);

  const visibleProducts = filtered.slice(0, visible);
  const hasMore = visible < filtered.length;

  // Infinite scroll
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !loading) {
          setLoading(true);
          timeoutRef.current = setTimeout(() => {
            setVisible((v) => v + PAGE_SIZE);
            setLoading(false);
          }, 600);
        }
      },
      { rootMargin: "200px" },
    );

    if (sentinelRef.current) observer.observe(sentinelRef.current);
    return () => {
      observer.disconnect();
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, [hasMore, loading]);

  return (
    <div className="min-h-screen bg-[#F4EFE6]">
      {/* Page header */}
      <div className="border-b border-[#1C1A17]/10 bg-[#EDE6DA]">
        <div className="mx-auto max-w-7xl px-4 py-14 text-center sm:px-6">
          <p className="text-xs font-semibold tracking-[0.3em] text-gold uppercase">
            The Collection
          </p>
          <h1 className="mt-3 font-display text-5xl font-medium text-ink">
            Shop Clothing
          </h1>
          <p className="mx-auto mt-4 max-w-md text-sm text-ink/60">
            {filtered.length} curated styles · ready to ship and ready to wear.
          </p>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
        {/* Toolbar */}
        <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
          <div className="text-sm text-ink/60">
            Showing{" "}
            <span className="font-semibold text-ink">
              {visibleProducts.length}
            </span>{" "}
            of {filtered.length} products
          </div>

          <div className="flex items-center gap-3">
            {/* Layout toggle */}
            <div className="flex rounded-full border border-[#1C1A17]/15 p-1">
              <button
                type="button"
                onClick={() => setLayout("grid")}
                aria-label="Grid layout"
                className={cn(
                  "rounded-full p-2 transition-colors",
                  layout === "grid"
                    ? "bg-[#1C1A17] text-white"
                    : "text-ink/60",
                )}
              >
                <LayoutGrid size={16} />
              </button>
              <button
                type="button"
                onClick={() => setLayout("list")}
                aria-label="List layout"
                className={cn(
                  "rounded-full p-2 transition-colors",
                  layout === "list"
                    ? "bg-[#1C1A17] text-white"
                    : "text-ink/60",
                )}
              >
                <List size={16} />
              </button>
            </div>

            {/* Sort */}
            <select
              value={sort}
              onChange={(e) => handleSortChange(e.target.value as SortOption)}
              className="rounded-full border border-[#1C1A17]/15 bg-white px-4 py-2.5 text-sm font-medium text-ink focus:border-gold focus:outline-none"
              aria-label="Sort products"
            >
              {(Object.keys(SORT_LABELS) as SortOption[]).map((key) => (
                <option key={key} value={key}>
                  {SORT_LABELS[key]}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Grid */}
        <motion.div
          layout
          className={cn(
            "grid gap-6",
            layout === "grid"
              ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
              : "grid-cols-1",
          )}
        >
          <AnimatePresence mode="popLayout">
            {visibleProducts.map((product) => (
              <motion.div
                key={product.id}
                layout
                initial={{ opacity: 0, scale: 0.96 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.96 }}
                transition={{ duration: 0.3 }}
              >
                <ProductCard product={product} className="h-full" />
              </motion.div>
            ))}
          </AnimatePresence>

          {loading &&
            Array.from({ length: 4 }).map((_, i) => (
              <ProductSkeleton key={`skeleton-${i}`} />
            ))}
        </motion.div>

        {filtered.length === 0 && (
          <div className="py-24 text-center">
            <p className="font-display text-3xl font-medium text-ink">
              No products found
            </p>
            <p className="mt-3 text-sm text-ink/60">
              Try a different category or note.
            </p>
          </div>
        )}

        {/* Infinite scroll sentinel */}
        <div ref={sentinelRef} className="h-10" />

        {!hasMore && filtered.length > 0 && (
          <p className="py-8 text-center text-xs tracking-[0.2em] text-ink/60 uppercase">
            You&apos;ve reached the end ✦
          </p>
        )}
      </div>
    </div>
  );
}
