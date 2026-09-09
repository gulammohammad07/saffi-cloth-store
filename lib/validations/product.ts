import { z } from "zod";

export const productSchema = z.object({
  name: z.string().min(2),
  slug: z.string().min(2).optional().or(z.literal("")),
  sku: z.string().min(2).optional().or(z.literal("")),
  categoryId: z.string().min(1, "Please select a category."),
  brandId: z.string().min(1, "Please select or create a brand."),
  productType: z.enum(["MEN", "WOMEN", "KIDS"]).default("MEN"),
  price: z.coerce.number(),
  salePrice: z.coerce.number().optional(),
  stock: z.coerce.number(),
  volume: z.string().min(1, "Please select a colour."),
  description: z.string().optional(),
  notes: z.array(z.string()).optional(),
  occasionIds: z.array(z.string()).optional(),
  sizes: z
    .array(
      z.object({
        size: z.string().min(1),
        price: z.coerce.number(),
        salePrice: z.coerce.number().nullable().optional(),
        stock: z.coerce.number(),
      }),
    )
    .optional(),
  imageUrl: z
    .string()
    .url("Please upload a valid product image.")
    .optional()
    .or(z.literal("")),
  imagePublicId: z.string().optional(),
  videoUrl: z
    .string()
    .url("Please upload a valid product video.")
    .optional()
    .or(z.literal("")),
  videoPublicId: z.string().optional(),
  galleryUrls: z.string().optional(),
  galleryPublicIds: z.string().optional(),
});
