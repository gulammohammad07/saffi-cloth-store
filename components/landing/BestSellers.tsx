"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import Link from "next/link";
import type { Product } from "@/lib/data/products";
import ProductCard from "@/components/product/ProductCard";

export default function BestSellers({ products }: { products: Product[] }) {
  // Sort and select up to 10 top-selling / most popular products
  const items = [...products]
    .filter((p) => Boolean(p.image))
    .sort((a, b) => {
      // 1. Explicit Bestseller badge first
      const aBest = a.badge === "Bestseller" ? 1 : 0;
      const bBest = b.badge === "Bestseller" ? 1 : 0;
      if (aBest !== bBest) return bBest - aBest;

      // 2. High rating (5.0, 4.9, etc.)
      if ((b.rating ?? 0) !== (a.rating ?? 0)) {
        return (b.rating ?? 0) - (a.rating ?? 0);
      }

      // 3. Review count
      return (b.reviewCount ?? 0) - (a.reviewCount ?? 0);
    })
    .slice(0, 10);

  const trackRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  const updateArrows = useCallback(() => {
    const el = trackRef.current;
    if (!el) return;
    setCanScrollLeft(el.scrollLeft > 6);
    setCanScrollRight(el.scrollLeft < el.scrollWidth - el.clientWidth - 6);
  }, []);

  useEffect(() => {
    updateArrows();
    const el = trackRef.current;
    if (!el) return;
    el.addEventListener("scroll", updateArrows, { passive: true });
    window.addEventListener("resize", updateArrows);
    return () => {
      el.removeEventListener("scroll", updateArrows);
      window.removeEventListener("resize", updateArrows);
    };
  }, [updateArrows, items.length]);

  const scroll = (dir: 1 | -1) => {
    const el = trackRef.current;
    if (!el) return;
    const card = el.firstElementChild as HTMLElement | null;
    const step = card ? card.offsetWidth + 24 : 320;
    el.scrollBy({ left: dir * step, behavior: "smooth" });
  };

  if (items.length === 0) return null;

  return (
    <section className="relative overflow-hidden bg-[#F4EFE6] py-16 sm:py-24">
      <div className="pointer-events-none absolute left-1/2 top-0 h-px w-[60%] -translate-x-1/2 bg-gradient-to-r from-transparent via-gold/30 to-transparent" />
      <div className="pointer-events-none absolute -right-40 top-1/3 h-[420px] w-[420px] bg-[radial-gradient(circle,rgba(188,78,34,0.1),transparent_70%)]" />

      {/* Main container — keeping carousel flush within max-w-7xl eliminates empty right space */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        {/* Header */}
        <div className="mb-8 flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <div className="flex items-center gap-3">
              <span className="h-px w-10 bg-gold/80" />
              <p className="text-xs font-semibold tracking-[0.32em] text-gold uppercase">
                Most Loved
              </p>
            </div>
            <h2 className="mt-2 font-display text-3xl font-medium tracking-tight text-ink sm:text-5xl">
              Best Sellers
            </h2>
            <p className="mt-2 text-sm leading-relaxed text-ink/60 sm:text-base">
              The products our clients return for, again and again.
            </p>
          </div>

          <div className="flex items-center gap-3 self-start sm:self-auto">
            <Link
              href="/shop"
              className="mr-2 text-xs font-semibold tracking-wider text-ink/70 uppercase transition-colors hover:text-gold"
            >
              View All &rarr;
            </Link>
            <button
              type="button"
              onClick={() => scroll(-1)}
              disabled={!canScrollLeft}
              aria-disabled={!canScrollLeft}
              className="flex h-10 w-10 items-center justify-center rounded-full border border-ink/15 bg-white/90 text-ink shadow-sm backdrop-blur transition-all hover:bg-ink hover:text-white disabled:pointer-events-none disabled:opacity-30 sm:h-11 sm:w-11"
              aria-label="Scroll left"
            >
              <ChevronLeft size={18} />
            </button>
            <button
              type="button"
              onClick={() => scroll(1)}
              disabled={!canScrollRight}
              aria-disabled={!canScrollRight}
              className="flex h-10 w-10 items-center justify-center rounded-full border border-ink/15 bg-white/90 text-ink shadow-sm backdrop-blur transition-all hover:bg-ink hover:text-white disabled:pointer-events-none disabled:opacity-30 sm:h-11 sm:w-11"
              aria-label="Scroll right"
            >
              <ChevronRight size={18} />
            </button>
          </div>
        </div>

        {/* Carousel: constrained inside max-w-7xl so cards align flush and leave no dead space */}
        <div className="relative overflow-hidden">
          <div
            ref={trackRef}
            role="region"
            aria-label="Best sellers carousel"
            className="flex snap-x snap-mandatory gap-6 overflow-x-auto scroll-smooth pb-4 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
          >
            {items.map((product) => (
              <div
                key={product.id}
                className="w-[270px] sm:w-[290px] lg:w-[calc((100%-4.5rem)/4)] shrink-0 snap-start"
              >
                <ProductCard product={product} loading="eager" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
