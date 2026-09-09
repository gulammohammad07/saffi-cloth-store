"use server";

import {
  createProduct,
  deleteProduct,
  getProductById,
  updateProduct,
} from "@/lib/services/product.service";
import { productSchema } from "@/lib/validations/product";
import { deleteImageFromCloudinary, deleteVideoFromCloudinary } from "@/lib/cloudinary";
import { generateSlug } from "@/lib/utils";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth/dal";

export type ProductActionState = {
  success: boolean;
  message?: string;
  errors?: Record<string, string[] | undefined>;
};

function parseValues(formData: FormData) {
  const sizesRaw = formData.get("sizes")?.toString();
  let sizes: { size: string; price: number; salePrice?: number | null; stock: number }[] = [];
  if (sizesRaw) {
    try {
      sizes = JSON.parse(sizesRaw);
    } catch {
      sizes = [];
    }
  }

  return {
    name: formData.get("name")?.toString() ?? "",
    slug: formData.get("slug")?.toString() ?? "",
    sku: formData.get("sku")?.toString() ?? "",
    categoryId: formData.get("categoryId")?.toString() ?? "",
    brandId: formData.get("brandId")?.toString() ?? "",
    productType: formData.get("productType")?.toString() ?? "MEN",
    price: formData.get("price"),
    salePrice: formData.get("salePrice"),
    stock: formData.get("stock"),
    volume: formData.get("volume")?.toString() ?? "",
    description: formData.get("description")?.toString() ?? "",
    notes:
      formData
        .get("notes")
        ?.toString()
        .split(",")
        .map((note) => note.trim())
        .filter(Boolean) ?? [],
    imageUrl: (formData.get("imageUrl")?.toString() ?? "").trim(),
    imagePublicId: formData.get("imagePublicId")?.toString() ?? "",
    videoUrl: (formData.get("videoUrl")?.toString() ?? "").trim(),
    videoPublicId: formData.get("videoPublicId")?.toString() ?? "",
    galleryUrls: formData.get("galleryUrls")?.toString() ?? "",
    galleryPublicIds: formData.get("galleryPublicIds")?.toString() ?? "",
    occasionIds: formData.getAll("occasionIds").map((id) => id.toString()),
    sizes,
  };
}

function buildGallery(
  imageUrl: string,
  imagePublicId: string,
  galleryUrls: string,
  galleryPublicIds: string,
): { gallery: string[]; galleryPublicIds: string[] } {
  const pairs: { url: string; publicId: string }[] = [];
  const add = (url: string, publicId: string) => {
    const clean = url.trim();
    if (!clean) return;
    if (pairs.some((p) => p.url === clean)) return;
    pairs.push({ url: clean, publicId: publicId.trim() });
  };

  if (imageUrl) add(imageUrl, imagePublicId);

  const urls = galleryUrls
    .split(",")
    .map((u) => u.trim())
    .filter(Boolean);
  const publicIds = galleryPublicIds.split(",");

  urls.forEach((url, index) => {
    add(url, publicIds[index] ?? "");
  });

  return {
    gallery: pairs.map((p) => p.url),
    galleryPublicIds: pairs.map((p) => p.publicId).filter((p) => p),
  };
}

async function resolveSku(
  brandId: string,
  productName: string,
  providedSku?: string,
): Promise<string> {
  if (providedSku && providedSku.trim()) {
    return providedSku.trim();
  }

  const brand = await prisma.brand.findUnique({
    where: { id: brandId },
    select: { name: true },
  });

  const brandName = brand?.name ?? "BRAND";
  const productSlug = generateSlug(productName);
  const brandSlug = generateSlug(brandName);
  const prefix = `${brandSlug}-${productSlug}`.toUpperCase();

  const existing: { sku: string | null }[] = await prisma.product.findMany({
    where: { sku: { startsWith: prefix } },
    select: { sku: true },
    orderBy: { sku: "desc" },
  });

  const maxNumber = existing.reduce((max, sku) => {
    if (!sku.sku) return max;
    const match = sku.sku.match(new RegExp(`^${prefix.replace(/[.*+?^${}()|[\\]\\\\]/g, "\\\\$&")}-(\\d+)$`));
    if (!match) return max;
    const num = Number(match[1]);
    return num > max ? num : max;
  }, 0);

  const nextNumber = String(maxNumber + 1).padStart(2, "0");
  return `${prefix}-${nextNumber}`;
}

export async function createProductAction(
  prevState: ProductActionState,
  formData: FormData,
): Promise<ProductActionState> {
  await requireAdmin();
  const values = parseValues(formData);
  const result = productSchema.safeParse(values);

  if (!result.success) {
    return {
      success: false,
      errors: result.error.flatten().fieldErrors,
    };
  }

  const imageUrl = result.data.imageUrl;
  const imagePublicId = result.data.imagePublicId || null;

  if (!imageUrl) {
    return {
      success: false,
      errors: { imageUrl: ["Please upload a product image."] },
    };
  }

  const { gallery, galleryPublicIds } = buildGallery(
    imageUrl,
    imagePublicId ?? "",
    result.data.galleryUrls ?? "",
    result.data.galleryPublicIds ?? "",
  );

  try {
    const sku = await resolveSku(result.data.brandId, result.data.name, result.data.sku);

    await createProduct({
      name: result.data.name,
      slug: result.data.slug || generateSlug(result.data.name),
      sku,
      description: result.data.description || null,
      price: result.data.price,
      salePrice: result.data.salePrice ?? null,
      stock: result.data.stock,
      volume: result.data.volume,
      notes: result.data.notes ?? [],
      imageUrl,
      imagePublicId,
      videoUrl: result.data.videoUrl || null,
      videoPublicId: result.data.videoPublicId || null,
      gallery,
      galleryPublicIds,
      featured: false,
      bestSeller: false,
      newArrival: false,
      isActive: true,
      productType: result.data.productType,
      category: {
        connect: {
          id: result.data.categoryId,
        },
      },
      brand: {
        connect: {
          id: result.data.brandId,
        },
      },
      occasions: {
        connect: result.data.occasionIds?.map((id) => ({ id })) ?? [],
      },
      sizes: {
        create: result.data.sizes?.map((size) => ({
          size: size.size,
          price: size.price,
          salePrice: size.salePrice ?? null,
          stock: size.stock,
        })) ?? [],
      },
    });
  } catch (error) {
    console.error("Product creation failed:", error);
    for (const publicId of galleryPublicIds) {
      await deleteImageFromCloudinary(publicId);
    }
    if (result.data.videoPublicId) {
      await deleteVideoFromCloudinary(result.data.videoPublicId);
    }
    return {
      success: false,
      message: "Failed to create product. Please try again.",
    };
  }

  const { revalidatePath } = await import("next/cache");
  revalidatePath("/admin/products");

  return {
    success: true,
    message: "Product created successfully.",
  };
}

export async function updateProductAction(
  productId: string,
  prevState: ProductActionState,
  formData: FormData,
): Promise<ProductActionState> {
  await requireAdmin();
  const values = parseValues(formData);
  const result = productSchema.safeParse(values);

  if (!result.success) {
    return {
      success: false,
      errors: result.error.flatten().fieldErrors,
    };
  }

  const existing = await getProductById(productId);
  if (!existing) {
    return { success: false, message: "Product not found." };
  }

  const newImageUrl = result.data.imageUrl || null;
  const newImagePublicId = result.data.imagePublicId || null;
  const newVideoUrl = result.data.videoUrl || null;
  const newVideoPublicId = result.data.videoPublicId || null;

  if (!newImageUrl) {
    return {
      success: false,
      errors: { imageUrl: ["Please upload a product image."] },
    };
  }

  const imageChanged = newImageUrl !== existing.imageUrl;
  const videoChanged = newVideoUrl !== existing.videoUrl;

  const oldImagePublicIds = [
    existing.imagePublicId,
    ...existing.galleryPublicIds,
  ].filter((id): id is string => Boolean(id));

  const { gallery, galleryPublicIds } = buildGallery(
    newImageUrl,
    newImagePublicId ?? "",
    result.data.galleryUrls ?? "",
    result.data.galleryPublicIds ?? "",
  );

  try {
    const sku = await resolveSku(result.data.brandId, result.data.name, result.data.sku);

    await updateProduct(productId, {
      name: result.data.name,
      slug: result.data.slug || generateSlug(result.data.name),
      sku,
      description: result.data.description || null,
      price: result.data.price,
      salePrice: result.data.salePrice ?? null,
      stock: result.data.stock,
      volume: result.data.volume,
      notes: result.data.notes ?? [],
      imageUrl: newImageUrl,
      imagePublicId: imageChanged ? newImagePublicId : existing.imagePublicId,
      videoUrl: newVideoUrl,
      videoPublicId: videoChanged ? newVideoPublicId : existing.videoPublicId,
      gallery,
      galleryPublicIds,
      category: {
        connect: {
          id: result.data.categoryId,
        },
      },
      brand: {
        connect: {
          id: result.data.brandId,
        },
      },
      occasions: {
        set: result.data.occasionIds?.map((id) => ({ id })) ?? [],
      },
      sizes: {
        deleteMany: { productId },
        create: result.data.sizes?.map((size) => ({
          size: size.size,
          price: size.price,
          salePrice: size.salePrice ?? null,
          stock: size.stock,
        })) ?? [],
      },
    });

    const removedPublicIds = oldImagePublicIds.filter((id) => !galleryPublicIds.includes(id));
    for (const publicId of removedPublicIds) {
      await deleteImageFromCloudinary(publicId);
    }
    if (videoChanged && existing.videoPublicId) {
      await deleteVideoFromCloudinary(existing.videoPublicId);
    }
  } catch (error) {
    console.error("Product update failed:", error);
    for (const publicId of galleryPublicIds) {
      if (!oldImagePublicIds.includes(publicId)) {
        await deleteImageFromCloudinary(publicId);
      }
    }
    if (newVideoPublicId && existing.videoPublicId !== newVideoPublicId) {
      await deleteVideoFromCloudinary(newVideoPublicId);
    }
    return {
      success: false,
      message: "Failed to update product. Please try again.",
    };
  }

  const { revalidatePath } = await import("next/cache");
  revalidatePath("/admin/products");
  revalidatePath(`/admin/products/${productId}`);

  return {
    success: true,
    message: "Product updated successfully.",
  };
}

export async function deleteProductAction(productId: string) {
  await requireAdmin();
  const existing = await getProductById(productId);
  if (!existing) {
    return { success: false, message: "Product not found." };
  }

  try {
    await deleteProduct(productId);

    const imagePublicIds = [
      existing.imagePublicId,
      ...existing.galleryPublicIds,
    ].filter((id): id is string => Boolean(id));
    for (const publicId of imagePublicIds) {
      await deleteImageFromCloudinary(publicId);
    }
    if (existing.videoPublicId) {
      await deleteVideoFromCloudinary(existing.videoPublicId);
    }
  } catch {
    return {
      success: false,
      message: "Failed to delete product. Please try again.",
    };
  }

  const { revalidatePath } = await import("next/cache");
  revalidatePath("/admin/products");

  return { success: true, message: "Product deleted successfully." };
}
