import { prisma } from "@/lib/prisma";
import RecentOrders from "@/components/dashboard/RecentOrders";
import LowStockProducts from "@/components/dashboard/LowStockProducts";
import StatsCard from "@/components/dashboard/StatsCard";
import { formatPrice } from "@/lib/utils";

import {
  Package,
  FolderTree,
  ShoppingBag,
  ShoppingCart,
  IndianRupee,
} from "lucide-react";

export default async function DashboardPage() {
  const [totalProducts, totalCategories, totalBrands, totalOrders, revenueAgg] =
    await Promise.all([
      prisma.product.count(),
      prisma.category.count(),
      prisma.brand.count(),
      prisma.order.count(),
      prisma.order.aggregate({
        _sum: { total: true },
        where: { status: "DELIVERED" },
      }),
    ]);

  const deliveredRevenue = revenueAgg._sum.total ?? 0;

  return (
    <div className="space-y-8">
      {/* Heading */}
      <div>
        <h1 className="text-3xl font-bold">Dashboard</h1>

        <p className="text-muted-foreground mt-2">
          Welcome back 👋 Here&apos;s what&apos;s happening today.
        </p>
      </div>

      {/* Stats */}
      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-5">
        <StatsCard
          title="Products"
          value={totalProducts}
          icon={<Package size={26} />}
        />

        <StatsCard
          title="Categories"
          value={totalCategories}
          icon={<FolderTree size={26} />}
        />

        <StatsCard
          title="Brands"
          value={totalBrands}
          icon={<ShoppingBag size={26} />}
        />

        <StatsCard
          title="Orders"
          value={totalOrders}
          icon={<ShoppingCart size={26} />}
        />

        <StatsCard
          title="Revenue (Delivered)"
          value={formatPrice(deliveredRevenue)}
          icon={<IndianRupee size={26} />}
        />
      </div>

      {/* Recent Orders */}
      <div className="grid gap-6 lg:grid-cols-2">
        <RecentOrders />

        <LowStockProducts />
      </div>
    </div>
  );
}
