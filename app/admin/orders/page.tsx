import {
  getAllOrders,
  getOrderTotals,
  type OrderView,
} from "@/lib/services/order.service";
import OrdersTable from "@/components/admin/OrdersTable";
import { formatPrice } from "@/lib/utils";

function first(value: string | string[] | undefined): string {
  if (Array.isArray(value)) return value[0] ?? "";
  return value ?? "";
}

export default async function OrdersPage({
  searchParams,
}: {
  searchParams: Promise<{
    search?: string;
    from?: string;
    to?: string;
    view?: string;
  }>;
}) {
  const params = await searchParams;

  const view: OrderView = first(params.view) === "deleted" ? "deleted" : "active";

  const filters = {
    search: first(params.search),
    from: first(params.from),
    to: first(params.to),
    view,
  };

  // The list respects the active/deleted view; the totals deliberately do not,
  // so revenue still includes orders removed from the admin list.
  const [orders, totals] = await Promise.all([
    getAllOrders(filters),
    getOrderTotals(filters),
  ]);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold">Orders</h1>
        <p className="text-muted-foreground mt-2">
          Manage your customer orders. Deleting an order only removes it from
          this panel — the customer still sees it in their order history.
        </p>
      </div>

      <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
        <div className="rounded-2xl border bg-white p-6 shadow-sm">
          <p className="text-sm text-gray-500">Total Orders</p>
          <h2 className="mt-3 text-3xl font-bold">{totals.totalOrders}</h2>
          <p className="mt-1 text-xs text-gray-400">
            Includes {totals.hiddenCount} hidden from this panel
          </p>
        </div>

        <div className="rounded-2xl border bg-white p-6 shadow-sm">
          <p className="text-sm text-gray-500">Revenue (Delivered)</p>
          <h2 className="mt-3 text-3xl font-bold">
            {formatPrice(totals.deliveredRevenue)}
          </h2>
        </div>

        <div className="rounded-2xl border bg-white p-6 shadow-sm">
          <p className="text-sm text-gray-500">Pending (Not Delivered)</p>
          <h2 className="mt-3 text-3xl font-bold">
            {formatPrice(totals.pendingRevenue)}
          </h2>
        </div>
      </div>

      <OrdersTable
        orders={orders}
        filters={filters}
        view={view}
        hiddenCount={totals.hiddenCount}
      />
    </div>
  );
}
