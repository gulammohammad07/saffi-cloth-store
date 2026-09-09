/**
 * Demo-only product photography.
 *
 * The seeded demo catalogue stores `/demo/*.png` paths rendered by
 * `gen-product-images.cjs` — flat SVG garment silhouettes that read as
 * illustrations, so shoppers can't judge real fabric, fit or colour. Until
 * genuine photos are uploaded per product via the admin (Cloudinary), we
 * substitute stable, freely-licensed (Unsplash) photography keyed by
 * product type + category slug.
 *
 * Only `/demo/*` paths are rewritten — any admin-uploaded image is left
 * untouched, so the map silently stops applying the moment a real photo
 * exists. Every URL below has been verified to resolve (HTTP 200).
 */

const U = (id: string) =>
  `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&q=80&w=1200`;

const PHOTOS: Record<string, string> = {
  // ---- Men ----
  "MEN/t-shirts": U("1544441893-675973e31985"), // man in a white crew-neck tee
  "MEN/shirts": U("1596755094514-f87e34085b2c"), // white shirts on a rail
  "MEN/polo-shirts": U("1598033129183-c4f50c736f10"), // white polo with collar
  "MEN/kurtas": U("1571945153237-4929e783af4a"), // man in a white kurta
  "MEN/kurta-sets": U("1571945153237-4929e783af4a"),
  "MEN/jeans": U("1562157873-818bc0726f68"), // blue jeans on a rack
  "MEN/trousers-chinos": U("1594633312681-425c7b97ccd1"), // cargo trousers
  "MEN/shorts": U("1591195853828-11db59a44f6b"), // chino shorts
  "MEN/ethnic-wear": U("1502716119720-b23a93e5fe1b"), // man in a tailored outfit
  "MEN/coord-sets": U("1488161628813-04466f872be2"), // man in a crisp shirt
  "MEN/sweatshirts-hoodies": U("1556821840-3a63f95609a7"), // man in a grey hoodie
  "MEN/jackets-coats": U("1591047139829-d91aecb6caea"), // man in a jacket
  "MEN/activewear": U("1517836357463-d25dfeac3438"), // training/activewear
  "MEN/loungewear-sleepwear": U("1506629082955-511b1aa562c8"), // pyjamas

  // ---- Women ----
  "WOMEN/tops-blouses": U("1524504388940-b1c1722653e1"), // woman in a knit top
  "WOMEN/jeans": U("1551028719-00167b16eac5"), // blue jeans
  "WOMEN/trousers-chinos": U("1597983073493-88cd35cf93b0"), // slim-fit trousers
  "WOMEN/dresses": U("1434389677669-e08b4cac3105"), // dresses on a rail
  "WOMEN/ethnic-wear": U("1621786030484-4c855ecd48d6"), // designer ethnic wear
  "WOMEN/sarees-lehengas": U("1610030469983-98e550d6193c"), // silk saree
  "WOMEN/coord-sets": U("1487222477894-8943e31ef7b2"), // woman in a co-ord outfit
  "WOMEN/loungewear-sleepwear": U("1506629082955-511b1aa562c8"),
  "WOMEN/activewear": U("1571019613454-1cb2f99b2d8b"), // woman in activewear
  "WOMEN/jackets-coats": U("1469334031218-e382a71b716b"), // woman in a coat

  // ---- Kids ----
  "KIDS/t-shirts": U("1518831959646-742c3a14ebf7"), // kids' clothing
  "KIDS/jeans": U("1604176354204-9268737828e4"), // folded denim
  "KIDS/dresses": U("1519238263530-99bdd11df2ea"), // girl in a party dress
  "KIDS/shorts": U("1591195853828-11db59a44f6b"), // chino shorts
  "KIDS/sweatshirts-hoodies": U("1522771930-78848d9293e8"), // child in a jacket
  "KIDS/kurtas": U("1571945153237-4929e783af4a"), // white kurta
};

// Neutral fallback for any unmapped combination (e.g. a new category).
const FALLBACK = U("1523381210434-271e8be1f52b"); // stack of folded tees

/**
 * Swap a `/demo/*` placeholder for real photography. Non-demo images
 * (Cloudinary uploads, etc.) pass through unchanged.
 */
export function resolveDemoProductImage(
  imageUrl: string,
  productType: string,
  categorySlug: string,
): string {
  if (!imageUrl.startsWith("/demo/")) return imageUrl;
  return (
    PHOTOS[`${productType}/${categorySlug}`] ??
    PHOTOS[categorySlug] ??
    FALLBACK
  );
}