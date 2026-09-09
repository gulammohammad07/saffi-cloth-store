"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { m as motion } from "framer-motion";
import { CreditCard, Gift, Loader2, Lock, Ticket, X } from "lucide-react";
import { useCart } from "@/lib/store/cart-context";
import { useAuth } from "@/lib/store/auth-context";
import { createOrder } from "@/lib/actions/order.actions";
import PlaceAutocomplete from "@/components/checkout/PlaceAutocomplete";
import {
  COUNTRIES,
  citiesForCountry,
  statesForCountry,
} from "@/lib/data/geo";
import { getCheckoutCouponsAction, validateCouponAction } from "@/lib/actions/coupon.actions";
import { getActiveOccasions } from "@/lib/actions/occasion.actions";
import { getPublicStoreSettings } from "@/lib/actions/settings.actions";
import {
  DEFAULT_FREE_SHIPPING_THRESHOLD,
  DEFAULT_SHIPPING_FEE,
} from "@/lib/constants/shipping";
import { formatPrice } from "@/lib/utils";

type CheckoutOccasion = { id: string; name: string };
type PublicStoreSettings = {
  freeShippingThreshold: number;
  shippingFee: number;
  currency: string;
};
type CheckoutCoupon = { id: string; code: string; discountType: "PERCENTAGE" | "FIXED"; discountValue: number; minOrderValue: number | null; maxDiscountAmount: number | null };

export default function CheckoutPage() {
  const router = useRouter();
  const { items, subtotal, clearCart } = useCart();
  const { user, status } = useAuth();
  const [placed, setPlaced] = useState(false);
  const [orderNumber, setOrderNumber] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [occasions, setOccasions] = useState<CheckoutOccasion[]>([]);
  const [paymentMethod, setPaymentMethod] = useState<"COD" | "RAZORPAY">("COD");
  const [couponCode, setCouponCode] = useState("");
  const [appliedCoupon, setAppliedCoupon] = useState<{ code: string; discount: number } | null>(null);
  const [couponMessage, setCouponMessage] = useState<string | null>(null);
  const [country, setCountry] = useState("India");
  const [city, setCity] = useState("");
  const [stateName, setStateName] = useState("");
  const [couponDrawerOpen, setCouponDrawerOpen] = useState(false);
  const [availableCoupons, setAvailableCoupons] = useState<CheckoutCoupon[]>([]);
  const [storeSettings, setStoreSettings] = useState<PublicStoreSettings>({
    freeShippingThreshold: DEFAULT_FREE_SHIPPING_THRESHOLD,
    shippingFee: DEFAULT_SHIPPING_FEE,
    currency: "INR",
  });
  const idempotencyKeyRef = useRef<string | null>(null);

  useEffect(() => {
    let active = true;
    getActiveOccasions().then((list) => {
      if (active) setOccasions(list);
    });
    getPublicStoreSettings().then((settings) => {
      if (active) setStoreSettings(settings);
    });
    getCheckoutCouponsAction().then((coupons) => {
      if (active) setAvailableCoupons(coupons);
    });
    return () => {
      active = false;
    };
  }, []);

  const shipping =
    subtotal >= storeSettings.freeShippingThreshold ? 0 : storeSettings.shippingFee;
  const total = Math.max(0, subtotal + shipping - (appliedCoupon?.discount ?? 0));

  const getIdempotencyKey = () => {
    if (!idempotencyKeyRef.current) {
      idempotencyKeyRef.current =
        typeof crypto !== "undefined" && "randomUUID" in crypto
          ? crypto.randomUUID()
          : `ck-${Date.now()}-${Math.random().toString(36).slice(2)}`;
    }
    return idempotencyKeyRef.current;
  };

  const handlePlaceOrder = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (submitting) return;
    setError(null);

    if (status === "loading") return;

    if (!user) {
      router.push("/sign-in?next=/checkout");
      return;
    }

    if (items.length === 0) {
      setError("Your cart is empty. Add products before checking out.");
      return;
    }

    const form = new FormData(e.currentTarget);
    const orderInput = {
      idempotencyKey: getIdempotencyKey(),
      customerName: `${form.get("firstName") ?? ""} ${form.get("lastName") ?? ""}`.trim(),
      customerEmail: (form.get("email") as string) ?? "",
      customerPhone: (form.get("phone") as string) ?? "",
      street: (form.get("street") as string) ?? "",
      city: (form.get("city") as string) ?? "",
      state: (form.get("state") as string) ?? "",
      country: (form.get("country") as string) ?? "India",
      pincode: (form.get("pincode") as string) ?? "",
      occasion: (form.get("occasion") as string) ?? "",
      items: items.map(({ product, quantity }) => ({
        productId: product.id,
        quantity,
      })),
      couponCode: appliedCoupon?.code ?? "",
    };
    setSubmitting(true);
    if (paymentMethod === "RAZORPAY") {
      try {
        const response = await fetch("/api/payments/create", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(orderInput) });
        const payment = await response.json();
        if (!response.ok || !payment.success) throw new Error(payment.error ?? "Unable to start payment.");
        await new Promise<void>((resolve, reject) => {
          if ((window as typeof window & { Razorpay?: unknown }).Razorpay) return resolve();
          const script = document.createElement("script"); script.src = "https://checkout.razorpay.com/v1/checkout.js"; script.onload = () => resolve(); script.onerror = () => reject(new Error("Unable to load secure payment checkout.")); document.body.appendChild(script);
        });
        const Razorpay = (window as typeof window & { Razorpay: new (options: Record<string, unknown>) => { open: () => void } }).Razorpay;
        new Razorpay({ key: payment.keyId, amount: payment.amount, currency: payment.currency, name: "Libaas", description: `Order ${payment.orderNumber}`, order_id: payment.razorpayOrderId, prefill: { name: `${form.get("firstName")} ${form.get("lastName")}`, email: form.get("email"), contact: form.get("phone") }, handler: async (response: Record<string, string>) => {
          const verified = await fetch("/api/payments/verify", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ orderId: payment.orderId, ...response }) });
          const result = await verified.json();
          if (!verified.ok || !result.success) { setError(result.error ?? "Payment could not be verified. Please try again from your orders."); setSubmitting(false); return; }
          clearCart(); setOrderNumber(result.orderNumber); setPlaced(true); setSubmitting(false); window.scrollTo({ top: 0, behavior: "smooth" });
        }, modal: { ondismiss: () => { fetch("/api/payments/failure", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ orderId: payment.orderId }) }); setError("Payment was cancelled. You can try again."); setSubmitting(false); } } }).open();
      } catch (paymentError) { setError(paymentError instanceof Error ? paymentError.message : "Unable to start payment."); setSubmitting(false); }
      return;
    }
    const result = await createOrder({ ...orderInput, paymentMethod: "COD" });

    if (!result.success) {
      if (result.notAuthenticated) {
        router.push("/sign-in?next=/checkout");
        return;
      }
      setError(result.error);
      setSubmitting(false);
      return;
    }

    clearCart();
    setOrderNumber(result.orderNumber);
    setPlaced(true);
    setSubmitting(false);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const applyCoupon = async () => {
    setCouponMessage(null);
    const result = await validateCouponAction(couponCode, subtotal);
    if (!result.valid) { setAppliedCoupon(null); setCouponMessage(result.error); return; }
    setAppliedCoupon(result.code ? { code: result.code, discount: result.discount } : null);
    setCouponMessage(result.code ? "Coupon applied." : "Enter a coupon code.");
  };

  const selectCoupon = async (code: string) => {
    setCouponCode(code);
    setCouponDrawerOpen(false);
    const result = await validateCouponAction(code, subtotal);
    if (!result.valid) { setAppliedCoupon(null); setCouponMessage(result.error); return; }
    setAppliedCoupon({ code: result.code, discount: result.discount });
    setCouponMessage("Coupon applied.");
  };

  const removeCoupon = () => {
    setAppliedCoupon(null);
    setCouponCode("");
    setCouponMessage("Coupon removed.");
  };

  if (placed) {
    return (
      <div className="flex min-h-[70vh] flex-col items-center justify-center gap-6 bg-[#F4EFE6] px-6 text-center">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 200, damping: 15 }}
          className="flex h-24 w-24 items-center justify-center rounded-full bg-green-100"
        >
          <span className="text-3xl text-green-600">✓</span>
        </motion.div>
        <h1 className="font-display text-5xl font-medium text-ink">
          Thank You
        </h1>
        <p className="max-w-md text-sm leading-relaxed text-ink/60">
          Your order has been placed successfully.
          {orderNumber ? (
            <>
              {" "}
              Order number{" "}
              <span className="font-semibold text-gold">{orderNumber}</span>
            </>
          ) : null}
          . You can track it from your account.
        </p>
        <div className="flex flex-wrap justify-center gap-4">
          <Link
            href="/account/orders"
            className="rounded-full bg-[#1C1A17] px-8 py-4 text-sm font-semibold text-white hover:bg-gold"
          >
            View My Orders
          </Link>
          <Link
            href="/shop"
            className="rounded-full border border-[#1C1A17] px-8 py-4 text-sm font-semibold text-ink hover:bg-[#1C1A17] hover:text-white"
          >
            Continue Shopping
          </Link>
        </div>
      </div>
    );
  }

  if (status === "loading") {
    return (
      <div className="flex min-h-[70vh] items-center justify-center bg-[#F4EFE6]">
        <div className="h-10 w-10 animate-spin rounded-full border-2 border-[#1C1A17]/15 border-t-gold" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex min-h-[70vh] items-center justify-center bg-[#F4EFE6] px-4 py-16">
        <div className="w-full max-w-md rounded-3xl border border-[#1C1A17]/10 bg-white p-8 text-center shadow-xl">
          <p className="text-sm text-ink/60">
            Please sign in to place your order.
          </p>
          <Link
            href="/sign-in?next=/checkout"
            className="mt-6 inline-block rounded-full bg-[#1C1A17] px-8 py-3 text-sm font-semibold text-white transition-colors hover:bg-gold"
          >
            Sign in
          </Link>
        </div>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="flex min-h-[70vh] flex-col items-center justify-center gap-6 bg-[#F4EFE6] px-6 text-center">
        <h1 className="font-display text-3xl font-medium text-ink">
          Your cart is empty
        </h1>
        <Link
          href="/shop"
          className="rounded-full bg-[#1C1A17] px-8 py-4 text-sm font-semibold text-white transition-colors hover:bg-gold"
        >
          Browse the collection
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F4EFE6] py-14">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <h1 className="font-display text-5xl font-medium text-ink">
          Checkout
        </h1>

        <div className="mt-10 grid gap-10 lg:grid-cols-[1fr_380px]">
          <form onSubmit={handlePlaceOrder} className="space-y-8">
            {/* Contact */}
            <section className="rounded-3xl border border-[#1C1A17]/10 bg-white p-8">
              <h2 className="font-display text-xl font-medium text-ink">
                Contact
              </h2>
              <div className="mt-5 grid gap-4 sm:grid-cols-2">
                <input
                  required
                  name="firstName"
                  placeholder="First name"
                  className="rounded-xl border border-[#1C1A17]/15 px-4 py-3 text-sm focus:border-gold focus:outline-none"
                />
                <input
                  required
                  name="lastName"
                  placeholder="Last name"
                  className="rounded-xl border border-[#1C1A17]/15 px-4 py-3 text-sm focus:border-gold focus:outline-none"
                />
                <input
                  required
                  name="email"
                  type="email"
                  defaultValue={user.email}
                  placeholder="Email"
                  className="rounded-xl border border-[#1C1A17]/15 px-4 py-3 text-sm focus:border-gold focus:outline-none sm:col-span-2"
                />
                <input
                  required
                  name="phone"
                  type="tel"
                  placeholder="Phone"
                  className="rounded-xl border border-[#1C1A17]/15 px-4 py-3 text-sm focus:border-gold focus:outline-none sm:col-span-2"
                />
              </div>
            </section>

            {/* Address */}
            <section className="rounded-3xl border border-[#1C1A17]/10 bg-white p-8">
              <h2 className="font-display text-xl font-medium text-ink">
                Delivery Address
              </h2>
              <div className="mt-5 grid gap-4">
                <input
                  required
                  name="street"
                  placeholder="Street address"
                  className="rounded-xl border border-[#1C1A17]/15 px-4 py-3 text-sm focus:border-gold focus:outline-none"
                />
                <PlaceAutocomplete
                  name="country"
                  value={country}
                  onChange={(next) => {
                    setCountry(next);
                    // A different country means a different address book —
                    // drop any State/City picked for the previous one.
                    setStateName("");
                    setCity("");
                  }}
                  options={COUNTRIES}
                  placeholder="Country"
                  required
                />
                <div className="grid gap-4 sm:grid-cols-3">
                  <PlaceAutocomplete
                    name="city"
                    value={city}
                    onChange={setCity}
                    options={citiesForCountry(country)}
                    placeholder="City"
                    required
                  />
                  <PlaceAutocomplete
                    name="state"
                    value={stateName}
                    onChange={setStateName}
                    options={statesForCountry(country)}
                    placeholder="State"
                    required
                  />
                  <input
                    required
                    name="pincode"
                    inputMode="numeric"
                    pattern="[0-9]{5,6}"
                    title="Enter a valid 5 or 6 digit PIN code"
                    placeholder="PIN code"
                    className="rounded-xl border border-[#1C1A17]/15 px-4 py-3 text-sm focus:border-gold focus:outline-none"
                  />
                </div>
              </div>
            </section>

            {/* Occasion */}
            <section className="rounded-3xl border border-[#1C1A17]/10 bg-white p-8">
              <h2 className="flex items-center gap-2 font-display text-xl font-medium text-ink">
                <Gift size={18} className="text-gold" /> Occasion
              </h2>
              <p className="mt-1 text-xs text-ink/60">
                Is this a gift or for a special occasion? Let us know.
              </p>
              <div className="mt-5">
                <select
                  name="occasion"
                  className="w-full rounded-xl border border-[#1C1A17]/15 px-4 py-3 text-sm focus:border-gold focus:outline-none"
                  defaultValue=""
                >
                  <option value="">Select an occasion (optional)</option>
                  {occasions.map((occasion) => (
                    <option key={occasion.id} value={occasion.name}>
                      {occasion.name}
                    </option>
                  ))}
                  <option value="Birthday">Birthday</option>
                  <option value="Anniversary">Anniversary</option>
                  <option value="Wedding">Wedding</option>
                  <option value="Eid">Eid</option>
                  <option value="Festival">Festival</option>
                </select>
              </div>
            </section>

            {/* Payment */}
            <section className="rounded-3xl border border-[#1C1A17]/10 bg-white p-8">
              <h2 className="flex items-center gap-2 font-display text-xl font-medium text-ink">
                <CreditCard size={18} className="text-gold" /> Payment
              </h2>
              <div className="mt-5 grid gap-3 sm:grid-cols-2">
                {[{ value: "COD", title: "Cash on Delivery", text: "Pay when your order arrives." }, { value: "RAZORPAY", title: "Online Payment", text: "Secure card, UPI, wallet, or netbanking." }].map((option) => <label key={option.value} className={`cursor-pointer rounded-xl border p-4 ${paymentMethod === option.value ? "border-gold bg-gold/5" : "border-[#1C1A17]/15"}`}><input className="sr-only" type="radio" checked={paymentMethod === option.value} onChange={() => setPaymentMethod(option.value as "COD" | "RAZORPAY")} /><Lock size={18} className="text-gold" /><p className="mt-2 text-sm font-medium text-ink">{option.title}</p><p className="mt-1 text-xs text-ink/60">{option.text}</p></label>)}
              </div>
              <button type="button" onClick={() => setCouponDrawerOpen(true)} className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-ink hover:text-gold"><Ticket size={17} className="text-gold" /> View available coupons</button>
            </section>

            {error ? (
              <p
                role="alert"
                className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600"
              >
                {error}
              </p>
            ) : null}

            <button
              type="submit"
              disabled={submitting}
              className="flex w-full items-center justify-center gap-2 rounded-full bg-[#1C1A17] py-4 text-sm font-semibold text-white transition-colors hover:bg-gold disabled:cursor-not-allowed disabled:opacity-60"
            >
              {submitting ? (
                <>
                  <Loader2 size={16} className="animate-spin" />
                  Placing order…
                </>
              ) : (
                `${paymentMethod === "RAZORPAY" ? "Pay securely" : "Place Order"} — ${formatPrice(total)}`
              )}
            </button>
          </form>

          {/* Summary */}
          <div className="h-fit rounded-3xl border border-[#1C1A17]/10 bg-white p-8 lg:sticky lg:top-24">
            <h2 className="font-display text-2xl font-medium text-ink">
              Order Summary
            </h2>

            <ul className="mt-6 space-y-4">
              {items.map(({ product, quantity }) => (
                <li key={product.id} className="flex justify-between gap-4">
                  <span className="text-sm text-ink/60">
                    {product.name}{" "}
                    <span className="text-ink/60">× {quantity}</span>
                  </span>
                  <span className="text-sm font-medium text-ink">
                    {formatPrice(
                      (product.salePrice ?? product.price) * quantity,
                    )}
                  </span>
                </li>
              ))}
            </ul>

            <div className="mt-6 border-t border-[#1C1A17]/10 pt-4">
              <label className="text-sm font-medium text-ink">Coupon Code</label>
              <div className="mt-2 flex gap-2">
                <input value={couponCode} onChange={(event) => setCouponCode(event.target.value.toUpperCase())} placeholder="Enter code" className="min-w-0 flex-1 rounded-xl border border-[#1C1A17]/15 px-3 py-2 text-sm" />
                <button type="button" onClick={applyCoupon} className="rounded-xl bg-[#1C1A17] px-4 py-2 text-xs font-semibold text-white">Apply</button>
              </div>
              {couponMessage && <p className={`mt-2 text-xs ${appliedCoupon ? "text-green-600" : "text-red-600"}`}>{couponMessage}</p>}
              {availableCoupons.length > 0 && <div className="mt-4"><p className="mb-2 text-xs font-semibold uppercase tracking-wide text-ink/60">Available coupons</p><div className="max-h-36 space-y-2 overflow-y-auto pr-1">{availableCoupons.map((coupon) => {
                const selected = appliedCoupon?.code === coupon.code;
                return <div key={coupon.id} className={`flex w-full items-center justify-between rounded-xl border px-3 py-2 text-left transition-colors ${selected ? "border-gold bg-gold/5" : "border-[#1C1A17]/10"}`}><span><span className="block text-xs font-bold text-ink">{coupon.code}</span><span className="block text-xs text-ink/60">{coupon.discountType === "PERCENTAGE" ? `${coupon.discountValue}% off${coupon.maxDiscountAmount ? ` up to ${formatPrice(coupon.maxDiscountAmount)}` : ""}` : `${formatPrice(coupon.discountValue)} off`}{coupon.minOrderValue ? ` · Minimum Order ${formatPrice(coupon.minOrderValue)}` : ""}</span></span><button type="button" onClick={() => selected ? removeCoupon() : selectCoupon(coupon.code)} className={`text-xs font-semibold ${selected ? "text-red-600" : "text-gold"}`}>{selected ? "Remove" : "Apply"}</button></div>;
              })}</div></div>}
            </div>

            <div className="mt-6 space-y-2 border-t border-[#1C1A17]/10 pt-4 text-sm">
              <div className="flex justify-between text-ink/60">
                <span>Subtotal</span>
                <span className="text-ink">{formatPrice(subtotal)}</span>
              </div>
              {appliedCoupon && <div className="flex justify-between text-green-700"><span>Discount ({appliedCoupon.code})</span><span>−{formatPrice(appliedCoupon.discount)}</span></div>}
              <div className="flex justify-between text-ink/60">
                <span>Shipping</span>
                <span className="text-ink">
                  {shipping === 0 ? "Free" : formatPrice(shipping)}
                </span>
              </div>
              <div className="flex justify-between border-t border-[#1C1A17]/10 pt-4 text-base font-semibold text-ink">
                <span>Total</span>
                <span>{formatPrice(total)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      {couponDrawerOpen && <div className="fixed inset-0 z-50"><button type="button" aria-label="Close coupons" className="absolute inset-0 bg-black/40" onClick={() => setCouponDrawerOpen(false)} /><aside role="dialog" aria-modal="true" aria-label="Available coupons" className="absolute right-0 top-0 flex h-full w-full max-w-md flex-col bg-white shadow-2xl"><div className="flex items-center justify-between border-b border-[#1C1A17]/10 p-6"><div><h2 className="font-display text-2xl text-ink">Available Coupons</h2><p className="mt-1 text-xs text-ink/60">Select a coupon to apply it.</p></div><button type="button" onClick={() => setCouponDrawerOpen(false)} className="rounded-full p-2 text-ink hover:bg-[#1C1A17]/10" aria-label="Close"><X size={20} /></button></div><div className="flex-1 space-y-3 overflow-y-auto p-5">{availableCoupons.length ? availableCoupons.map((coupon) => <div key={coupon.id} className="rounded-2xl border border-[#1C1A17]/10 p-4"><div className="flex items-start justify-between gap-3"><div><p className="font-semibold text-ink">{coupon.code}</p><p className="mt-1 text-sm text-ink/60">{coupon.discountType === "PERCENTAGE" ? `${coupon.discountValue}% off${coupon.maxDiscountAmount ? `, up to ${formatPrice(coupon.maxDiscountAmount)}` : ""}` : `${formatPrice(coupon.discountValue)} off`}</p>{coupon.minOrderValue && <p className="mt-1 text-xs text-ink/60">Min. order {formatPrice(coupon.minOrderValue)}</p>}</div><button type="button" onClick={() => selectCoupon(coupon.code)} className="shrink-0 rounded-lg bg-[#1C1A17] px-3 py-2 text-xs font-semibold text-white hover:bg-gold">Apply</button></div></div>) : <p className="py-12 text-center text-sm text-ink/60">No coupons are available right now.</p>}</div></aside></div>}
    </div>
  );
}
