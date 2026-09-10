import { prisma } from "@/lib/prisma";
import { resolveDemoProductImage } from "@/lib/demo-product-images";
import type { FragranceNote, Product } from "@/lib/data/products";

function toNote(name: string): FragranceNote {
  return { name, intensity: 70 };
}

function mapDbProduct(
  db: {
    id: string;
    name: string;
    slug: string;
    price: number;
    salePrice: number | null;
    description: string | null;
    imageUrl: string;
    videoUrl: string | null;
    gallery: string[];
    stock: number;
    volume: string;
    notes: string[];
    bestSeller: boolean;
    newArrival: boolean;
    featured: boolean;
    productType: string;
    category: { name: string; slug: string };
    brand: { name: string };
    occasions: { name: string }[];
    sizes: { id: string; size: string; price: number; salePrice: number | null; stock: number }[];
  },
  reviewStats?: { rating: number; count: number } | null,
): Product {
  const noteNames =
    (db.notes ?? []).length > 0 ? db.notes : [db.category.name];

  // Demo rows store /demo/*.png silhouette renders; resolve them to real
  // photography until genuine uploads exist (see lib/demo-product-images.ts).
  const productType = (db.productType as "MEN" | "WOMEN" | "KIDS") || "MEN";
  const image = resolveDemoProductImage(
    db.imageUrl,
    productType,
    db.category.slug,
  );

  let badge: Product["badge"];
  if (db.bestSeller) badge = "Bestseller";
  else if (db.newArrival) badge = "New Arrival";
  else if (db.salePrice != null) badge = "Sale";
  else badge = undefined;

  const occasionNames = db.occasions.map((o) => o.name);

  return {
    id: db.id,
    name: db.name,
    slug: db.slug,
    brand: db.brand.name,
    category: db.category.name,
    productType,
    notes: {
      top: noteNames.slice(0, 1).map(toNote),
      heart: noteNames.slice(1, 3).map(toNote),
      base: noteNames.slice(3, 5).map(toNote),
    },
    occasions: occasionNames.length > 0 ? occasionNames : ["Everyday"],
    gender: "Unisex",
    volume: db.volume,
    price: db.price,
    salePrice: db.salePrice ?? undefined,
    image,
    video: db.videoUrl ?? undefined,
    gallery:
      db.gallery.length > 0
        ? db.gallery.map((g) =>
            resolveDemoProductImage(g, productType, db.category.slug),
          )
        : [image],
    description: db.description ?? "",
    stock: db.stock,
    rating: reviewStats?.rating ?? 4.5,
    reviewCount: reviewStats?.count ?? 0,
    badge,
    featured: db.featured,
    sizes: db.sizes,
  };
}

export type StorefrontCategory = {
  id: string;
  name: string;
  slug: string;
  imageUrl: string | null;
  tagline: string | null;
};

export type StorefrontBanner = {
  id: string;
  section: string;
  title: string | null;
  subtitle: string | null;
  description: string | null;
  desktopImageUrl: string;
  tabletImageUrl: string | null;
  mobileImageUrl: string | null;
  linkUrl: string | null;
};

export async function getStorefrontCategories(): Promise<StorefrontCategory[]> {
  const dbCategories = await prisma.category.findMany({
    where: { isActive: true },
    orderBy: { createdAt: "asc" },
  });

  return dbCategories.map((category) => ({
    id: category.id,
    name: category.name,
    slug: category.slug,
    imageUrl: category.imageUrl,
    tagline: category.description,
  }));
}

export async function getStorefrontBanners(): Promise<StorefrontBanner[]> {
  const dbBanners = await prisma.banner.findMany({
    where: { isActive: true },
    orderBy: { createdAt: "asc" },
  });

  return dbBanners.map((banner) => ({
    id: banner.id,
    section: banner.section,
    title: banner.title,
    subtitle: banner.subtitle,
    description: banner.description,
    desktopImageUrl: banner.desktopImageUrl,
    tabletImageUrl: banner.tabletImageUrl,
    mobileImageUrl: banner.mobileImageUrl,
    linkUrl: banner.linkUrl,
  }));
}

export async function getStorefrontProducts(): Promise<Product[]> {
  if (!process.env.DATABASE_URL || process.env.DATABASE_URL === "undefined") {
    return [];
  }

  try {
    const dbProducts = await prisma.product.findMany({
      where: { isActive: true },
      include: {
        category: true,
        brand: true,
        occasions: true,
        sizes: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    // Live ratings: average + count of real customer reviews per product.
    const reviewAggs = await prisma.review.groupBy({
      by: ["productId"],
      _count: { id: true },
      _avg: { rating: true },
    });
    const reviewStats = new Map(
      reviewAggs.map((agg) => [
        agg.productId,
        {
          rating: Math.round((agg._avg.rating ?? 4.5) * 10) / 10,
          count: agg._count.id,
        },
      ]),
    );

    return dbProducts.map((dbProduct) =>
      mapDbProduct(dbProduct, reviewStats.get(dbProduct.id)),
    );
  } catch (error) {
    console.warn("Could not fetch storefront products from database:", error);
    return [];
  }
}

export async function getStorefrontProductBySlug(
  slug: string,
): Promise<Product | undefined> {
  const dbProduct = await prisma.product.findFirst({
    where: { slug, isActive: true },
    include: {
      category: true,
      brand: true,
      occasions: true,
      sizes: true,
    },
  });

  if (dbProduct) {
    const reviewAgg = await prisma.review.aggregate({
      where: { productId: dbProduct.id },
      _count: { id: true },
      _avg: { rating: true },
    });
    return mapDbProduct(
      dbProduct,
      reviewAgg._count.id > 0
        ? {
            rating: Math.round((reviewAgg._avg.rating ?? 4.5) * 10) / 10,
            count: reviewAgg._count.id,
          }
        : null,
    );
  }

  return undefined;
}

export async function getStorefrontRelated(
  product: Product,
  count = 4,
): Promise<Product[]> {
  const all = await getStorefrontProducts();
  return all
    .filter(
      (p) =>
        p.id !== product.id &&
        (p.category.toLowerCase() === product.category.toLowerCase() ||
          p.occasions.some((o) => product.occasions.includes(o))),
    )
    .slice(0, count);
}
