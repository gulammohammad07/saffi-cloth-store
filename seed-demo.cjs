/* eslint-disable @typescript-eslint/no-require-imports */
/* Seeds a demo clothing catalogue: one house brand, products across all 17
   default categories + Men/Women/Kids, per-size stock, and generated local
   PNG placeholder images (no Cloudinary needed yet). Idempotent: safe to
   re-run — products/brand are upserted by slug. */

const fs = require("fs");
const path = require("path");
const zlib = require("zlib");
require("dotenv").config();
const { PrismaPg } = require("@prisma/adapter-pg");
const { PrismaClient } = require("@prisma/client");

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });

/* ----------------------------- PNG generator ----------------------------- */
function crc32(buf) {
  let table = crc32.table;
  if (!table) {
    table = crc32.table = [];
    for (let n = 0; n < 256; n++) {
      let c = n;
      for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
      table[n] = c >>> 0;
    }
  }
  let crc = 0xffffffff;
  for (let i = 0; i < buf.length; i++) crc = table[(crc ^ buf[i]) & 0xff] ^ (crc >>> 8);
  return (crc ^ 0xffffffff) >>> 0;
}

function pngChunk(type, data) {
  const len = Buffer.alloc(4);
  len.writeUInt32BE(data.length, 0);
  const typeBuf = Buffer.from(type, "ascii");
  const crcBuf = Buffer.alloc(4);
  crcBuf.writeUInt32BE(crc32(Buffer.concat([typeBuf, data])), 0);
  return Buffer.concat([len, typeBuf, data, crcBuf]);
}

function hexToRgb(hex) {
  const h = hex.replace("#", "");
  return [parseInt(h.slice(0, 2), 16), parseInt(h.slice(2, 4), 16), parseInt(h.slice(4, 6), 16)];
}

function writePng(filePath, width, height, fromHex, toHex) {
  const [r1, g1, b1] = hexToRgb(fromHex);
  const [r2, g2, b2] = hexToRgb(toHex);

  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(width, 0);
  ihdr.writeUInt32BE(height, 4);
  ihdr[8] = 8; // bit depth
  ihdr[9] = 2; // truecolor RGB

  const rows = [];
  for (let y = 0; y < height; y++) {
    const t = y / (height - 1);
    const r = Math.round(r1 + (r2 - r1) * t);
    const g = Math.round(g1 + (g2 - g1) * t);
    const b = Math.round(b1 + (b2 - b1) * t);
    const row = Buffer.alloc(1 + width * 3);
    row[0] = 0; // filter: none
    for (let x = 0; x < width; x++) {
      row[1 + x * 3] = r;
      row[2 + x * 3] = g;
      row[3 + x * 3] = b;
    }
    rows.push(row);
  }

  const png = Buffer.concat([
    Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]),
    pngChunk("IHDR", ihdr),
    pngChunk("IDAT", zlib.deflateSync(Buffer.concat(rows))),
    pngChunk("IEND", Buffer.alloc(0)),
  ]);
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  fs.writeFileSync(filePath, png);
}

/* ------------------------------ Product data ----------------------------- */
const SIZE_SETS = {
  alpha: ["S", "M", "L", "XL"],
  alphaXL: ["S", "M", "L", "XL", "XXL"],
  jeans: ["28", "30", "32", "34", "36"],
  kids: ["2-3Y", "4-5Y", "6-7Y", "8-9Y"],
  kidsS: ["2-3Y", "4-5Y", "6-7Y"],
};

const GRADIENTS = {
  Black: ["#33302C", "#14120F"],
  White: ["#F5F0E8", "#DCD2C0"],
  Navy: ["#2E3A4A", "#151B26"],
  Beige: ["#E9DECB", "#C9B99C"],
  Olive: ["#6D6A4E", "#3F3E2E"],
  Maroon: ["#74301F", "#3E1A10"],
  Multi: ["#8C4632", "#33424E"],
};

const P = [];
function product(slug, name, cat, type, color, price, sale, sizeSet, notes, desc, flags = {}) {
  P.push({ slug, name, cat, type, color, price, sale, sizeSet, notes, desc, flags });
}

// ---- Men ----
product("essential-crew-tee", "Essential Crew Tee", "t-shirts", "MEN", "Black", 599, 449, "alphaXL", ["Cotton", "Regular fit"], "A soft, everyday crew-neck tee in premium combed cotton.", { newArrival: true });
product("washed-oversized-tee", "Washed Oversized Tee", "t-shirts", "MEN", "Olive", 699, null, "alphaXL", ["Cotton", "Oversized"], "Garment-washed oversized tee with a relaxed, lived-in drape.");
product("linen-everyday-shirt", "Linen Everyday Shirt", "shirts", "MEN", "Beige", 1299, 1099, "alpha", ["Linen", "Breathable"], "Lightweight linen-cotton shirt — crisp enough for work, easy for weekends.");
product("oxford-button-down-shirt", "Oxford Button-Down Shirt", "shirts", "MEN", "White", 1499, null, "alpha", ["Cotton", "Oxford weave"], "The wardrobe classic: a structured oxford that softens with every wash.", { bestSeller: true });
product("pique-polo-shirt", "Piqué Polo Shirt", "polo-shirts", "MEN", "Navy", 899, 749, "alpha", ["Cotton", "Piqué knit"], "A sharp, breathable polo that keeps its collar all day.");
product("everyday-cotton-kurta", "Everyday Cotton Kurta", "kurtas", "MEN", "White", 1099, null, "alphaXL", ["Cotton", "Straight fit"], "A breathable straight-fit kurta cut from soft hand-feel cotton.");
product("indigo-festive-kurta-set", "Indigo Festive Kurta Set", "kurta-sets", "MEN", "Navy", 1899, 1499, "alpha", ["Cotton", "Festive"], "A ready-to-wear kurta set with tonal indigo detailing.", { bestSeller: true });
product("slim-stretch-jeans", "Slim Stretch Jeans", "jeans", "MEN", "Navy", 1599, 1299, "jeans", ["Denim", "Stretch"], "Fade-resistant denim with just the right amount of stretch.", { bestSeller: true });
product("pleated-chino-trousers", "Pleated Chino Trousers", "trousers-chinos", "MEN", "Beige", 1499, null, "jeans", ["Cotton", "Chino"], "Tailored chinos with a clean pleat and a tapered leg.");
product("relaxed-chino-shorts", "Relaxed Chino Shorts", "shorts", "MEN", "Olive", 799, null, "alpha", ["Cotton", "Chino"], "Easy shorts in breathable chino twill — made for warm days.");
product("bandhgala-nehru-jacket", "Bandhgala Nehru Jacket", "ethnic-wear", "MEN", "Black", 2499, null, "alpha", ["Cotton", "Tailored"], "A sharp bandhgala jacket for weddings and evenings out.");
product("everyday-coord-set", "Everyday Co-ord Set", "coord-sets", "MEN", "Beige", 1799, 1499, "alpha", ["Cotton", "Relaxed"], "A matched relaxed set — zero-effort dressing.");
product("heavyweight-pullover-hoodie", "Heavyweight Pullover Hoodie", "sweatshirts-hoodies", "MEN", "Maroon", 1399, null, "alphaXL", ["Cotton", "Fleece"], "A 400 GSM fleece hoodie with a roomy, boxy fit.", { newArrival: true });
product("utility-field-jacket", "Utility Field Jacket", "jackets-coats", "MEN", "Olive", 2299, 1899, "alpha", ["Cotton", "Utility"], "Four-pocket field jacket in rugged cotton twill.", { newArrival: true });
product("quick-dry-training-joggers", "Quick-Dry Training Joggers", "activewear", "MEN", "Black", 1199, null, "alpha", ["Polyester", "Stretch"], "Sweat-wicking joggers that move with your training.");
product("brushed-fleece-lounge-set", "Brushed Fleece Lounge Set", "loungewear-sleepwear", "MEN", "Navy", 1299, 1099, "alpha", ["Cotton", "Fleece"], "A cosy two-piece lounge set for slow mornings.", { bestSeller: true });

// ---- Women ----
product("a-line-midi-dress", "A-Line Midi Dress", "dresses", "WOMEN", "Maroon", 1899, null, "alpha", ["Crepe", "A-line"], "A flowing midi dress with a flattering A-line silhouette.", { bestSeller: true });
product("flowy-satin-blouse", "Flowy Satin Blouse", "tops-blouses", "WOMEN", "White", 999, null, "alpha", ["Satin", "Flowy"], "A silky blouse with a soft drape and clean lines.");
product("high-rise-skinny-jeans", "High-Rise Skinny Jeans", "jeans", "WOMEN", "Black", 1599, 1299, "jeans", ["Denim", "Stretch"], "Sculpting high-rise denim with a true skinny fit.", { bestSeller: true });
product("wide-leg-linen-trousers", "Wide-Leg Linen Trousers", "trousers-chinos", "WOMEN", "Beige", 1399, null, "alpha", ["Linen", "Wide leg"], "Breezy wide-leg trousers in washable linen.");
product("mirror-work-anarkali-kurti", "Mirror-Work Anarkali Kurti", "ethnic-wear", "WOMEN", "Multi", 1299, null, "alpha", ["Cotton", "Mirror work"], "A festive anarkali kurti with hand-placed mirror work.", { newArrival: true });
product("banarasi-silk-saree", "Banarasi Silk Saree", "sarees-lehengas", "WOMEN", "Maroon", 3499, 2999, ["Free Size"], ["Silk", "Banarasi"], "A rich Banarasi silk saree with a woven zari border.", { bestSeller: true });
product("breezy-two-piece-coord", "Breezy Two-Piece Co-ord", "coord-sets", "WOMEN", "Olive", 1699, null, "alpha", ["Cotton", "Relaxed"], "A matching crop-and-pants co-ord in breathable cotton.", { newArrival: true });
product("satin-pajama-set", "Satin Pajama Set", "loungewear-sleepwear", "WOMEN", "Multi", 1199, null, "alpha", ["Satin", "Soft"], "A pretty satin pyjama set for easy evenings in.");
product("high-waist-yoga-leggings", "High-Waist Yoga Leggings", "activewear", "WOMEN", "Black", 1299, null, "alpha", ["Nylon", "4-way stretch"], "Squat-proof leggings with a secure high waist.");
product("classic-trench-coat", "Classic Trench Coat", "jackets-coats", "WOMEN", "Beige", 2599, null, "alpha", ["Cotton", "Trench"], "An enduring trench with a belted waist and storm flap.", { newArrival: true });

// ---- Kids ----
product("dino-print-tee", "Dino Print Tee", "t-shirts", "KIDS", "Multi", 349, null, "kidsS", ["Cotton", "Fun print"], "A cheerful dino tee in soft, tag-free cotton.", { bestSeller: true });
product("flexi-stretch-denim-jeans", "Flexi-Stretch Denim Jeans", "jeans", "KIDS", "Navy", 899, 749, "kids", ["Denim", "Stretch"], "Easy-on jeans with a stretch waistband for growing kids.");
product("twirl-party-dress", "Twirl Party Dress", "dresses", "KIDS", "Multi", 999, null, "kids", ["Cotton", "Party"], "A twirl-worthy party dress with a soft full skirt.", { newArrival: true });
product("stretch-cotton-shorts", "Stretch Cotton Shorts", "shorts", "KIDS", "Olive", 399, null, "kidsS", ["Cotton", "Stretch"], "Hard-wearing shorts that survive the playground.");
product("cloud-print-hoodie", "Cloud Print Hoodie", "sweatshirts-hoodies", "KIDS", "Beige", 799, null, "kids", ["Cotton", "Fleece"], "A snuggly cloud-print hoodie for chilly mornings.");
product("festive-kids-kurta", "Festive Kids Kurta", "kurtas", "KIDS", "Maroon", 799, null, "kids", ["Cotton", "Festive"], "A mini festive kurta with comfortable side slits.");

/* --------------------------------- Main ---------------------------------- */
async function main() {
  const brand = await prisma.brand.upsert({
    where: { slug: "libaas" },
    update: { name: "Libaas", isActive: true },
    create: { name: "Libaas", slug: "libaas" },
  });

  const categories = await prisma.category.findMany();
  const catBySlug = new Map(categories.map((c) => [c.slug, c]));

  const publicDir = path.join(__dirname, "public", "demo");
  let createdImages = 0;

  for (const item of P) {
    const cat = catBySlug.get(item.cat);
    if (!cat) {
      console.log(`!! category not found: ${item.cat} — skipping ${item.slug}`);
      continue;
    }

    // Garment images are rendered by gen-product-images.cjs (sharp SVG
    // silhouettes). Only reference them here — don't overwrite.
    const imgFile = `${item.slug}-v2.png`;
    const imageUrl = `/demo/${imgFile}`;

    const baseSizes = SIZE_SETS[item.sizeSet] ?? item.sizeSet;
    const stockPerSize = baseSizes.map((size, i) => ({
      size,
      price: item.price,
      salePrice: item.sale,
      stock: 3 + ((i * 5) % 18),
    }));
    const totalStock = stockPerSize.reduce((s, x) => s + x.stock, 0);

    const data = {
      name: item.name,
      slug: item.slug,
      price: item.price,
      salePrice: item.sale,
      description: item.desc,
      imageUrl,
      imagePublicId: null,
      videoUrl: null,
      volume: item.color,
      notes: item.notes,
      productType: item.type,
      brandId: brand.id,
      categoryId: cat.id,
      stock: totalStock,
      isActive: true,
      sku: `LBS-${item.slug.toUpperCase().replace(/[^A-Z0-9]/g, "-").slice(0, 24)}-01`,
      bestSeller: item.flags.bestSeller ?? false,
      newArrival: item.flags.newArrival ?? false,
      featured: false,
      gallery: [imageUrl],
      galleryPublicIds: [],
    };

    const existing = await prisma.product.findUnique({ where: { slug: item.slug } });
    await prisma.$transaction(async (tx) => {
      if (existing) {
        await tx.product.update({ where: { slug: item.slug }, data });
        await tx.productSize.deleteMany({ where: { productId: existing.id } });
        await tx.productSize.createMany({
          data: stockPerSize.map((s) => ({ productId: existing.id, ...s })),
        });
      } else {
        await tx.product.create({
          data: { ...data, sizes: { create: stockPerSize } },
        });
      }
    });
  }

  // A few real reviews so cards show honest ratings + counts.
  const admin = await prisma.user.findFirst({ where: { email: "admin@libaas.com" } });
  const reviewSeeds = [
    ["slim-stretch-jeans", 5, "Great fit and the stretch makes it really comfortable for daily wear."],
    ["oxford-button-down-shirt", 4, "Solid fabric and neat stitching. Slightly roomy — size down if between sizes."],
    ["a-line-midi-dress", 5, "Beautiful fall and the colour is exactly as shown. Ordered one more colour!"],
    ["banarasi-silk-saree", 5, "The zari work looks premium. Packed really well too."],
    ["dino-print-tee", 5, "My son loves it. Soft cotton, survived many washes already."],
    ["heavyweight-pullover-hoodie", 4, "Warm and heavyweight as promised. Runs a little boxy."],
    ["festive-kids-kurta", 5, "Adorable and comfy for a full day of functions."],
  ];
  if (admin) {
    for (const [slug, rating, comment] of reviewSeeds) {
      const prod = await prisma.product.findUnique({ where: { slug } });
      if (!prod) continue;
      await prisma.review.upsert({
        where: { productId_userId: { productId: prod.id, userId: admin.id } },
        update: { rating, comment },
        create: { productId: prod.id, userId: admin.id, rating, comment },
      });
    }
  }

  const count = await prisma.product.count();
  console.log(`Brand: ${brand.name} (${brand.slug})`);
  console.log(`Products upserted: ${P.length} — total in DB now: ${count}`);
  console.log(`Placeholder images generated: ${createdImages} → public/demo/`);
  console.log(`Reviews seeded: ${reviewSeeds.length}`);
}

main()
  .catch((e) => {
    console.error("ERR", e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
