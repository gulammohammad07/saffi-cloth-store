"use server";

import { prisma } from "@/lib/prisma";
import { categorySchema } from "@/lib/validations/category";
import { revalidatePath } from "next/cache";
import { deleteImageFromCloudinary } from "@/lib/cloudinary";

export type CategoryActionState = {
  success: boolean;
  message?: string;
  errors?: Record<string, string[] | undefined>;
};

export async function createCategory(
  prevState: CategoryActionState,
  formData: FormData,
): Promise<CategoryActionState> {
  const values = {
    name: formData.get("name")?.toString() ?? "",
    slug: formData.get("slug")?.toString() ?? "",
    description: formData.get("description")?.toString() ?? "",
    imageUrl: (formData.get("imageUrl")?.toString() ?? "").trim(),
    imagePublicId: formData.get("imagePublicId")?.toString() ?? "",
  };

  const result = categorySchema.safeParse(values);

  if (!result.success) {
    return {
      success: false,
      errors: result.error.flatten().fieldErrors,
    };
  }

  const existing = await prisma.category.findUnique({
    where: {
      slug: result.data.slug,
    },
  });

  if (existing) {
    return {
      success: false,
      message: "Category already exists.",
    };
  }

  try {
    await prisma.category.create({
      data: {
        name: result.data.name,
        slug: result.data.slug,
        description: result.data.description || null,
        imageUrl: result.data.imageUrl || null,
        imagePublicId: result.data.imagePublicId || null,
      },
    });
  } catch {
    if (result.data.imagePublicId) {
      await deleteImageFromCloudinary(result.data.imagePublicId);
    }
    return {
      success: false,
      message: "Failed to create category. Please try again.",
    };
  }

  revalidatePath("/admin/categories");
  revalidatePath("/");
  revalidatePath("/shop");

  return {
    success: true,
    message: "Category created successfully.",
  };
}

export async function updateCategory(
  categoryId: string,
  prevState: CategoryActionState,
  formData: FormData,
): Promise<CategoryActionState> {
  const values = {
    name: formData.get("name")?.toString() ?? "",
    slug: formData.get("slug")?.toString() ?? "",
    description: formData.get("description")?.toString() ?? "",
    imageUrl: (formData.get("imageUrl")?.toString() ?? "").trim(),
    imagePublicId: formData.get("imagePublicId")?.toString() ?? "",
  };

  const result = categorySchema.safeParse(values);

  if (!result.success) {
    return {
      success: false,
      errors: result.error.flatten().fieldErrors,
    };
  }

  const existing = await prisma.category.findUnique({
    where: { id: categoryId },
  });

  if (!existing) {
    return {
      success: false,
      message: "Category not found.",
    };
  }

  const slugChanged = result.data.slug !== existing.slug;
  if (slugChanged) {
    const slugExists = await prisma.category.findUnique({
      where: { slug: result.data.slug },
    });
    if (slugExists) {
      return {
        success: false,
        message: "A category with this slug already exists.",
      };
    }
  }

  const imageChanged = result.data.imageUrl !== existing.imageUrl;
  const oldImagePublicId = existing.imagePublicId;

  try {
    await prisma.category.update({
      where: { id: categoryId },
      data: {
        name: result.data.name,
        slug: result.data.slug,
        description: result.data.description || null,
        imageUrl: result.data.imageUrl || null,
        imagePublicId: result.data.imagePublicId || null,
      },
    });

    if (imageChanged && oldImagePublicId && result.data.imagePublicId) {
      await deleteImageFromCloudinary(oldImagePublicId);
    }
  } catch {
    if (imageChanged && result.data.imagePublicId) {
      await deleteImageFromCloudinary(result.data.imagePublicId);
    }
    return {
      success: false,
      message: "Failed to update category. Please try again.",
    };
  }

  revalidatePath("/admin/categories");
  revalidatePath("/");
  revalidatePath("/shop");

  return {
    success: true,
    message: "Category updated successfully.",
  };
}

export async function deleteCategory(categoryId: string) {
  const category = await prisma.category.findUnique({
    where: { id: categoryId },
    include: { products: true },
  });

  if (!category) {
    return { success: false, message: "Category not found." };
  }

  if (category.products.length > 0) {
    return {
      success: false,
      message: "Cannot delete category with products. Reassign products first.",
    };
  }

  try {
    await prisma.category.delete({
      where: { id: categoryId },
    });

    if (category.imagePublicId) {
      await deleteImageFromCloudinary(category.imagePublicId);
    }
  } catch {
    return {
      success: false,
      message: "Failed to delete category. Please try again.",
    };
  }

  revalidatePath("/admin/categories");
  revalidatePath("/");
  revalidatePath("/shop");

  return { success: true, message: "Category deleted successfully." };
}

export type ResetCategoriesState = {
  success: boolean;
  message?: string;
};

export async function resetCategories(): Promise<ResetCategoriesState> {
  // Clothing defaults: categories are garment types (gender lives on the
  // product as productType MEN/WOMEN/KIDS), so one set works across the board.
  const defaultCategories = [
    { name: "T-Shirts", slug: "t-shirts", description: "Casual everyday tees in soft cotton." },
    { name: "Shirts", slug: "shirts", description: "Smart-casual shirts for work and weekends." },
    { name: "Polo Shirts", slug: "polo-shirts", description: "Classic polos — sporty yet polished." },
    { name: "Kurtas", slug: "kurtas", description: "Breathable everyday kurtas, made to last." },
    { name: "Kurta Sets", slug: "kurta-sets", description: "Festive-ready kurta sets in easy fabrics." },
    { name: "Jeans", slug: "jeans", description: "Denim that holds its shape wear after wear." },
    { name: "Trousers & Chinos", slug: "trousers-chinos", description: "Sharp trousers and relaxed chinos." },
    { name: "Shorts", slug: "shorts", description: "Easy shorts for warm days." },
    { name: "Dresses", slug: "dresses", description: "Effortless dresses for every occasion." },
    { name: "Tops & Blouses", slug: "tops-blouses", description: "Versatile tops and blouses to style up." },
    { name: "Ethnic Wear", slug: "ethnic-wear", description: "Traditional silhouettes, modern comfort." },
    { name: "Sarees & Lehengas", slug: "sarees-lehengas", description: "Graceful sarees and lehengas for celebrations." },
    { name: "Co-ord Sets", slug: "coord-sets", description: "Matched sets — zero-effort dressing." },
    { name: "Sweatshirts & Hoodies", slug: "sweatshirts-hoodies", description: "Cosy layers for laid-back days." },
    { name: "Jackets & Coats", slug: "jackets-coats", description: "Outerwear built for crisp evenings." },
    { name: "Activewear", slug: "activewear", description: "Stretchy performance wear for training days." },
    { name: "Loungewear & Sleepwear", slug: "loungewear-sleepwear", description: "Soft at-home comfort essentials." },
  ];

  const created = await Promise.all(
    defaultCategories.map((cat) =>
      prisma.category.upsert({
        where: { slug: cat.slug },
        update: { name: cat.name, description: cat.description, isActive: true },
        create: cat,
      }),
    ),
  );

  const defaultIds = created.map((c) => c.id);
  // Anything not in the default set moves to the first default category so no
  // product is ever orphaned before the extras are cleaned up.
  const fallbackCategory = created[0];

  await prisma.product.updateMany({
    where: { categoryId: { notIn: defaultIds } },
    data: { categoryId: fallbackCategory.id },
  });

  await prisma.category.deleteMany({
    where: { id: { notIn: defaultIds } },
  });

  revalidatePath("/admin/categories");
  revalidatePath("/");
  revalidatePath("/shop");

  return {
    success: true,
    message: `Categories reset to ${defaultCategories.length} clothing defaults.`,
  };
}
