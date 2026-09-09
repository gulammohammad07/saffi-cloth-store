import { prisma } from "@/lib/prisma";
import { formatPrice } from "@/lib/utils";

const STATUS_STYLES: Record<string, string> = {
  PENDING: "bg-amber-100 text-amber-700",
  CONFIRMED: "bg-blue-100 text-blue-700",
  SHIPPED: "bg-violet-100 text-violet-700",
  DELIVERED: "bg-green-100 text-green-700",
  CANCELLED: "bg-red-100 text-red-600",
};

function formatDate(date: Date) {
  return date.toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export default async function RecentOrders() {
  const orders = await prisma.order.findMany({
    where: { hiddenFromAdmin: false },
    include: {
      items: { select: { productName: true }, take: 1 },
    },
    orderBy: { createdAt: "desc" },
    take: 6,
  });

  if (orders.length === 0) {
    return (
      <div className="rounded-2xl border bg-white p-6 shadow-sm">
        <h2 className="mb-5 text-xl font-semibold">Recent Orders</h2>
        <div className="text-gray-500">No orders yet.</div>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border bg-white p-6 shadow-sm">
      <h2 className="mb-5 text-xl font-semibold">Recent Orders</h2>

      <div className="space-y-4">
        {orders.map((order) => (
          <div
            key={order.id}
            className="flex items-center justify-between gap-4 border-b border-gray-100 pb-4 last:border-0 last:pb-0"
          >
            <div className="min-w-0">
              <p className="font-semibold text-gray-900">
                {order.orderNumber}
              </p>
              <p className="truncate text-sm text-gray-500">
                {order.customerName} ·{" "}
                {order.items[0]?.productName ?? "—"}
              </p>
              {order.occasion ? (
                <p className="mt-0.5 text-xs font-medium text-amber-700">
                  {order.occasion}
                </p>
              ) : null}
              <p className="text-xs text-gray-400">{formatDate(order.createdAt)}</p>
            </div>

            <div className="text-right">
              <p className="font-semibold text-gray-900">
                {formatPrice(order.total)}
              </p>
              <span
                className={`inline-block rounded-full px-2.5 py-0.5 text-xs font-semibold tracking-wide uppercase ${
                  STATUS_STYLES[order.status] ?? "bg-gray-100 text-gray-600"
                }`}
              >
                {order.status}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
