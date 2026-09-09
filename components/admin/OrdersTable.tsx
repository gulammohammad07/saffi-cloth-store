"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import {
  Download,
  Loader2,
  RefreshCw,
  RotateCcw,
  Search,
  Trash2,
} from "lucide-react";
import OrderStatusSelect from "@/components/admin/OrderStatusSelect";
import { formatPrice } from "@/lib/utils";
import {
  deleteOrderAction,
  deleteOrdersAction,
  restoreOrderAction,
  restoreOrdersAction,
} from "@/lib/actions/order.actions";

interface OrderItem {
  id: string;
  productName: string;
  quantity: number;
  unitPrice: number;
  lineTotal: number;
}

interface Order {
  id: string;
  orderNumber: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  street: string;
  city: string;
  state: string;
  pincode: string;
  subtotal: number;
  shippingFee: number;
  total: number;
  occasion: string | null;
  status: string;
  paymentStatus: string;
  createdAt: string | Date;
  items: OrderItem[];
  user: {
    id: string;
    name: string;
    email: string;
  };
}

type Filters = { search?: string; from?: string; to?: string };
type OrderView = "active" | "deleted";

function formatDate(value: string | Date) {
  const date = value instanceof Date ? value : new Date(value);
  return date.toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

const PAYMENT_BADGE: Record<string, string> = {
  PENDING: "bg-amber-100 text-amber-700",
  PAID: "bg-green-100 text-green-700",
  FAILED: "bg-red-100 text-red-600",
  REFUNDED: "bg-gray-100 text-gray-600",
};

export default function OrdersTable({
  orders,
  filters,
  view = "active",
  hiddenCount = 0,
}: {
  orders: Order[];
  filters: Filters;
  view?: OrderView;
  hiddenCount?: number;
}) {
  const router = useRouter();
  const selectAllRef = useRef<HTMLInputElement>(null);

  const isDeletedView = view === "deleted";

  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [deleting, setDeleting] = useState(false);
  const [search, setSearch] = useState(filters.search ?? "");
  const [from, setFrom] = useState(filters.from ?? "");
  const [to, setTo] = useState(filters.to ?? "");

  const allSelected = orders.length > 0 && selected.size === orders.length;
  const someSelected = selected.size > 0 && !allSelected;

  useEffect(() => {
    if (selectAllRef.current) {
      selectAllRef.current.indeterminate = someSelected;
    }
  }, [someSelected]);

  const buildQuery = (overrides: { view?: OrderView } = {}) => {
    const params = new URLSearchParams();
    if (search.trim()) params.set("search", search.trim());
    if (from) params.set("from", from);
    if (to) params.set("to", to);
    const nextView = overrides.view ?? view;
    if (nextView === "deleted") params.set("view", "deleted");
    return params.toString();
  };

  const exportUrl = useMemo(() => {
    const params = new URLSearchParams();
    if (search.trim()) params.set("search", search.trim());
    if (from) params.set("from", from);
    if (to) params.set("to", to);
    const qs = params.toString();
    return qs ? `/api/orders/export?${qs}` : "/api/orders/export";
  }, [search, from, to]);

  const applyFilters = (e: React.FormEvent) => {
    e.preventDefault();
    const qs = buildQuery();
    router.push(qs ? `/admin/orders?${qs}` : "/admin/orders");
  };

  const switchView = (nextView: OrderView) => {
    setSelected(new Set());
    const qs = buildQuery({ view: nextView });
    router.push(qs ? `/admin/orders?${qs}` : "/admin/orders");
  };

  const resetFilters = () => {
    setSearch("");
    setFrom("");
    setTo("");
    setSelected(new Set());
    router.push(isDeletedView ? "/admin/orders?view=deleted" : "/admin/orders");
  };

  const toggleOne = (id: string) => {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const toggleAll = () => {
    setSelected((prev) => {
      if (prev.size === orders.length) return new Set();
      return new Set(orders.map((order) => order.id));
    });
  };

  const handleDeleteOne = async (id: string, orderNumber: string) => {
    if (
      !window.confirm(
        `Remove order ${orderNumber} from the admin panel? The customer will still see it in their order history.`,
      )
    ) {
      return;
    }
    const result = await deleteOrderAction(id);
    if (result.success) {
      toast.success(`Order ${orderNumber} removed from the panel.`);
      router.refresh();
    } else {
      toast.error(result.error ?? "Failed to delete order.");
    }
  };

  const handleRestoreOne = async (id: string, orderNumber: string) => {
    const result = await restoreOrderAction(id);
    if (result.success) {
      toast.success(`Order ${orderNumber} restored.`);
      router.refresh();
    } else {
      toast.error(result.error ?? "Failed to restore order.");
    }
  };

  const handleDeleteSelected = async () => {
    if (selected.size === 0) return;
    if (
      !window.confirm(
        `Remove ${selected.size} selected order(s) from the admin panel? Customers keep them in their order history, and you can restore them from the Deleted tab.`,
      )
    ) {
      return;
    }
    setDeleting(true);
    const result = await deleteOrdersAction([...selected]);
    setDeleting(false);
    if (result.success) {
      toast.success("Selected orders removed from the panel.");
      setSelected(new Set());
      router.refresh();
    } else {
      toast.error(result.error ?? "Failed to delete selected orders.");
    }
  };

  const handleRestoreSelected = async () => {
    if (selected.size === 0) return;
    setDeleting(true);
    const result = await restoreOrdersAction([...selected]);
    setDeleting(false);
    if (result.success) {
      toast.success("Selected orders restored.");
      setSelected(new Set());
      router.refresh();
    } else {
      toast.error(result.error ?? "Failed to restore selected orders.");
    }
  };

  return (
    <div className="space-y-6">
      {/* Active / Deleted tabs */}
      <div className="flex items-center gap-2 border-b border-gray-200">
        <button
          type="button"
          onClick={() => switchView("active")}
          className={`-mb-px border-b-2 px-4 py-2.5 text-sm font-semibold transition-colors ${
            isDeletedView
              ? "border-transparent text-gray-500 hover:text-gray-800"
              : "border-zinc-950 text-zinc-950"
          }`}
        >
          Active
        </button>
        <button
          type="button"
          onClick={() => switchView("deleted")}
          className={`-mb-px flex items-center gap-2 border-b-2 px-4 py-2.5 text-sm font-semibold transition-colors ${
            isDeletedView
              ? "border-zinc-950 text-zinc-950"
              : "border-transparent text-gray-500 hover:text-gray-800"
          }`}
        >
          Deleted
          {hiddenCount > 0 && (
            <span className="rounded-full bg-gray-100 px-2 py-0.5 text-xs font-semibold text-gray-600">
              {hiddenCount}
            </span>
          )}
        </button>
      </div>

      {isDeletedView && (
        <p className="rounded-xl bg-amber-50 px-4 py-3 text-sm text-amber-800">
          These orders are hidden from the Active list but still appear in each
          customer&apos;s order history and still count toward your totals.
          Restore one to bring it back into the panel.
        </p>
      )}

      {/* Filters */}
      <form
        onSubmit={applyFilters}
        className="flex flex-wrap items-end gap-3 rounded-2xl border bg-white p-4 shadow-sm"
      >
        <div className="min-w-[240px] flex-1">
          <label className="mb-1.5 block text-xs font-semibold text-gray-500 uppercase">
            Search order
          </label>
          <div className="relative">
            <Search
              size={16}
              className="pointer-events-none absolute top-1/2 left-3 -translate-y-1/2 text-gray-400"
            />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Order ID, name or email…"
              className="h-10 w-full rounded-lg border border-gray-300 pr-3 pl-9 text-sm focus:border-gold focus:ring-2 focus:ring-gold/20 focus:outline-none"
            />
          </div>
        </div>

        <div>
          <label className="mb-1.5 block text-xs font-semibold text-gray-500 uppercase">
            From
          </label>
          <input
            type="date"
            value={from}
            onChange={(e) => setFrom(e.target.value)}
            className="h-10 rounded-lg border border-gray-300 px-3 text-sm focus:border-gold focus:ring-2 focus:ring-gold/20 focus:outline-none"
          />
        </div>

        <div>
          <label className="mb-1.5 block text-xs font-semibold text-gray-500 uppercase">
            To
          </label>
          <input
            type="date"
            value={to}
            onChange={(e) => setTo(e.target.value)}
            className="h-10 rounded-lg border border-gray-300 px-3 text-sm focus:border-gold focus:ring-2 focus:ring-gold/20 focus:outline-none"
          />
        </div>

        <button
          type="submit"
          className="flex h-10 items-center gap-2 rounded-lg bg-zinc-950 px-5 text-sm font-semibold text-white transition-colors hover:bg-zinc-800"
        >
          <Search size={15} />
          Apply
        </button>

        <button
          type="button"
          onClick={resetFilters}
          className="flex h-10 items-center gap-2 rounded-lg border border-gray-300 px-4 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-50"
        >
          <RefreshCw size={15} />
          Reset
        </button>

        <a
          href={exportUrl}
          className="ml-auto flex h-10 items-center gap-2 rounded-lg border border-green-600 px-5 text-sm font-semibold text-green-700 transition-colors hover:bg-green-50"
        >
          <Download size={15} />
          Download Excel
        </a>

        <button
          type="button"
          onClick={isDeletedView ? handleRestoreSelected : handleDeleteSelected}
          disabled={selected.size === 0 || deleting}
          className={`flex h-10 items-center gap-2 rounded-lg border px-4 text-sm font-semibold transition-colors disabled:cursor-not-allowed disabled:opacity-40 ${
            isDeletedView
              ? "border-green-200 text-green-700 hover:bg-green-50"
              : "border-red-200 text-red-600 hover:bg-red-50"
          }`}
        >
          {deleting ? (
            <Loader2 size={15} className="animate-spin" />
          ) : isDeletedView ? (
            <RotateCcw size={15} />
          ) : (
            <Trash2 size={15} />
          )}
          {isDeletedView ? "Restore" : "Delete"} ({selected.size})
        </button>
      </form>

      {/* Table */}
      <div className="overflow-hidden rounded-2xl border bg-white shadow-sm">
        {orders.length === 0 ? (
          <div className="flex flex-col items-center justify-center gap-4 px-6 py-20 text-center">
            <h2 className="text-xl font-semibold">
              {isDeletedView ? "No deleted orders" : "No orders found"}
            </h2>
            <p className="text-gray-500 mt-1">
              {isDeletedView
                ? "Orders you remove from the panel will show up here."
                : "Try adjusting your filters or search."}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[1000px] text-left text-sm">
              <thead>
                <tr className="border-b bg-gray-50 text-xs text-gray-500 uppercase">
                  <th className="w-12 px-4 py-3">
                    <input
                      ref={selectAllRef}
                      type="checkbox"
                      checked={allSelected}
                      onChange={toggleAll}
                      className="h-4 w-4 cursor-pointer rounded border-gray-300 accent-zinc-950"
                    />
                  </th>
                  <th className="px-4 py-3 font-semibold">Order</th>
                  <th className="px-4 py-3 font-semibold">Date</th>
                  <th className="px-4 py-3 font-semibold">Customer</th>
                  <th className="px-4 py-3 font-semibold">Occasion</th>
                  <th className="px-4 py-3 font-semibold">Items</th>
                  <th className="px-4 py-3 font-semibold">Total</th>
                  <th className="px-4 py-3 font-semibold">Payment</th>
                  <th className="px-4 py-3 font-semibold">Status</th>
                  <th className="w-16 px-4 py-3"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {orders.map((order) => (
                  <tr
                    key={order.id}
                    className={`align-top hover:bg-gray-50/60 ${
                      selected.has(order.id) ? "bg-amber-50/50" : ""
                    }`}
                  >
                    <td className="px-4 py-4">
                      <input
                        type="checkbox"
                        checked={selected.has(order.id)}
                        onChange={() => toggleOne(order.id)}
                        className="h-4 w-4 cursor-pointer rounded border-gray-300 accent-zinc-950"
                      />
                    </td>
                    <td className="px-4 py-4">
                      <p className="font-semibold text-gray-900">
                        {order.orderNumber}
                      </p>
                      <p className="mt-0.5 text-xs text-gray-400">
                        {order.street}, {order.city}, {order.state} {order.pincode}
                      </p>
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-gray-600">
                      {formatDate(order.createdAt)}
                    </td>
                    <td className="px-4 py-4">
                      <p className="font-medium text-gray-900">
                        {order.customerName}
                      </p>
                      <p className="mt-0.5 text-xs text-gray-500">
                        {order.customerEmail}
                      </p>
                      <p className="text-xs text-gray-400">{order.customerPhone}</p>
                    </td>
                    <td className="px-4 py-4">
                      {order.occasion ? (
                        <span className="inline-block rounded-full bg-amber-50 px-3 py-1 text-xs font-semibold tracking-wide text-amber-700 uppercase">
                          {order.occasion}
                        </span>
                      ) : (
                        <span className="text-xs text-gray-300">—</span>
                      )}
                    </td>
                    <td className="px-4 py-4">
                      <ul className="space-y-1">
                        {order.items.map((item) => (
                          <li key={item.id} className="text-gray-600">
                            {item.productName}{" "}
                            <span className="text-gray-400">
                              × {item.quantity} · {formatPrice(item.lineTotal)}
                            </span>
                          </li>
                        ))}
                      </ul>
                    </td>
                    <td className="px-4 py-4">
                      <p className="font-semibold text-gray-900">
                        {formatPrice(order.total)}
                      </p>
                      <p className="mt-0.5 text-xs text-gray-400">
                        {formatPrice(order.subtotal)} + shipping{" "}
                        {order.shippingFee === 0
                          ? "free"
                          : formatPrice(order.shippingFee)}
                      </p>
                    </td>
                    <td className="px-4 py-4">
                      <span
                        className={`inline-block rounded-full px-3 py-1 text-xs font-semibold tracking-wide uppercase ${
                          PAYMENT_BADGE[order.paymentStatus] ??
                          "bg-gray-100 text-gray-600"
                        }`}
                      >
                        {order.paymentStatus}
                      </span>
                    </td>
                    <td className="px-4 py-4">
                      <OrderStatusSelect
                        orderId={order.id}
                        status={order.status}
                      />
                    </td>
                    <td className="px-4 py-4">
                      {isDeletedView ? (
                        <button
                          type="button"
                          onClick={() =>
                            handleRestoreOne(order.id, order.orderNumber)
                          }
                          title={`Restore ${order.orderNumber}`}
                          className="rounded-lg p-2 text-gray-400 transition-colors hover:bg-green-50 hover:text-green-700"
                        >
                          <RotateCcw size={16} />
                        </button>
                      ) : (
                        <button
                          type="button"
                          onClick={() =>
                            handleDeleteOne(order.id, order.orderNumber)
                          }
                          title={`Remove ${order.orderNumber} from the panel`}
                          className="rounded-lg p-2 text-gray-400 transition-colors hover:bg-red-50 hover:text-red-600"
                        >
                          <Trash2 size={16} />
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
