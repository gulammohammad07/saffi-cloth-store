"use client";

import Link from "next/link";
import Image from "next/image";
import { memo, useRef } from "react";
import {
  m as motion,
  useMotionValue,
  useMotionTemplate,
  useSpring,
  useTransform,
} from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import type { StorefrontCategory } from "@/lib/services/storefront-data";
import SectionHeading from "@/components/landing/SectionHeading";
import { useHoverCapable } from "@/lib/hooks/use-media-query";

export default function CategoryShowcase({
  categories,
}: {
  categories: StorefrontCategory[];
}) {
  // Resolved once here rather than per card — one media-query subscription
  // instead of one per category tile.
  const tiltOk = useHoverCapable();

  // Skip the whole section until the store actually has categories — a bare
  // heading with an empty grid reads as an unfinished demo.
  if (categories.length === 0) return null;

  // Clothing stores carry long category lists; the homepage shows the newest
  // few and the full set lives in the nav + the /shop category rail.
  const featuredCategories = categories.slice(0, 8);

  return (
    <section className="relative overflow-hidden bg-[#F4EFE6] py-28 sm:py-36">
      <div className="pointer-events-none absolute left-1/2 top-0 h-px w-[60%] -translate-x-1/2 bg-gradient-to-r from-transparent via-gold/30 to-transparent" />
      <div className="pointer-events-none absolute -right-40 top-1/3 h-[420px] w-[420px] bg-[radial-gradient(circle,rgba(188,78,34,0.12),transparent_70%)]" />
      <div className="pointer-events-none absolute -left-40 top-2/3 h-[300px] w-[300px] bg-[radial-gradient(circle,rgba(221,139,95,0.08),transparent_70%)]" />

      <div className="relative mx-auto max-w-7xl px-6">
        <SectionHeading
          eyebrow="The Collection"
          title="Shop by Category"
          description="Curated pieces across Men, Women & Kids. Find the style that speaks to you."
        />

        {/* 8 tiles in a 4-col grid = two even rows; 3 cols left a lone
            orphan row of 2 */}
        <div className="grid grid-cols-1 gap-7 sm:grid-cols-2 lg:grid-cols-4">
          {featuredCategories.map((category, index) => (
            <TiltCard
              key={category.slug}
              category={category}
              index={index}
              tiltOk={tiltOk}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

const TiltCard = memo(function TiltCard({
  category,
  index,
  tiltOk,
}: {
  category: StorefrontCategory;
  index: number;
  tiltOk: boolean;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const rotateX = useSpring(my, { stiffness: 100, damping: 18, mass: 0.5 });
  const rotateY = useSpring(mx, { stiffness: 100, damping: 18, mass: 0.5 });
  const glareX = useTransform(mx, [-0.5, 0.5], ["0%", "100%"]);
  const glareY = useTransform(my, [0.5, -0.5], ["0%", "100%"]);
  const glare = useMotionTemplate`radial-gradient(circle at ${glareX} ${glareY}, rgba(221,139,95,0.32), transparent 55%)`;

  const handleMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!tiltOk) return;
    const rect = ref.current?.getBoundingClientRect();
    if (!rect) return;
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    mx.set(x * 20);
    my.set(-y * 20);
  };

  const reset = () => {
    mx.set(0);
    my.set(0);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.7, delay: index * 0.14, ease: [0.22, 1, 0.36, 1] }}
    >
      <Link href={`/shop?category=${category.slug}`} className="group block">
        <motion.div
          ref={ref}
          onMouseMove={handleMove}
          onMouseLeave={reset}
          style={
            tiltOk
              ? {
                rotateX,
                rotateY,
                transformStyle: "preserve-3d",
                perspective: 1000,
              }
              : undefined
          }
          className="relative overflow-hidden rounded-[2.5rem] border border-gold/15 bg-white shadow-[0_24px_60px_-20px_rgba(19,17,16,0.15)] transition-all duration-700 group-hover:border-gold/50 group-hover:shadow-[0_40px_80px_-30px_rgba(188,78,34,0.25)]"
        >
          <div className="relative aspect-[4/3] overflow-hidden bg-gradient-to-b from-[#ECE5D8] via-[#F4EFE6] to-[#F3EEE5]">
            {category.imageUrl && (
              <Image
                src={category.imageUrl}
                alt=""
                fill
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                className="object-cover transition-transform duration-700 ease-out group-hover:scale-110 group-hover:-translate-y-2"
              />
            )}

            <div className="absolute inset-0 bg-gradient-to-t from-[#0D0B09]/85 via-[#0D0B09]/30 to-transparent transition-opacity duration-700 group-hover:from-[#0D0B09]/90" />

            {/* Cursor-following glare — pointless without a cursor, and it
                rebuilds a radial-gradient string every frame, so keep it off
                touch devices entirely. */}
            {tiltOk && (
              <motion.div
                style={{ background: glare }}
                className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
              />
            )}

            <div className="absolute right-6 top-6 flex h-11 w-11 items-center justify-center rounded-full border border-gold/40 bg-white/70 text-gold opacity-0 shadow-lg backdrop-blur-xl transition-all duration-700 group-hover:opacity-100">
              <ArrowUpRight size={18} />
            </div>

            <div
              className="absolute inset-x-0 bottom-0 p-7"
              style={{ transform: "translateZ(40px)" }}
            >
              <h3 className="font-display text-3xl font-medium tracking-tight text-white">
                {category.name}
              </h3>
              {category.tagline && (
                /* Extra clearance so two-line titles (e.g. 'Trousers &
                    Chinos') never crowd the tagline below them. */
                <p className="mt-3 text-sm tracking-wide text-cream-dark">
                  {category.tagline}
                </p>
              )}
            </div>
          </div>
        </motion.div>
      </Link>
    </motion.div>
  );
});
