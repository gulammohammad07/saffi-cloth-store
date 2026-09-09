import RecentOrders from "@/components/dashboard/RecentOrders";
import LowStockProducts from "@/components/dashboard/LowStockProducts";
import { prisma } from "@/lib/prisma";
import StatsCard from "@/components/dashboard/StatsCard";
import { formatPrice } from "@/lib/utils";
import { Package, FolderTree, ShoppingBag, ShoppingCart, IndianRupee } from "lucide-react";

export default async function AdminDashboard() {
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
      <div>
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <p className="text-gray-500 mt-2">Welcome back 👋</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-5">
        <StatsCard
          title="Products"
          value={totalProducts}
          icon={<Package size={24} />}
        />

        <StatsCard
          title="Categories"
          value={totalCategories}
          icon={<FolderTree size={24} />}
        />

        <StatsCard
          title="Brands"
          value={totalBrands}
          icon={<ShoppingBag size={24} />}
        />

        <StatsCard
          title="Orders"
          value={totalOrders}
          icon={<ShoppingCart size={24} />}
        />

        <StatsCard
          title="Revenue (Delivered)"
          value={formatPrice(deliveredRevenue)}
          icon={<IndianRupee size={24} />}
        />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <RecentOrders />
        <LowStockProducts />
      </div>
    </div>
  );
}
