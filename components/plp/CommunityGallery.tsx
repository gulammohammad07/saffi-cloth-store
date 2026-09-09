"use client";

import Image from "next/image";
import Link from "next/link";
import { m as motion } from "framer-motion";
import { Heart, MessageCircle } from "lucide-react";
import { InstagramIcon } from "@/components/layout/SocialIcons";
import type { Product } from "@/lib/data/products";

const gradients = [
  {
    from: "#D6A383",
    to: "#BC4E22",
    text: "Worn like a memory, never a mask.",
    tag: "MD · Philosophy",
  },
  {
    from: "#EDE6DA",
    to: "#D5C097",
    text: "One drop, an entire evening.",
    tag: "@sana.styles",
  },
  {
    from: "#BC4E22",
    to: "#93371A",
    text: "The scent of a golden hour.",
    tag: "@style.diaries",
  },
  {
    from: "#E9E1D3",
    to: "#BC4E22",
    text: "Layered, never loud.",
    tag: "@style.atlas",
  },
];

export default function CommunityGallery({ products }: { products: Product[] }) {
  const images = products.flatMap((p) => p.gallery);

  const tiles = [
    { kind: "image" as const, src: images[0], ratio: "aspect-[3/4]", handle: "@style.diaries", likes: "2,4k", link: products[0]?.slug, name: products[0]?.name },
    { kind: "quote" as const, ratio: "aspect-[4/5]", ...gradients[0] },
    { kind: "image" as const, src: images[1], ratio: "aspect-[4/3]", handle: "@style.atlas", likes: "1,8k", link: products[1]?.slug, name: products[1]?.name },
    { kind: "image" as const, src: images[2], ratio: "aspect-[3/4]", handle: "@sana.styles", likes: "3,1k", link: products[2]?.slug, name: products[2]?.name },
    { kind: "quote" as const, ratio: "aspect-[4/5]", ...gradients[1] },
    { kind: "image" as const, src: images[3], ratio: "aspect-square", handle: "@goldenhourfrag", likes: "5,6k", link: products[1]?.slug, name: products[1]?.name },
    { kind: "image" as const, src: images[4], ratio: "aspect-[4/5]", handle: "@styledbykeya", likes: "2,9k", link: products[2]?.slug, name: products[2]?.name },
    { kind: "quote" as const, ratio: "aspect-[3/4]", ...gradients[2] },
    { kind: "image" as const, src: images[5], ratio: "aspect-[4/3]", handle: "@everyday.chic", likes: "4,2k", link: products[0]?.slug, name: products[0]?.name },
    { kind: "quote" as const, ratio: "aspect-[4/5]", ...gradients[3] },
    { kind: "image" as const, src: images[0], ratio: "aspect-square", handle: "@threadandtale", likes: "6,8k", link: products[2]?.slug, name: products[2]?.name },
    { kind: "image" as const, src: images[1], ratio: "aspect-[3/4]", handle: "@clothandco", likes: "1,5k", link: products[1]?.slug, name: products[1]?.name },
  ];

  return (
    <section className="bg-[#EDE6DA] py-24">
      <div className="mx-auto max-w-7xl px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.6 }}
          className="mb-14 text-center"
        >
          <div className="inline-flex items-center gap-3">
            <span className="h-px w-12 bg-gold" />
            <InstagramIcon size={16} className="text-gold" />
            <span className="h-px w-12 bg-gold" />
          </div>
          <h2 className="mt-4 font-display text-5xl font-medium text-ink sm:text-6xl">
            From the Community
          </h2>
          <p className="mx-auto mt-4 max-w-md text-sm text-ink/60">
            Tag <span className="text-gold">#StyledWithLibaas</span> to be featured in
            the gallery.
          </p>
        </motion.div>

        <div className="columns-2 gap-4 space-y-4 lg:columns-3 xl:columns-4 [&>*]:break-inside-avoid">
          {tiles.map((tile, i) => {
            if (tile.kind === "quote") {
              return (
                <motion.div
                  key={`quote-${i}`}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-40px" }}
                  transition={{ duration: 0.5, delay: (i % 4) * 0.06 }}
                  className="relative flex flex-col justify-between overflow-hidden rounded-3xl p-6 shadow-[0_20px_50px_-24px_rgba(28,26,23,0.3)]"
                  style={{
                    background: `linear-gradient(135deg, ${tile.from}, ${tile.to})`,
                  }}
                >
                  <div className="absolute -right-8 -top-8 h-32 w-32 rounded-full bg-white/20 blur-2xl" />
                  <span className="font-display text-5xl leading-none text-white/60">
                    &ldquo;
                  </span>
                  <p className="mt-2 font-display text-2xl font-medium leading-snug text-white">
                    {tile.text}
                  </p>
                  <p className="mt-6 text-xs font-semibold tracking-[0.22em] text-white/60 uppercase">
                    {tile.tag}
                  </p>
                </motion.div>
              );
            }

            return (
              <motion.div
                key={`img-${i}`}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{ duration: 0.5, delay: (i % 4) * 0.06 }}
                className="group relative overflow-hidden rounded-3xl shadow-[0_20px_50px_-24px_rgba(28,26,23,0.3)]"
              >
                <Link
                  href={tile.link ? `/product/${tile.link}` : "/shop"}
                  className="block"
                >
                  <div className={`relative w-full ${tile.ratio} bg-gradient-to-b from-[#F1EBE1] to-[#D9EAF3]`}>
                    {tile.src && (
                      <Image
                        src={tile.src}
                        alt={tile.name ?? "Community style"}
                        fill
                        sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                        className="object-contain p-6 transition-transform duration-700 ease-out group-hover:scale-110"
                      />
                    )}

                    {/* Hover overlay */}
                    <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 bg-[#1C1A17]/60 opacity-0 backdrop-blur-[2px] transition-opacity duration-400 group-hover:opacity-100">
                      <p className="font-display text-base font-semibold text-cream">
                        {tile.name}
                      </p>
                      <div className="flex items-center gap-5 text-xs text-cream">
                        <span className="flex items-center gap-1.5">
                          <Heart size={13} className="fill-gold text-gold" />
                          {tile.likes}
                        </span>
                        <span className="flex items-center gap-1.5">
                          <MessageCircle size={13} />
                          {tile.likes}
                        </span>
                      </div>
                    </div>

                    {/* Handle */}
                    <span className="absolute bottom-4 left-4 rounded-full bg-white/70 px-3 py-1 text-xs font-semibold tracking-[0.14em] text-ink/60 uppercase backdrop-blur-md">
                      {tile.handle}
                    </span>
                  </div>
                </Link>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
