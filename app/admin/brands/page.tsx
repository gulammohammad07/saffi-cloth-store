import { prisma } from "@/lib/prisma";
import BrandForm from "@/components/brand/BrandForm";
import BrandTable from "@/components/brand/BrandTable";

export default async function BrandsPage() {
  const brands = await prisma.brand.findMany({
    orderBy: {
      createdAt: "desc",
    },
  });

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold">Brands</h1>
        <p className="text-gray-500">Manage your clothing brands.</p>
      </div>

      <BrandForm />

      <BrandTable brands={brands} />
    </div>
  );
}
