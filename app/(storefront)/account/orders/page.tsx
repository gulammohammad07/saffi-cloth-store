import Link from "next/link";
import { Package, ShoppingBag } from "lucide-react";
import { requireUser } from "@/lib/auth/dal";
import { getOrdersByUser } from "@/lib/services/order.service";
import { formatPrice } from "@/lib/utils";

const ORDER_STATUS_STYLES: Record<string, string> = {
  PENDING: "bg-amber-100 text-amber-700",
  CONFIRMED: "bg-blue-100 text-blue-700",
  SHIPPED: "bg-violet-100 text-violet-700",
  DELIVERED: "bg-green-100 text-green-700",
  CANCELLED: "bg-red-100 text-red-600",
};

const PAYMENT_STATUS_STYLES: Record<string, string> = {
  PENDING: "bg-amber-100 text-amber-700",
  PAID: "bg-green-100 text-green-700",
  FAILED: "bg-red-100 text-red-600",
  REFUNDED: "bg-gray-100 text-gray-600",
};

export const metadata = {
  title: "My Orders",
  description: "Track your orders and reorder favourites.",
};

export default async function AccountOrdersPage() {
  const user = await requireUser();
  const orders = await getOrdersByUser(user.id);

  return (
    <div className="min-h-screen bg-[#F4EFE6] px-4 py-14 sm:px-8">
      <div className="mx-auto max-w-4xl">
        <h1 className="font-display text-3xl font-medium text-ink">
          My Orders
        </h1>
        <p className="mt-2 text-sm text-ink/60">
          Track purchases & reorder favourites.
        </p>

        {orders.length === 0 ? (
          <div className="mt-10 flex flex-col items-center justify-center gap-4 rounded-3xl border border-[#1C1A17]/10 bg-white px-6 py-16 text-center shadow-sm">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[#F4EFE6]">
              <Package className="h-8 w-8 text-ink/30" />
            </div>
            <h2 className="font-display text-xl font-medium text-ink">
              No orders yet
            </h2>
            <p className="max-w-sm text-sm text-ink/60">
              When you place an order, it will appear here so you can track its
              status.
            </p>
            <Link
              href="/shop"
              className="mt-2 inline-flex items-center gap-2 rounded-full bg-[#1C1A17] px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-gold"
            >
              <ShoppingBag size={16} />
              Browse the collection
            </Link>
          </div>
        ) : (
          <div className="mt-10 space-y-6">
            {orders.map((order) => (
              <div
                key={order.id}
                className="overflow-hidden rounded-3xl border border-[#1C1A17]/10 bg-white shadow-sm"
              >
                <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#1C1A17]/10 bg-[#F4EFE6]/60 px-6 py-4">
                  <div>
                    <p className="font-display text-base font-medium text-ink">
                      {order.orderNumber}
                    </p>
                    {order.occasion ? (
                      <p className="mt-0.5 text-xs font-medium text-amber-700">
                        {order.occasion}
                      </p>
                    ) : null}
                    <p className="mt-0.5 text-xs text-ink/60">
                      {order.createdAt.toLocaleDateString("en-GB", {
                        day: "numeric",
                        month: "long",
                        year: "numeric",
                      })}
                    </p>
                  </div>
                  <div className="flex flex-wrap items-center gap-2">
                    <span
                      className={`rounded-full px-3 py-1 text-xs font-semibold tracking-wide uppercase ${
                        ORDER_STATUS_STYLES[order.status] ??
                        "bg-gray-100 text-gray-600"
                      }`}
                    >
                      {order.status}
                    </span>
                    <span
                      className={`rounded-full px-3 py-1 text-xs font-semibold tracking-wide uppercase ${
                        PAYMENT_STATUS_STYLES[order.paymentStatus] ??
                        "bg-gray-100 text-gray-600"
                      }`}
                    >
                      {order.paymentStatus === "PENDING"
                        ? "Pay on delivery"
                        : order.paymentStatus}
                    </span>
                  </div>
                </div>

                <div className="divide-y divide-[#1C1A17]/5">
                  {order.items.map((item) => (
                    <div
                      key={item.id}
                      className="flex items-center justify-between gap-4 px-6 py-4"
                    >
                      <div className="flex min-w-0 items-center gap-4">
                        {item.productImage ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img
                            src={item.productImage}
                            alt={item.productName}
                            className="h-14 w-14 shrink-0 rounded-xl object-cover"
                          />
                        ) : (
                          <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-[#F4EFE6]">
                            <Package size={20} className="text-ink/30" />
                          </div>
                        )}
                        <div className="min-w-0">
                          <p className="truncate text-sm font-medium text-ink">
                            {item.productName}
                          </p>
                          <p className="mt-0.5 text-xs text-ink/60">
                            {formatPrice(item.unitPrice)} × {item.quantity}
                          </p>
                        </div>
                      </div>
                      <p className="shrink-0 text-sm font-semibold text-ink">
                        {formatPrice(item.lineTotal)}
                      </p>
                    </div>
                  ))}
                </div>

                <div className="flex flex-wrap items-center justify-between gap-3 border-t border-[#1C1A17]/10 px-6 py-4">
                  <p className="text-xs leading-relaxed text-ink/60">
                    Deliver to: {order.street}, {order.city}, {order.state}{" "}
                    {order.pincode}
                    <br />
                    {order.customerName} · {order.customerPhone}
                  </p>
                  <div className="text-right text-sm">
                    <p className="text-ink/60">
                      Subtotal {formatPrice(order.subtotal)} · Shipping{" "}
                      {order.shippingFee === 0
                        ? "Free"
                        : formatPrice(order.shippingFee)}
                    </p>
                    <p className="mt-0.5 font-display text-base font-medium text-ink">
                      Total {formatPrice(order.total)}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
