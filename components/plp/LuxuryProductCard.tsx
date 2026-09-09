"use client";

import Image from "next/image";
import Link from "next/link";
import { m as motion } from "framer-motion";
import { Heart, Plus, Star } from "lucide-react";
import type { Product } from "@/lib/data/products";
import { useWishlist } from "@/lib/store/wishlist-context";
import { useCart } from "@/lib/store/cart-context";
import { cn, formatPrice } from "@/lib/utils";
import { toast } from "sonner";

export default function LuxuryProductCard({
  product,
  className,
}: {
  product: Product;
  className?: string;
}) {
  const { isWishlisted, toggleWishlist } = useWishlist();
  const { addToCart } = useCart();

  const wished = isWishlisted(product.id);
  const price = product.salePrice ?? product.price;
  const images = product.gallery.length ? product.gallery : [product.image];

  const handleAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(product);
    toast.success(`${product.name} added to bag`);
  };

  const handleWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleWishlist(product);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
      className={cn(
        "group relative overflow-hidden rounded-[28px] border border-[#E3DACB] bg-white shadow-[0_8px_30px_rgba(19,17,16,0.08)] transition-all duration-700",
        "hover:-translate-y-3 hover:border-gold/40 hover:shadow-[0_40px_80px_-28px_rgba(188,78,34,0.3)]",
        className,
      )}
    >
      <div className="relative aspect-[4/5] overflow-hidden bg-gradient-to-b from-[#ECE5D8] via-[#F4EFE6] to-[#F3EEE5]">
        <div className="absolute left-1/2 top-1/2 h-[70%] w-[70%] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(circle,rgba(188,78,34,0.18),transparent_70%)]" />

        <Link href={`/product/${product.slug}`} className="block h-full w-full">
          <Image
            src={images[0]}
            alt={product.name}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            className="object-contain p-7 transition-transform duration-700 ease-out group-hover:scale-[1.08]"
          />
        </Link>

        {product.badge && (
          <span className="absolute left-5 top-5 z-10 rounded-full border border-gold/30 bg-white/80 px-3.5 py-1.5 text-xs font-bold tracking-[0.18em] text-gold uppercase shadow-lg backdrop-blur-xl">
            {product.badge}
          </span>
        )}

        <button
          type="button"
          onClick={handleWishlist}
          aria-label="Add to wishlist"
          className={cn(
            "absolute right-5 top-5 z-10 flex h-10 w-10 items-center justify-center rounded-full bg-white/70 shadow-[0_8px_24px_rgba(19,17,16,0.12)] backdrop-blur-xl transition-all duration-500 hover:scale-110 hover:bg-gold hover:text-white",
            wished ? "text-red-500" : "text-mute hover:text-red-400",
          )}
        >
          <Heart size={16} fill={wished ? "currentColor" : "none"} />
        </button>

        <button
          type="button"
          onClick={handleAdd}
          className="absolute inset-x-5 bottom-5 z-10 hidden translate-y-5 items-center justify-center gap-2 rounded-full bg-gradient-to-r from-[#131110] to-[#1C1A17] px-5 py-3.5 text-xs font-semibold tracking-[0.16em] text-white uppercase opacity-0 backdrop-blur-xl transition-all duration-700 group-hover:translate-y-0 group-hover:opacity-100 hover:from-gold hover:to-gold-light hover:text-ink lg:flex"
        >
          <Plus size={14} />
          Quick Add
        </button>

        <button
          type="button"
          onClick={handleAdd}
          aria-label={`Add ${product.name} to bag`}
          className="absolute bottom-5 right-5 z-10 flex h-11 w-11 items-center justify-center rounded-full bg-[#131110] text-white shadow-lg transition-all duration-500 hover:bg-gold hover:text-ink lg:hidden"
        >
          <Plus size={18} />
        </button>
      </div>

      <div className="px-6 pb-6 pt-5">
        <div className="flex items-center justify-between">
          <p className="text-xs font-semibold tracking-[0.26em] text-gold uppercase">
            {product.brand}
          </p>
          <span className="flex items-center gap-1.5">
            <Star size={12} className="fill-gold text-gold" />
            <span className="text-xs font-medium text-ink/60">
              {product.rating}
            </span>
            <span className="text-xs text-mute">
              ({product.reviewCount})
            </span>
          </span>
        </div>

        <Link href={`/product/${product.slug}`} className="mt-2 block">
          <h3 className="font-display text-2xl font-semibold leading-snug text-ink transition-colors duration-500 group-hover:text-gold">
            {product.name}
          </h3>
        </Link>

        <div className="mt-3 flex items-baseline gap-2.5">
          <span className="text-base font-semibold tracking-tight text-ink">
            {formatPrice(price)}
          </span>
          {product.salePrice && (
            <span className="text-sm text-mute line-through">
              {formatPrice(product.price)}
            </span>
          )}
          <span className="ml-auto text-xs font-medium tracking-[0.14em] text-mute uppercase">
            {product.volume}
          </span>
        </div>
      </div>
    </motion.div>
  );
}
