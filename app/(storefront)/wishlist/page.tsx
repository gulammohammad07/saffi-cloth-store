"use client";

import Link from "next/link";
import { Heart } from "lucide-react";
import { useWishlist } from "@/lib/store/wishlist-context";
import ProductCard from "@/components/product/ProductCard";

export default function WishlistPage() {
  const { items } = useWishlist();

  return (
    <div className="min-h-screen bg-[#F4EFE6] py-14">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="text-center">
          <p className="text-xs font-semibold tracking-[0.3em] text-gold uppercase">
            Saved for Later
          </p>
          <h1 className="mt-3 font-display text-5xl font-medium text-ink">
            Your Wishlist
          </h1>
        </div>

        {items.length === 0 ? (
          <div className="mt-16 flex flex-col items-center gap-6 text-center">
            <div className="flex h-20 w-20 items-center justify-center rounded-full bg-[#1C1A17]/5">
              <Heart size={32} className="text-ink/30" />
            </div>
            <p className="font-display text-2xl text-ink">
              Nothing saved yet
            </p>
            <p className="max-w-sm text-sm text-ink/60">
              Tap the heart on any product to build your personal collection
              here.
            </p>
            <Link
              href="/shop"
              className="rounded-full bg-[#1C1A17] px-8 py-4 text-sm font-semibold text-white transition-colors hover:bg-gold"
            >
              Explore Clothing
            </Link>
          </div>
        ) : (
          <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {items.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
