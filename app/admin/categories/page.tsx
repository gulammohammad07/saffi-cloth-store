import { prisma } from "@/lib/prisma";
import CategoryForm from "@/components/category/category-form";
import CategoryTable from "@/components/category/category-table";
import ResetCategoriesButton from "@/components/category/ResetCategoriesButton";

export default async function CategoriesPage() {
  const dbCategories = await prisma.category.findMany({
    orderBy: {
      createdAt: "desc",
    },
    include: {
      _count: { select: { products: true } },
      products: { select: { productType: true } },
    },
  });

  const categories = dbCategories.map((category) => ({
    id: category.id,
    name: category.name,
    slug: category.slug,
    description: category.description,
    imageUrl: category.imageUrl,
    isActive: category.isActive,
    productCount: category._count.products,
    productTypes: [
      ...new Set(category.products.map((product) => product.productType)),
    ],
  }));

  return (
    <div className="space-y-8 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Categories</h1>
          <p className="text-muted-foreground mt-2">
            Manage your clothing categories. Search, filter by Men/Women/Kids and
            see how many products sit in each.
          </p>
        </div>
        <ResetCategoriesButton />
      </div>

      <CategoryForm />

      <CategoryTable categories={categories} />
    </div>
  );
}
