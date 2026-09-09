"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import type { Product } from "@/lib/data/products";
import ProductCard from "@/components/product/ProductCard";
import SectionHeading from "@/components/landing/SectionHeading";

export default function BestSellers({ products }: { products: Product[] }) {
  const bestSellers = products.filter(
    (p) => p.badge === "Bestseller" || p.rating >= 4.8,
  );
  const items = bestSellers.length > 0 ? bestSellers : products.slice(0, 8);
  const trackRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  // Arrows only enabled when there's actually content in that direction —
  // a live-looking 'scroll left' at the start reads as a bug.
  const updateArrows = useCallback(() => {
    const el = trackRef.current;
    if (!el) return;
    setCanScrollLeft(el.scrollLeft > 4);
    setCanScrollRight(el.scrollLeft < el.scrollWidth - el.clientWidth - 4);
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
    const first = el.firstElementChild as HTMLElement | null;
    const step = (first?.offsetWidth ?? 320) + 24;
    el.scrollBy({ left: dir * step, behavior: "smooth" });
  };

  if (items.length === 0) return null;

  return (
    <section className="relative overflow-hidden bg-[#F4EFE6] py-24 sm:py-32">
      <div className="pointer-events-none absolute left-1/2 top-0 h-px w-[60%] -translate-x-1/2 bg-gradient-to-r from-transparent via-gold/30 to-transparent" />
      <div className="pointer-events-none absolute -right-40 top-1/3 h-[420px] w-[420px] bg-[radial-gradient(circle,rgba(188,78,34,0.1),transparent_70%)]" />

      <div className="mx-auto max-w-7xl px-6">
        <SectionHeading
          eyebrow="Most Loved"
          title="Best Sellers"
          description="The products our clients return for, again and again."
        />

        {/* Dedicated control area above the cards — the arrows never sit on
            top of a product image, and their disabled state doubles as a
            position hint (no 'scroll left' when you're already at the start). */}
        <div className="mb-6 flex items-center justify-center gap-3 sm:justify-end">
          <button
            type="button"
            onClick={() => scroll(-1)}
            disabled={!canScrollLeft}
            aria-disabled={!canScrollLeft}
            className="flex h-10 w-10 items-center justify-center rounded-full border border-ink/15 bg-white/90 text-ink shadow-[0_8px_24px_-8px_rgba(19,17,16,0.3)] backdrop-blur transition-all hover:bg-ink hover:text-white disabled:pointer-events-none disabled:opacity-30 sm:h-12 sm:w-12"
            aria-label="Scroll left"
          >
            <ChevronLeft size={18} />
          </button>
          <button
            type="button"
            onClick={() => scroll(1)}
            disabled={!canScrollRight}
            aria-disabled={!canScrollRight}
            className="flex h-10 w-10 items-center justify-center rounded-full border border-ink/15 bg-white/90 text-ink shadow-[0_8px_24px_-8px_rgba(19,17,16,0.3)] backdrop-blur transition-all hover:bg-ink hover:text-white disabled:pointer-events-none disabled:opacity-30 sm:h-12 sm:w-12"
            aria-label="Scroll right"
          >
            <ChevronRight size={18} />
          </button>
        </div>
      </div>

      {/* Edge-to-edge scroll area, but snap/scroll-padding keeps the first
          card aligned to the page grid instead of bleeding past the left
          viewport edge. */}
      <div>
        <div
          ref={trackRef}
          role="region"
          aria-label="Best sellers"
          className="flex snap-x snap-mandatory gap-6 overflow-x-auto scroll-smooth px-6 pb-4 [scroll-padding-inline:1.5rem] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden lg:px-[max(1.5rem,calc((100vw-80rem)/2+1.5rem))]"
        >
          {items.map((product) => (
            <div
              key={product.id}
              className="w-[300px] shrink-0 snap-start sm:w-[320px]"
            >
              <ProductCard product={product} loading="eager" />
            </div>
          ))}
        </div>
      </div>

    </section>
  );
}