"use client";

import { useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { m as motion } from "framer-motion";
import { ChevronLeft, ChevronRight, Plus } from "lucide-react";
import type { Product } from "@/lib/data/products";
import { useCart } from "@/lib/store/cart-context";
import { formatPrice } from "@/lib/utils";
import { toast } from "sonner";

export default function TrendingNow({ products }: { products: Product[] }) {
  const trackRef = useRef<HTMLDivElement>(null);
  const { addToCart } = useCart();

  if (products.length === 0) return null;

  const scroll = (dir: 1 | -1) => {
    trackRef.current?.scrollBy({ left: dir * 360, behavior: "smooth" });
  };

  return (
    <section className="bg-[#F3EEE5] py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="mb-14 flex flex-col gap-8 sm:flex-row sm:items-end sm:justify-between"
        >
          <div>
            <p className="text-xs font-semibold tracking-[0.34em] text-gold uppercase">
              Most Coveted
            </p>
            <h2 className="mt-4 font-display text-5xl font-medium tracking-tight text-ink sm:text-6xl">
              Trending Now
            </h2>
          </div>

          <div className="flex gap-3">
            <button
              type="button"
              onClick={() => scroll(-1)}
              aria-label="Scroll left"
              className="flex h-12 w-12 items-center justify-center rounded-full border border-gold/30 text-mute transition-all duration-500 hover:border-gold hover:bg-gold hover:text-ink"
            >
              <ChevronLeft size={18} />
            </button>
            <button
              type="button"
              onClick={() => scroll(1)}
              aria-label="Scroll right"
              className="flex h-12 w-12 items-center justify-center rounded-full border border-gold/30 text-mute transition-all duration-500 hover:border-gold hover:bg-gold hover:text-ink"
            >
              <ChevronRight size={18} />
            </button>
          </div>
        </motion.div>

        <div
          ref={trackRef}
          className="-mx-6 flex snap-x snap-mandatory gap-7 overflow-x-auto px-6 pb-4 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        >
          {products.map((product, i) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.6, delay: i * 0.06, ease: [0.22, 1, 0.36, 1] }}
              className="group w-[300px] shrink-0 snap-start sm:w-[340px]"
            >
              <Link href={`/product/${product.slug}`} className="block">
                <div className="relative aspect-[4/5] overflow-hidden rounded-[28px] border border-[#E3DACB] bg-gradient-to-b from-[#ECE5D8] to-[#F3EEE5] shadow-[0_20px_50px_-18px_rgba(19,17,16,0.12)] transition-all duration-700 group-hover:-translate-y-3 group-hover:border-gold/40 group-hover:shadow-[0_40px_80px_-24px_rgba(188,78,34,0.3)]">
                  <span className="absolute left-6 top-5 z-10 font-display text-6xl font-semibold text-gold/30">
                    {String(i + 1).padStart(2, "0")}
                  </span>

                  <Image
                    src={product.image}
                    alt={product.name}
                    fill
                    sizes="(max-width: 640px) 300px, 340px"
                    className="object-contain p-7 transition-transform duration-700 ease-out group-hover:scale-110"
                  />

                  <button
                    type="button"
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      addToCart(product);
                      toast.success(`${product.name} added to bag`);
                    }}
                    aria-label={`Add ${product.name} to bag`}
                    className="absolute bottom-5 right-5 z-10 flex h-11 w-11 translate-y-3 items-center justify-center rounded-full bg-[#131110] text-white opacity-0 shadow-xl transition-all duration-700 hover:bg-gold hover:text-ink group-hover:translate-y-0 group-hover:opacity-100"
                  >
                    <Plus size={18} />
                  </button>

                  <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-white/90 via-[#F4EFE6]/60 to-transparent p-6 pt-16 backdrop-blur-[4px]">
                    <p className="font-display text-xl font-semibold text-ink">
                      {product.name}
                    </p>
                    <p className="mt-1.5 text-sm text-gold">
                      {formatPrice(product.salePrice ?? product.price)}
                    </p>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
