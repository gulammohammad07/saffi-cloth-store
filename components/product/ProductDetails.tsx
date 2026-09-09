"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { m as motion } from "framer-motion";
import {
  Check,
  Heart,
  Minus,
  Plus,
  RefreshCcw,
  Share2,
  ShoppingBag,
  Star,
  Truck,
  Zap,
} from "lucide-react";
import type { Product } from "@/lib/data/products";
import { useWishlist } from "@/lib/store/wishlist-context";
import { useCart } from "@/lib/store/cart-context";
import { cn, formatPrice } from "@/lib/utils";
import { DEFAULT_FREE_SHIPPING_THRESHOLD } from "@/lib/constants/shipping";
import { toast } from "sonner";
import ProductViewer from "@/components/product/ProductViewer";
import NotesPyramid from "@/components/product/NotesPyramid";
import ProductReviews from "@/components/product/ProductReviews";
import ProductCarousel from "@/components/product/ProductCarousel";
import type { ReviewAggregate } from "@/lib/actions/review.actions";

const tabs = ["Description", "Details", "Reviews", "Shipping"] as const;

export default function ProductDetails({
  product,
  related,
  allProducts,
  freeShippingThreshold = DEFAULT_FREE_SHIPPING_THRESHOLD,
}: {
  product: Product;
  related: Product[];
  allProducts: Product[];
  freeShippingThreshold?: number;
}) {
  const { isWishlisted, toggleWishlist } = useWishlist();
  const { addToCart } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [selectedSize, setSelectedSize] = useState<string>(
    product.sizes?.[0]?.size || product.volume || "",
  );
  const [activeTab, setActiveTab] = useState<(typeof tabs)[number]>(
    "Description",
  );
  const [recentlyViewed, setRecentlyViewed] = useState<Product[]>([]);

  // Single owner of review state: the header count, the summary average and
  // the distribution bars all render from this aggregate, which the Reviews
  // tab refreshes after every load or submit.
  const [reviewAgg, setReviewAgg] = useState<ReviewAggregate | null>(null);
  const displayRating = reviewAgg?.average ?? product.rating;
  const displayReviewCount = reviewAgg?.count ?? product.reviewCount;

  const wished = isWishlisted(product.id);
  const price = useMemo(() => {
    if (selectedSize && product.sizes) {
      const sizeItem = product.sizes.find((s) => s.size === selectedSize);
      if (sizeItem) return sizeItem.price;
    }
    return product.salePrice ?? product.price;
  }, [selectedSize, product.sizes, product.salePrice, product.price]);

  const displayPrice = selectedSize
    ? price
    : product.salePrice ?? product.price;
  const discount = product.salePrice
    ? Math.round(((product.price - product.salePrice) / product.price) * 100)
    : 0;
  const stockPercent = Math.min(100, Math.round((product.stock / 30) * 100));
  const lowStock = product.stock <= 6;

  // Recently viewed (syncs from localStorage — external store)
  useEffect(() => {
    try {
      const stored = JSON.parse(localStorage.getItem("md-recent") || "[]");
      const list = [product.id, ...stored.filter((id: string) => id !== product.id)]
        .slice(0, 8);
      localStorage.setItem("md-recent", JSON.stringify(list));
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setRecentlyViewed(
        list
          .map((id: string) => allProducts.find((p) => p.id === id))
          .filter(Boolean) as Product[],
      );
    } catch {
      // ignore
    }
  }, [product.id, allProducts]);

  const share = async () => {
    const url = window.location.href;
    if (navigator.share) {
      await navigator.share({ title: product.name, url });
    } else {
      await navigator.clipboard.writeText(url);
      toast.success("Link copied to clipboard");
    }
  };

  const handleAddToCart = () => {
    const size = selectedSize || product.volume;
    addToCart(product, quantity, size);
    toast.success(`${product.name} added to bag`);
  };

  const deliveryDate = useMemo(() => {
    const d = new Date();
    d.setDate(d.getDate() + 3);
    return d.toLocaleDateString("en-IN", {
      weekday: "short",
      day: "numeric",
      month: "short",
    });
  }, []);

  return (
    <div className="min-h-screen bg-[#F4EFE6] pb-20">
      {/* Breadcrumb */}
      <div className="mx-auto max-w-7xl px-4 pt-6 sm:px-6">
        <nav className="flex items-center gap-2 text-xs text-ink/60">
          <Link href="/" className="hover:text-gold">
            Home
          </Link>
          <span>/</span>
          <Link href="/shop" className="hover:text-gold">
            Shop
          </Link>
          <span>/</span>
          <Link
            href={`/shop?category=${product.category.toLowerCase()}`}
            className="capitalize hover:text-gold"
          >
            {product.category}
          </Link>
          <span>/</span>
          <span className="font-medium text-ink">{product.name}</span>
        </nav>
      </div>

      {/* Main */}
      <div className="mx-auto max-w-7xl px-4 pt-8 sm:px-6">
        <div className="grid gap-12 lg:grid-cols-2">
          {/* Viewer */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <ProductViewer product={product} />
          </motion.div>

          {/* Info */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <p className="text-xs font-semibold tracking-[0.25em] text-gold uppercase">
              {product.brand}
            </p>

            <h1 className="mt-3 font-display text-3xl font-medium text-ink sm:text-5xl">
              {product.name}
            </h1>

            {/* Rating */}
            <div className="mt-4 flex items-center gap-2">
              <div className="flex gap-0.5">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    size={15}
                    className={
                      i < Math.round(displayRating)
                        ? "fill-gold text-gold"
                        : "text-ink/30"
                    }
                  />
                ))}
              </div>
              <span className="text-sm font-medium text-ink">
                {displayRating}
              </span>
              <span className="text-sm text-ink/60">
                ({displayReviewCount} reviews)
              </span>
            </div>

            {/* Price */}
            <div className="mt-6 flex items-center gap-3">
              <span className="text-3xl font-semibold text-ink">
                {formatPrice(price)}
              </span>
              {product.salePrice && (
                <>
                  <span className="text-xl text-ink/30 line-through">
                    {formatPrice(product.price)}
                  </span>
                  <span className="rounded-full bg-red-100 px-2.5 py-1 text-xs font-bold text-red-600">
                    Save {discount}%
                  </span>
                </>
              )}
            </div>

            {/* Stock indicator */}
            <div className="mt-6">
              <div className="flex items-center justify-between text-xs">
                <span
                  className={cn(
                    "font-medium",
                    lowStock ? "text-red-600" : "text-green-700",
                  )}
                >
                  {lowStock ? (
                    <>
                      Only {product.stock} left in stock
                    </>
                  ) : (
                    "In stock — ready to ship"
                  )}
                </span>
                <span className="text-ink/60">{stockPercent}%</span>
              </div>
              <div className="mt-1.5 h-1.5 overflow-hidden rounded-full bg-[#1C1A17]/10">
                <div
                  className={cn(
                    "h-full rounded-full",
                    lowStock ? "bg-red-500" : "bg-green-600",
                  )}
                  style={{ width: `${stockPercent}%` }}
                />
              </div>
            </div>

            {/* Description */}
            <p className="mt-6 text-sm leading-relaxed text-ink/60">
              {product.description}
            </p>

            {/* Meta chips */}
            <div className="mt-5 flex flex-wrap gap-2">
            {[
              product.volume,
              product.productType === "MEN"
                ? "Men"
                : product.productType === "WOMEN"
                  ? "Women"
                  : "Kids",
              product.category,
              ...product.occasions,
            ].map((tag, idx) => (
              <span
                key={`${tag}-${idx}`}
                className="rounded-full border border-[#1C1A17]/15 px-3 py-1 text-xs text-ink/60"
              >
                {tag}
              </span>
            ))}
            </div>

            {/* Size selector */}
            {product.sizes && product.sizes.length > 0 && (
              <div className="mt-6">
                <label className="mb-2 block font-medium">Select Size</label>
                <div className="flex flex-wrap gap-2">
                  {product.sizes.map((sizeItem) => (
                    <button
                      key={sizeItem.id}
                      type="button"
                      onClick={() => setSelectedSize(sizeItem.size)}
                      className={`rounded-full border px-4 py-2 text-sm transition-colors ${
                        selectedSize === sizeItem.size
                          ? "border-[#131110] bg-[#131110] text-white"
                          : "border-[#1C1A17]/20 bg-white text-ink hover:border-gold"
                      }`}
                    >
                      {sizeItem.size}
                      <span className="ml-2 text-xs opacity-70">
                        {formatPrice(sizeItem.price)}
                      </span>
                    </button>
                  ))}
                </div>
                {!selectedSize && (
                  <p className="mt-2 text-xs text-ink/60">Please select a size</p>
                )}
              </div>
            )}

            {/* Quantity + CTA */}
            <div className="mt-8 flex flex-col gap-4 sm:flex-row">
              <div className="flex items-center justify-between rounded-full border border-[#1C1A17]/20 px-5 sm:w-36">
                <button
                  type="button"
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  className="py-4 text-ink/60"
                  aria-label="Decrease quantity"
                >
                  <Minus size={16} />
                </button>
                <span className="font-semibold text-ink">{quantity}</span>
                <button
                  type="button"
                  onClick={() => setQuantity((q) => q + 1)}
                  className="py-4 text-ink/60"
                  aria-label="Increase quantity"
                >
                  <Plus size={16} />
                </button>
              </div>

              <button
                type="button"
                onClick={handleAddToCart}
                className="flex flex-1 items-center justify-center gap-2 rounded-full bg-[#1C1A17] py-4 text-sm font-semibold text-white transition-colors hover:bg-gold"
              >
                <ShoppingBag size={18} />
                Add to Bag — {formatPrice(displayPrice * quantity)}
              </button>
            </div>

            <div className="mt-3 flex gap-3">
              <Link
                href="/checkout"
                onClick={handleAddToCart}
                className="flex flex-1 items-center justify-center gap-2 rounded-full border-2 border-[#1C1A17] py-3.5 text-sm font-semibold text-ink transition-colors hover:bg-[#1C1A17] hover:text-white"
              >
                <Zap size={16} />
                Buy Now
              </Link>

              <button
                type="button"
                onClick={() => toggleWishlist(product)}
                aria-label="Toggle wishlist"
                className={cn(
                  "flex h-12 w-12 items-center justify-center rounded-full border-2 transition-colors",
                  wished
                    ? "border-red-200 bg-red-50 text-red-500"
                    : "border-[#1C1A17]/20 text-ink/60 hover:border-gold hover:text-gold",
                )}
              >
                <Heart size={18} fill={wished ? "currentColor" : "none"} />
              </button>

              <button
                type="button"
                onClick={share}
                aria-label="Share product"
                className="flex h-12 w-12 items-center justify-center rounded-full border-2 border-[#1C1A17]/20 text-ink/60 transition-colors hover:border-gold hover:text-gold"
              >
                <Share2 size={18} />
              </button>
            </div>

            {/* Delivery info */}
            <div className="mt-8 grid gap-3 sm:grid-cols-3">
              <div className="rounded-2xl border border-[#1C1A17]/10 bg-white p-4">
                <Truck size={18} className="text-gold" />
                <p className="mt-2 text-xs font-semibold text-ink">
                  Free Delivery
                </p>
                <p className="mt-0.5 text-xs text-ink/60">
                  Arrives by {deliveryDate}
                </p>
              </div>

              <div className="rounded-2xl border border-[#1C1A17]/10 bg-white p-4">
                <RefreshCcw size={18} className="text-gold" />
                <p className="mt-2 text-xs font-semibold text-ink">
                  NO Returns
                </p>
                <p className="mt-0.5 text-xs text-ink/60">
                  {/* 14-day return window */}
                </p>
              </div>

              <div className="rounded-2xl border border-[#1C1A17]/10 bg-white p-4">
                <Check size={18} className="text-gold" />
                <p className="mt-2 text-xs font-semibold text-ink">
                  Authentic
                </p>
                <p className="mt-0.5 text-xs text-ink/60">
                  Certified genuine
                </p>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Tabs */}
        <div className="mt-20">
          <div className="flex gap-8 overflow-x-auto border-b border-[#1C1A17]/15 [scrollbar-width:none]">
            {tabs.map((tab) => (
              <button
                key={tab}
                type="button"
                onClick={() => setActiveTab(tab)}
                className={cn(
                  "relative whitespace-nowrap pb-4 text-sm font-semibold tracking-wide transition-colors",
                  activeTab === tab
                    ? "text-ink"
                    : "text-ink/60 hover:text-ink/60",
                )}
              >
                {tab}
                {tab === "Reviews" && (
                  <span className="ml-1 text-xs text-gold">
                    ({displayReviewCount})
                  </span>
                )}
                {activeTab === tab && (
                  <span className="animate-underline absolute inset-x-0 bottom-0 h-0.5 origin-left bg-gold" />
                )}
              </button>
            ))}
          </div>

          <div className="py-10">
            {activeTab === "Description" && (
              <div className="max-w-3xl space-y-5">
                <p className="leading-relaxed text-ink/60">
                  {product.description}
                </p>
                <p className="leading-relaxed text-ink/60">
                  A{" "}
                  <span className="font-medium text-ink">
                    {product.category.toLowerCase()}
                  </span>{" "}
                  piece from {product.brand}, crafted for{" "}
                  {product.productType === "MEN"
                    ? "men"
                    : product.productType === "WOMEN"
                      ? "women"
                      : "kids"}{" "}
                  in {product.volume.toLowerCase()}. Premium fabrics,
                  true-to-size fit and finishes that are made to be worn and
                  loved every day.
                </p>
              </div>
            )}

            {activeTab === "Details" && (
              <div className="max-w-2xl">
                <NotesPyramid notes={product.notes} />
              </div>
            )}

            {activeTab === "Reviews" && (
              <ProductReviews
                product={product}
                aggregate={reviewAgg}
                onAggregateChange={setReviewAgg}
              />
            )}

            {activeTab === "Shipping" && (
              <div className="max-w-2xl space-y-4 text-sm leading-relaxed text-ink/60">
                <p>
                  <span className="font-semibold text-ink">
                    Delivery:{" "}
                  </span>
                  Dispatched within 24 hours. Free standard shipping on orders
                  over {formatPrice(freeShippingThreshold)}; express delivery
                  available at checkout.
                </p>
                <p>
                  <span className="font-semibold text-ink">Returns: </span>
                  Unopened items may be returned within 14 days for a full
                  refund.
                </p>
                <p>
                  <span className="font-semibold text-ink">
                    Gift Packaging:{" "}
                  </span>
                  Complimentary premium gift wrapping with every order.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Related */}
      <div className="mt-10">
        <ProductCarousel
          eyebrow="Pairs Perfectly"
          title="You May Also Love"
          products={related}
        />
      </div>

      {/* Recently viewed */}
      {recentlyViewed.length > 0 && (
        <ProductCarousel
          eyebrow="Continue Browsing"
          title="Recently Viewed"
          products={recentlyViewed.slice(0, 6)}
        />
      )}
    </div>
  );
}
