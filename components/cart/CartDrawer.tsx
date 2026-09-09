"use client";

import { useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { m as motion, AnimatePresence } from "framer-motion";
import { Minus, Plus, ShoppingBag, Trash2, X } from "lucide-react";
import { useCart } from "@/lib/store/cart-context";
import { formatPrice } from "@/lib/utils";

export default function CartDrawer() {
  const { items, isOpen, closeCart, updateQuantity, removeFromCart, subtotal } =
    useCart();

  // Lock page scroll while the bag is open so the page behind doesn't move
  useEffect(() => {
    if (!isOpen) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [isOpen]);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[80] bg-black/50 backdrop-blur-sm"
            onClick={closeCart}
          />
          <motion.aside
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "tween", duration: 0.35, ease: "easeInOut" }}
            className="fixed right-0 top-0 z-[90] flex h-full w-full max-w-md flex-col bg-[#F4EFE6] shadow-2xl"
          >
            <div className="flex items-center justify-between border-b border-[#1C1A17]/10 px-6 py-5">
              <h2 className="font-display text-2xl font-semibold text-ink">
                Your Bag
              </h2>
              <button
                type="button"
                onClick={closeCart}
                className="rounded-full p-2 text-ink/60 hover:bg-black/5"
                aria-label="Close cart"
              >
                <X size={22} />
              </button>
            </div>

            {items.length === 0 ? (
              <div className="flex flex-1 flex-col items-center justify-center gap-4 px-8 text-center">
                <div className="flex h-20 w-20 items-center justify-center rounded-full bg-[#1C1A17]/5">
                  <ShoppingBag size={30} className="text-ink/60" />
                </div>
                <p className="text-base font-medium text-ink">
                  Your bag is empty
                </p>
                <p className="text-sm text-ink/60">
                  Discover our latest styles and bestsellers.
                </p>
                <Link
                  href="/shop"
                  onClick={closeCart}
                  className="mt-2 rounded-full bg-[#1C1A17] px-6 py-3 text-sm font-medium text-white"
                >
                  Shop Clothing
                </Link>
              </div>
            ) : (
              <>
                <div className="flex-1 overflow-y-auto px-6 py-6">
                  <ul className="space-y-6">
                    {items.map(({ product, quantity, size }) => (
                      <li
                        key={`${product.id}-${size ?? "default"}`}
                        className="flex gap-4 border-b border-[#1C1A17]/10 pb-6"
                      >
                        <Link
                          href={`/product/${product.slug}`}
                          onClick={closeCart}
                          className="relative h-24 w-20 shrink-0 overflow-hidden rounded-xl bg-white"
                        >
                          <Image
                            src={product.image}
                            alt={product.name}
                            fill
                            sizes="80px"
                            className="object-contain p-2"
                          />
                        </Link>

                        <div className="flex flex-1 flex-col">
                          <div className="flex items-start justify-between gap-2">
                            <div>
                              <p className="font-medium text-ink">
                                {product.name}
                              </p>
                              <p className="text-xs text-ink/60">
                                {product.volume}
                                {size && size !== product.volume
                                  ? ` • ${size}`
                                  : ""}
                              </p>
                            </div>
                            <button
                              type="button"
                              onClick={() => removeFromCart(product.id, size)}
                              className="text-ink/60 hover:text-red-600"
                              aria-label="Remove item"
                            >
                              <Trash2 size={16} />
                            </button>
                          </div>

                          <div className="mt-auto flex items-center justify-between pt-3">
                            <div className="flex items-center gap-3 rounded-full border border-[#1C1A17]/15 px-3 py-1">
                              <button
                                type="button"
                                onClick={() =>
                                  updateQuantity(
                                    product.id,
                                    quantity - 1,
                                    size,
                                  )
                                }
                                className="text-ink/60"
                                aria-label="Decrease quantity"
                              >
                                <Minus size={14} />
                              </button>
                              <span className="w-5 text-center text-sm font-medium text-ink">
                                {quantity}
                              </span>
                              <button
                                type="button"
                                onClick={() =>
                                  updateQuantity(
                                    product.id,
                                    quantity + 1,
                                    size,
                                  )
                                }
                                className="text-ink/60"
                                aria-label="Increase quantity"
                              >
                                <Plus size={14} />
                              </button>
                            </div>

                            <p className="font-semibold text-ink">
                              {formatPrice(
                                (product.salePrice ?? product.price) *
                                  quantity,
                              )}
                            </p>
                          </div>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="border-t border-[#1C1A17]/10 px-6 py-6">
                  <div className="mb-2 flex items-center justify-between">
                    <span className="text-sm text-ink/60">Subtotal</span>
                    <span className="font-semibold text-ink">
                      {formatPrice(subtotal)}
                    </span>
                  </div>
                  <p className="mb-5 text-xs text-ink/60">
                    Shipping and taxes calculated at checkout.
                  </p>
                  <Link
                    href="/checkout"
                    onClick={closeCart}
                    className="block rounded-full bg-[#1C1A17] py-4 text-center font-medium text-white transition-colors hover:bg-[#1C1A17]/90"
                  >
                    Checkout — {formatPrice(subtotal)}
                  </Link>
                  <Link
                    href="/cart"
                    onClick={closeCart}
                    className="mt-3 flex items-center justify-center gap-2 w-full rounded-full border border-[#1C1A17]/20 py-3 text-sm font-medium text-ink/60 transition-colors hover:border-[#1C1A17] hover:text-ink"
                  >
                    View Full Bag
                  </Link>
                  <button
                    type="button"
                    onClick={closeCart}
                    className="mt-3 w-full rounded-full border border-transparent py-3 text-sm font-medium text-ink/60"
                  >
                    Continue Shopping
                  </button>
                </div>
              </>
            )}
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}
