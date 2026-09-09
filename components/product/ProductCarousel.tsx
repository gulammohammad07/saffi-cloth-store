"use client";

import { useRef } from "react";
import { m as motion } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import type { Product } from "@/lib/data/products";
import ProductCard from "@/components/product/ProductCard";
import SectionHeading from "@/components/landing/SectionHeading";

export default function ProductCarousel({
  eyebrow,
  title,
  products,
}: {
  eyebrow: string;
  title: string;
  products: Product[];
}) {
  const trackRef = useRef<HTMLDivElement>(null);

  const scroll = (dir: 1 | -1) => {
    trackRef.current?.scrollBy({ left: dir * 320, behavior: "smooth" });
  };

  if (products.length === 0) return null;

  return (
    <section className="bg-[#F4EFE6] py-20">
      <div className="mx-auto max-w-7xl px-6">
        <div className="flex items-end justify-between gap-6">
          <SectionHeading eyebrow={eyebrow} title={title} align="left" />
          <div className="mb-14 flex gap-3">
            <button
              type="button"
              onClick={() => scroll(-1)}
              className="flex h-11 w-11 items-center justify-center rounded-full border border-[#1C1A17]/20 text-ink transition-colors hover:bg-[#1C1A17] hover:text-white"
              aria-label="Scroll left"
            >
              <ChevronLeft size={18} />
            </button>
            <button
              type="button"
              onClick={() => scroll(1)}
              className="flex h-11 w-11 items-center justify-center rounded-full border border-[#1C1A17]/20 text-ink transition-colors hover:bg-[#1C1A17] hover:text-white"
              aria-label="Scroll right"
            >
              <ChevronRight size={18} />
            </button>
          </div>
        </div>

        <div
          ref={trackRef}
          className="-mx-2 flex snap-x snap-mandatory gap-6 overflow-x-auto px-2 pb-4 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        >
          {products.map((product) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4 }}
              className="w-72 shrink-0 snap-start"
            >
              <ProductCard product={product} />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
