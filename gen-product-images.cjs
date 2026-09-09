#!/usr/bin/env node
/* eslint-disable @typescript-eslint/no-require-imports */
/* Renders real-looking garment images for the demo catalogue: an SVG
   silhouette per category (tee/shirt/kurta/jeans/dress/saree/hoodie/jacket/
   shorts/coords/leggings/activewear/lounge/kids variants) composited onto a
   fabric-textured background in the product's colourway, via sharp.
   Idempotent: overwrites public/demo/<slug>.png and leaves DB imageUrl as
   /demo/<slug>.png (unchanged). Run: node gen-product-images.cjs */

const fs = require("fs");
const path = require("path");
require("dotenv").config();
const { PrismaPg } = require("@prisma/adapter-pg");
const { PrismaClient } = require("@prisma/client");
const sharp = require("sharp");

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });

/* ------------------------- (kept for fallback) ---------------------------- */
function crc32() {
  return 0;
}
void crc32;

/* ------------------------------ SVG builder ------------------------------- */
const W = 800, H = 1000;

// Body path helper — a symmetric path built from half, mirrored.
function shadeDefs(fill) {
  return `
    <linearGradient id="fab" x1="0" y1="0" x2="0.35" y2="1">
      <stop offset="0" stop-color="${fill}"/>
      <stop offset="0.55" stop-color="${fill}"/>
      <stop offset="1" stop-color="${fill}"/>
    </linearGradient>`;
}

function garmentSvg(kind, hex) {
  const dark = shade(hex, -18);
  const lite = shade(hex, 14);
  const line = shade(hex, -34);
  const goldHex = "#D9A441";
  const s = [];
  const open = (extra = "") =>
    `<g fill="url(#fab)" stroke="${line}" stroke-width="5" stroke-linejoin="round" ${extra}>`;

  if (kind === "tee") {
    s.push(open());
    s.push(`<path d="M290 170 L235 200 L165 320 L235 375 L245 340 L245 850 Q400 890 555 850 L555 340 L565 375 L635 320 L565 200 L510 170 Q400 235 290 170 Z"/>`);
    s.push(`</g>`);
    s.push(`<path d="M290 170 Q400 235 510 170 Q470 145 400 145 Q330 145 290 170 Z" fill="${dark}" stroke="${line}" stroke-width="5"/>`);
    s.push(collar(400, 175, 105, dark, line));
    s.push(softShade(250, 300, 320, 480));
  } else if (kind === "shirt") {
    s.push(open());
    s.push(`<path d="M285 175 L225 205 L160 330 L232 382 L244 345 L244 852 Q400 890 556 852 L556 345 L568 382 L640 330 L575 205 L515 175 L400 260 Z"/>`);
    s.push(`</g>`);
    s.push(`<path d="M285 175 L400 260 L515 175 L540 195 L400 300 L260 195 Z" fill="${lite}" stroke="${line}" stroke-width="4"/>`);
    s.push(`<rect x="388" y="265" width="24" height="330" rx="10" fill="${dark}" stroke="${line}" stroke-width="3"/>`);
    s.push(buttons(400, 300, 540, 7, dark));
    s.push(collar(400, 205, 120, lite, line));
    s.push(softShade(255, 300, 310, 500));
  } else if (kind === "polo") {
    s.push(open());
    s.push(`<path d="M290 175 L235 205 L168 325 L236 378 L246 342 L246 848 Q400 886 554 848 L554 342 L564 378 L632 325 L565 205 L510 175 L400 262 Z"/>`);
    s.push(`</g>`);
    s.push(`<path d="M400 262 L472 195 L512 215 L430 330 Z" fill="${lite}" stroke="${line}" stroke-width="4"/>`);
    s.push(`<rect x="392" y="268" width="16" height="120" rx="8" fill="${dark}" stroke="${line}" stroke-width="3"/>`);
    s.push(buttons(400, 300, 370, 3, dark));
    s.push(`<rect x="246" y="640" width="308" height="14" fill="${dark}" opacity="0.55"/>`);
    s.push(softShade(255, 300, 310, 480));
  } else if (kind === "kurta") {
    s.push(open());
    s.push(`<path d="M285 178 L222 210 L155 340 L230 392 L244 352 L238 900 Q400 936 562 900 L556 352 L570 392 L645 340 L578 210 L515 178 L400 268 Z"/>`);
    s.push(`</g>`);
    s.push(`<path d="M285 178 L400 268 L515 178 L545 200 L400 312 L255 200 Z" fill="${lite}" stroke="${line}" stroke-width="4"/>`);
    s.push(`<rect x="388" y="278" width="24" height="500" rx="10" fill="${dark}" stroke="${line}" stroke-width="3"/>`);
    s.push(buttons(400, 320, 740, 6, dark));
    s.push(`<path d="M238 830 Q400 862 562 830" fill="none" stroke="${line}" stroke-width="4" opacity="0.7"/>`);
    s.push(collar(400, 210, 115, lite, line));
    s.push(softShade(250, 320, 330, 540));
  } else if (kind === "kurta-set") {
    s.push(open());
    s.push(`<path d="M285 178 L222 210 L155 340 L230 392 L244 352 L238 880 Q400 916 562 880 L556 352 L570 392 L645 340 L578 210 L515 178 L400 268 Z"/>`);
    s.push(`</g>`);
    s.push(`<path d="M285 178 L400 268 L515 178 L545 200 L400 312 L255 200 Z" fill="${lite}" stroke="${line}" stroke-width="4"/>`);
    s.push(`<rect x="388" y="278" width="24" height="480" rx="10" fill="${dark}" stroke="${line}" stroke-width="3"/>`);
    s.push(`<g fill="${dark}" stroke="${line}" stroke-width="5"><path d="M330 880 L318 962 L382 962 L388 880 Z"/><path d="M412 880 L418 962 L482 962 L470 880 Z"/></g>`);
    s.push(collar(400, 210, 115, lite, line));
    s.push(softShade(250, 320, 330, 520));
  } else if (kind === "jeans") {
    s.push(open());
    s.push(`<path d="M272 165 L528 165 L560 300 L540 890 L445 890 L412 470 L388 470 L355 890 L260 890 L240 300 Z"/>`);
    s.push(`</g>`);
    s.push(`<rect x="262" y="150" width="276" height="46" rx="12" fill="${dark}" stroke="${line}" stroke-width="5"/>`);
    s.push(`<path d="M336 196 L336 160 M464 196 L464 160" stroke="${line}" stroke-width="5"/>`);
    s.push(`<path d="M382 200 L400 260 L418 200 Z" fill="none" stroke="${line}" stroke-width="5"/>`);
    s.push(`<path d="M272 165 L240 300 M528 165 L560 300" fill="none" stroke="${dark}" stroke-width="10"/>`);
    s.push(`<g stroke="${shade(hex, -10)}" stroke-width="3" opacity="0.7">`);
    s.push(`<path d="M262 330 L246 880 M538 330 L554 880 M300 200 L292 880 M500 200 L508 880"/>`);
    s.push(`</g>`);
    s.push(`<rect x="378" y="300" width="44" height="52" rx="8" fill="${lite}" stroke="${line}" stroke-width="4"/>`);
    s.push(softShade(280, 250, 300, 600));
  } else if (kind === "shorts") {
    s.push(open());
    s.push(`<path d="M272 300 L528 300 L556 420 L528 680 L432 680 L400 470 L368 680 L272 680 L244 420 Z"/>`);
    s.push(`</g>`);
    s.push(`<rect x="262" y="286" width="276" height="44" rx="12" fill="${dark}" stroke="${line}" stroke-width="5"/>`);
    s.push(`<path d="M382 330 L400 380 L418 330 Z" fill="none" stroke="${line}" stroke-width="5"/>`);
    s.push(`<path d="M336 330 L336 292 M464 330 L464 292" stroke="${line}" stroke-width="5"/>`);
    s.push(softShade(285, 350, 260, 280));
  } else if (kind === "dress") {
    s.push(open());
    s.push(`<path d="M310 165 L490 165 L520 240 L470 300 L488 470 Q560 640 545 900 Q400 940 255 900 Q240 640 312 470 L330 300 L280 240 Z"/>`);
    s.push(`</g>`);
    s.push(`<path d="M310 165 Q400 205 490 165 L520 240 Q400 285 280 240 Z" fill="${lite}" stroke="${line}" stroke-width="4"/>`);
    s.push(`<path d="M330 300 L470 300 L482 380 L318 380 Z" fill="${dark}" opacity="0.25"/>`);
    s.push(`<path d="M312 470 Q400 500 488 470" fill="none" stroke="${line}" stroke-width="4" opacity="0.6"/>`);
    s.push(`<path d="M262 880 Q400 915 538 880" fill="none" stroke="${line}" stroke-width="5"/>`);
    s.push(softShade(300, 300, 240, 520));
  } else if (kind === "blouse") {
    s.push(open());
    s.push(`<path d="M300 185 L240 215 L180 330 L245 378 L255 345 L255 640 Q400 680 545 640 L545 345 L555 378 L620 330 L560 215 L500 185 Q400 245 300 185 Z"/>`);
    s.push(`</g>`);
    s.push(`<path d="M300 185 Q400 245 500 185 L520 210 Q400 280 280 210 Z" fill="${lite}" stroke="${line}" stroke-width="4"/>`);
    s.push(`<path d="M318 640 Q400 662 482 640" fill="none" stroke="${line}" stroke-width="4" opacity="0.7"/>`);
    s.push(collar(400, 215, 100, lite, line));
    s.push(softShade(260, 280, 300, 330));
  } else if (kind === "saree") {
    s.push(`<g stroke="${line}" stroke-width="5" stroke-linejoin="round">`);
    s.push(`<path d="M330 880 L318 962 L382 962 L388 880 Z" fill="${dark}"/>`);
    s.push(`<path d="M412 880 L418 962 L482 962 L470 880 Z" fill="${dark}"/>`);
    s.push(`</g>`);
    // draped body
    s.push(`<path d="M420 150 Q300 320 300 560 Q300 780 340 900 L520 900 Q560 760 560 540 Q560 320 460 150 Z" fill="url(#fab)" stroke="${line}" stroke-width="5"/>`);
    // pallu over shoulder
    s.push(`<path d="M430 155 Q560 300 585 520 Q600 720 585 900 L520 900 Q540 700 520 520 Q505 340 430 155 Z" fill="${shade(hex, -12)}" stroke="${line}" stroke-width="5"/>`);
    // zari border
    s.push(`<path d="M300 560 Q560 560 560 540" fill="none" stroke="${goldHex}" stroke-width="14" opacity="0.9"/>`);
    s.push(`<path d="M340 880 Q520 880 585 880" fill="none" stroke="${goldHex}" stroke-width="10" opacity="0.9"/>`);
    s.push(`<g fill="${goldHex}" opacity="0.85">`);
    for (let i = 0; i < 7; i++) s.push(`<circle cx="${330 + i * 38}" cy="${600 + (i % 2) * 26}" r="7"/>`);
    s.push(`</g>`);
    s.push(blouseBand(hex, line));
    s.push(softShade(320, 300, 240, 500));
  } else if (kind === "coord") {
    s.push(open());
    s.push(`<path d="M295 185 L240 212 L185 320 L248 370 L258 340 L258 560 Q400 600 542 560 L542 340 L552 370 L615 320 L560 212 L505 185 Q400 240 295 185 Z"/>`);
    s.push(`</g>`);
    s.push(`<g fill="url(#fab)" stroke="${line}" stroke-width="5"><path d="M300 600 L290 880 L392 880 L398 600 Z"/><path d="M402 600 L408 880 L510 880 L500 600 Z"/></g>`);
    s.push(`<rect x="290" y="580" width="220" height="26" fill="${dark}" stroke="${line}" stroke-width="4"/>`);
    s.push(softShade(265, 280, 290, 300));
  } else if (kind === "hoodie") {
    s.push(open());
    s.push(`<path d="M292 190 L232 220 L170 345 L238 396 L250 360 L250 860 Q400 898 550 860 L550 360 L562 396 L630 345 L568 220 L508 190 Q400 258 292 190 Z"/>`);
    s.push(`</g>`);
    // hood
    s.push(`<path d="M292 190 Q400 262 508 190 Q520 150 460 128 Q400 108 340 128 Q280 150 292 190 Z" fill="${dark}" stroke="${line}" stroke-width="5"/>`);
    // pocket + strings
    s.push(`<path d="M310 620 L490 620 L470 740 L330 740 Z" fill="none" stroke="${line}" stroke-width="5"/>`);
    s.push(`<path d="M368 240 L364 330 M432 240 L436 330" stroke="${lite}" stroke-width="8" stroke-linecap="round"/>`);
    s.push(`<circle cx="364" cy="336" r="8" fill="${lite}"/><circle cx="436" cy="336" r="8" fill="${lite}"/>`);
    s.push(`<rect x="250" y="830" width="300" height="16" fill="${dark}" opacity="0.5"/>`);
    s.push(softShade(258, 320, 310, 480));
  } else if (kind === "jacket") {
    s.push(open());
    s.push(`<path d="M282 185 L222 214 L158 338 L230 390 L244 352 L244 870 Q400 908 556 870 L556 352 L570 390 L642 338 L578 214 L518 185 L400 272 Z"/>`);
    s.push(`</g>`);
    s.push(`<path d="M282 185 L400 272 L518 185 L548 208 L400 318 L252 208 Z" fill="${dark}" stroke="${line}" stroke-width="4"/>`);
    s.push(`<g fill="${shade(hex, -22)}" stroke="${line}" stroke-width="4">`);
    s.push(`<rect x="272" y="470" width="92" height="110" rx="10"/>`);
    s.push(`<rect x="436" y="470" width="92" height="110" rx="10"/>`);
    s.push(`</g>`);
    s.push(`<rect x="386" y="285" width="28" height="500" rx="12" fill="${dark}" stroke="${line}" stroke-width="3"/>`);
    s.push(buttons(400, 320, 760, 6, lite));
    s.push(`<rect x="244" y="845" width="312" height="16" fill="${dark}" opacity="0.55"/>`);
    s.push(collar(400, 218, 118, dark, line));
    s.push(softShade(250, 320, 330, 500));
  } else if (kind === "leggings") {
    s.push(open());
    s.push(`<path d="M280 210 L520 210 L548 340 L520 900 L438 900 L406 480 L394 480 L362 900 L280 900 L252 340 Z"/>`);
    s.push(`</g>`);
    s.push(`<rect x="272" y="192" width="256" height="50" rx="16" fill="${dark}" stroke="${line}" stroke-width="5"/>`);
    s.push(`<path d="M262 340 L538 340" stroke="${shade(hex, -12)}" stroke-width="6" opacity="0.6"/>`);
    s.push(softShade(290, 280, 250, 540));
  } else if (kind === "activewear") {
    s.push(open());
    s.push(`<path d="M290 200 L238 226 L180 340 L242 388 L254 356 L254 660 Q400 700 546 660 L546 356 L558 388 L620 340 L562 226 L510 200 Q400 258 290 200 Z"/>`);
    s.push(`</g>`);
    s.push(`<path d="M290 200 Q400 258 510 200 L525 178 Q400 120 275 178 Z" fill="${dark}" stroke="${line}" stroke-width="5"/>`);
    s.push(`<path d="M254 620 Q400 660 546 620" stroke="${lite}" stroke-width="8" fill="none" opacity="0.8"/>`);
    s.push(`<path d="M330 380 L330 560 M470 380 L470 560" stroke="${lite}" stroke-width="6" opacity="0.5"/>`);
    s.push(softShade(262, 300, 300, 330));
  } else if (kind === "lounge") {
    s.push(open());
    s.push(`<path d="M292 190 L236 218 L176 338 L240 388 L252 356 L252 700 Q400 740 548 700 L548 356 L560 388 L624 338 L564 218 L508 190 Q400 252 292 190 Z"/>`);
    s.push(`</g>`);
    s.push(`<path d="M292 190 Q400 252 508 190 L522 168 Q400 112 278 168 Z" fill="${lite}" stroke="${line}" stroke-width="4"/>`);
    s.push(`<g fill="url(#fab)" stroke="${line}" stroke-width="5"><path d="M310 700 L300 890 L390 890 L396 700 Z"/><path d="M404 700 L410 890 L500 890 L490 700 Z"/></g>`);
    s.push(`<rect x="336" y="450" width="128" height="34" rx="8" fill="${lite}" opacity="0.6"/>`);
    s.push(softShade(262, 300, 300, 480));
  } else if (kind === "kids-tee") {
    s.push(open());
    s.push(`<path d="M310 230 L262 256 L205 352 L262 398 L272 370 L272 760 Q400 792 528 760 L528 370 L538 398 L595 352 L538 256 L490 230 Q400 285 310 230 Z"/>`);
    s.push(`</g>`);
    s.push(`<path d="M310 230 Q400 285 490 230 Q460 208 400 208 Q340 208 310 230 Z" fill="${dark}" stroke="${line}" stroke-width="5"/>`);
    // playful print
    s.push(`<g fill="${lite}" opacity="0.95">`);
    s.push(`<ellipse cx="400" cy="520" rx="86" ry="64"/>`);
    s.push(`<circle cx="332" cy="470" r="26"/><circle cx="400" cy="440" r="30"/><circle cx="468" cy="470" r="26"/>`);
    s.push(`</g>`);
    s.push(`<g fill="${line}"><circle cx="374" cy="512" r="9"/><circle cx="426" cy="512" r="9"/><path d="M382 548 Q400 562 418 548" fill="none" stroke="${line}" stroke-width="7"/></g>`);
    s.push(softShade(280, 320, 280, 400));
  } else if (kind === "kids-dress") {
    s.push(open());
    s.push(`<path d="M322 235 L478 235 L502 300 L462 350 L476 480 Q536 620 524 820 Q400 852 276 820 Q264 620 324 480 L338 350 L298 300 Z"/>`);
    s.push(`</g>`);
    s.push(`<path d="M322 235 Q400 272 478 235 L502 300 Q400 338 298 300 Z" fill="${lite}" stroke="${line}" stroke-width="4"/>`);
    // twirl skirt scallops
    s.push(`<path d="M276 820 Q312 796 348 820 Q384 796 420 820 Q456 796 492 820 Q510 800 524 820" fill="none" stroke="${line}" stroke-width="5"/>`);
    s.push(`<g fill="${goldHex}" opacity="0.7"><circle cx="360" cy="560" r="8"/><circle cx="400" cy="596" r="8"/><circle cx="440" cy="560" r="8"/></g>`);
    s.push(softShade(310, 320, 220, 440));
  } else {
    // generic fallback
    s.push(open());
    s.push(`<path d="M290 180 L230 208 L168 330 L236 380 L248 346 L248 850 Q400 888 552 850 L552 346 L564 380 L632 330 L570 208 L510 180 Q400 240 290 180 Z"/>`);
    s.push(`</g>`);
    s.push(softShade(255, 300, 320, 480));
  }

  return s.join("\n");
}

function collar(cx, cy, w, fill, line) {
  return `<path d="M${cx - w / 2} ${cy - 18} Q${cx} ${cy + 44} ${cx + w / 2} ${cy - 18} Q${cx} ${cy + 14} ${cx - w / 2} ${cy - 18} Z" fill="${fill}" stroke="${line}" stroke-width="4"/>`;
}

function buttons(cx, y1, y2, n, fill) {
  const out = [];
  for (let i = 0; i < n; i++) {
    const y = y1 + ((y2 - y1) / (n - 1)) * i;
    out.push(`<circle cx="${cx}" cy="${y}" r="7" fill="${fill}"/>`);
  }
  return out.join("\n");
}

function blouseBand(hex, line) {
  return `<path d="M300 150 Q400 120 500 150 L500 250 Q400 282 300 250 Z" fill="${shade(hex, 10)}" stroke="${line}" stroke-width="5"/>`;
}

// Big soft radial highlight to fake fabric sheen.
function softShade(x, y, w, h) {
  return `<ellipse cx="${x + w / 2}" cy="${y + h / 2}" rx="${w * 0.55}" ry="${h * 0.4}" fill="white" opacity="0.07"/>`;
}

function shade(hex, amt) {
  const n = hex.replace("#", "");
  const num = parseInt(n, 16);
  const clamp = (v) => Math.max(0, Math.min(255, v));
  const r = clamp((num >> 16) + amt);
  const g = clamp(((num >> 8) & 0xff) + amt);
  const b = clamp((num & 0xff) + amt);
  return `#${((r << 16) | (g << 8) | b).toString(16).padStart(6, "0")}`;
}

const CLOTH = {
  Black: "#33302C",
  White: "#EDE7DB",
  Navy: "#2E3A4A",
  Beige: "#D9CCB2",
  Olive: "#6D6A4E",
  Maroon: "#74301F",
  Multi: "#8C4632",
};

const KIND_BY_CATEGORY = {
  "t-shirts": "tee",
  shirts: "shirt",
  "polo-shirts": "polo",
  kurtas: "kurta",
  "kurta-sets": "kurta-set",
  jeans: "jeans",
  "trousers-chinos": "jeans",
  shorts: "shorts",
  dresses: "dress",
  "tops-blouses": "blouse",
  "ethnic-wear": "kurta",
  "sarees-lehengas": "saree",
  "coord-sets": "coord",
  "sweatshirts-hoodies": "hoodie",
  "jackets-coats": "jacket",
  activewear: "activewear",
  "loungewear-sleepwear": "lounge",
};

/* --------------------------------- main ----------------------------------- */
async function main() {
  const products = await prisma.product.findMany({
    select: { slug: true, name: true, volume: true, productType: true, category: { select: { slug: true } } },
  });

  const outDir = path.join(__dirname, "public", "demo");
  fs.mkdirSync(outDir, { recursive: true });

  let done = 0;
  for (const p of products) {
    const hex = CLOTH[p.volume] ?? CLOTH.Multi;
    const isKids = p.productType === "KIDS";
    let kind = KIND_BY_CATEGORY[p.category?.slug] ?? "tee";
    if (isKids) {
      if (kind === "dress") kind = "kids-dress";
      else kind = "kids-tee";
    }

    const bg = shade(hex, 42);
    const bgDark = shade(hex, -6);
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">
  <defs>${shadeDefs(hex)}
    <linearGradient id="bg" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="${bg}"/>
      <stop offset="1" stop-color="${bgDark}"/>
    </linearGradient>
    <radialGradient id="glow" cx="0.5" cy="0.32" r="0.75">
      <stop offset="0" stop-color="white" stop-opacity="0.30"/>
      <stop offset="1" stop-color="white" stop-opacity="0"/>
    </radialGradient>
  </defs>
  <rect width="${W}" height="${H}" fill="url(#bg)"/>
  <rect width="${W}" height="${H}" fill="url(#glow)"/>
  <!-- soft floor shadow -->
  <ellipse cx="400" cy="905" rx="250" ry="38" fill="black" opacity="0.16"/>
  ${garmentSvg(kind, hex)}
</svg>`;

    const outPath = path.join(outDir, `${p.slug}.png`);
    await sharp(Buffer.from(svg)).png({ compressionLevel: 9 }).toFile(outPath);
    done++;
  }

  console.log(`Generated ${done} garment images → public/demo/`);
}

main()
  .catch((e) => {
    console.error("ERR", e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
