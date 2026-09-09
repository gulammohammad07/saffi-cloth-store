"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { m as motion, useScroll, useTransform } from "framer-motion";
import { ArrowRight } from "lucide-react";
import type { StorefrontCategory } from "@/lib/services/storefront-data";

type Collection = {
  title: string;
  subtitle: string;
  description: string;
  image?: string | null;
  href: string;
};

const fallback: Collection[] = [
  {
    title: "Everyday Essentials",
    subtitle: "The Capsule",
    description:
      "Soft cottons and easy silhouettes that make getting dressed simple.",
    href: "/shop",
  },
  {
    title: "Festive Edit",
    subtitle: "The Occasion",
    description:
      "Hand-embellished styles made for weddings and celebrations.",
    href: "/shop",
  },
  {
    title: "Office Ready",
    subtitle: "The 9-to-5",
    description:
      "Sharp shirts and tailored trousers that work as hard as you do.",
    href: "/shop",
  },
  {
    title: "Lounge & Comfort",
    subtitle: "The Reset",
    description:
      "Breathable loungewear for slow mornings and lazy evenings.",
    href: "/shop",
  },
  {
    title: "Denim Stories",
    subtitle: "The Classic",
    description:
      "Indigo washes that fade into your own — never out of style.",
    href: "/shop",
  },
];

export default function LuxuryCollections({
  categories,
}: {
  categories: StorefrontCategory[];
}) {
  const ref = useRef<HTMLElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const [range, setRange] = useState<[number, number]>([0, 0]);

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end end"],
  });

  useEffect(() => {
    const el = trackRef.current;
    if (!el) return;
    const update = () =>
      setRange([0, -(el.scrollWidth - window.innerWidth)]);
    update();
    const ro = new ResizeObserver(update);
    ro.observe(el);
    window.addEventListener("resize", update);
    return () => {
      ro.disconnect();
      window.removeEventListener("resize", update);
    };
  }, []);

  const x = useTransform(scrollYProgress, [0, 1], range);
  const bgY = useTransform(scrollYProgress, [0, 1], ["-8%", "12%"]);

  const collections: Collection[] = fallback.map((c, i) => ({
    ...c,
    image: categories[i % categories.length]?.imageUrl ?? null,
  }));

  return (
    <section ref={ref} className="relative bg-[#EDE6DA] text-ink">
      <div
        className="sticky top-0 flex h-screen flex-col justify-center overflow-hidden"
        aria-label="Luxury collections"
      >
        {/* parallax background */}
        <div className="pointer-events-none absolute inset-0">
          <motion.div
            style={{ y: bgY }}
            className="absolute -right-40 top-0 h-[70%] w-[50%] opacity-60"
          >
            <div className="h-full w-full bg-[radial-gradient(circle_at_center,rgba(214,163,131,0.25),transparent_65%)]" />
          </motion.div>
          <div className="absolute inset-0 bg-gradient-to-b from-[#EDE6DA] via-transparent to-[#EDE6DA]" />
        </div>

        <div className="relative z-10 mx-auto mb-10 w-full max-w-7xl px-6">
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-xs font-semibold tracking-[0.3em] text-gold uppercase"
          >
            Curated Worlds
          </motion.p>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="mt-3 font-display text-3xl font-medium sm:text-5xl"
          >
            Signature <span className="gold-gradient-text italic">Collections</span>
          </motion.h2>
        </div>

        <motion.div
          ref={trackRef}
          style={{ x }}
          className="flex w-max items-stretch gap-6 pl-[6vw] lg:gap-10"
        >
          {collections.map((collection, i) => (
            <Link
              key={collection.title}
              href={collection.href}
              className="group relative block h-[54vh] w-[72vw] shrink-0 overflow-hidden rounded-[1.75rem] border border-gold/25 bg-[#EFE9DE] shadow-[0_40px_80px_-40px_rgba(28,26,23,0.4)] sm:h-[58vh] sm:w-[46vw] lg:h-[62vh] lg:w-[30vw]"
            >
              {/* image */}
              <div className="absolute inset-0">
                {collection.image ? (
                  <Image
                    src={collection.image}
                    alt={collection.title}
                    fill
                    sizes="(max-width: 768px) 72vw, 30vw"
                    className="object-cover opacity-70 transition-all duration-[1.2s] ease-out group-hover:scale-110 group-hover:opacity-85"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-gold/15 to-transparent">
                    <span className="font-display text-7xl font-medium text-gold/30 transition-colors duration-700 group-hover:text-gold/60">
                      {collection.title.charAt(0)}
                    </span>
                  </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-[#EFE9DE] via-[#EFE9DE]/25 to-transparent" />
              </div>

              {/* number */}
              <span className="absolute left-6 top-6 font-display text-5xl font-light text-ink/30 transition-colors duration-500 group-hover:text-gold/60">
                {String(i + 1).padStart(2, "0")}
              </span>

              {/* copy */}
              <div className="absolute inset-x-0 bottom-0 p-7 lg:p-9">
                <p className="text-xs font-semibold tracking-[0.3em] text-gold uppercase">
                  {collection.subtitle}
                </p>
                <h3 className="mt-2 font-display text-3xl font-medium text-ink sm:text-3xl">
                  {collection.title}
                </h3>
                <p className="mt-3 max-w-xs text-sm leading-relaxed text-ink/60">
                  {collection.description}
                </p>
                <div className="mt-5 inline-flex items-center gap-2 text-xs font-semibold tracking-[0.25em] text-ink uppercase opacity-0 transition-all duration-500 group-hover:opacity-100">
                  Discover
                  <ArrowRight
                    size={14}
                    className="text-gold transition-transform group-hover:translate-x-1"
                  />
                </div>
              </div>

              {/* gold border glow */}
              <div className="pointer-events-none absolute inset-0 rounded-[1.75rem] ring-1 ring-inset ring-gold/0 transition-all duration-700 group-hover:ring-gold/50" />
            </Link>
          ))}

          {/* end card */}
          <Link
            href="/shop"
            className="flex h-[54vh] w-[60vw] shrink-0 flex-col items-center justify-center gap-4 rounded-[1.75rem] border border-gold/40 bg-gradient-to-br from-[#F1EBE1] via-[#EDE6DA] to-[#E9E1D3] text-center shadow-[0_40px_80px_-40px_rgba(28,26,23,0.35)] sm:h-[58vh] sm:w-[36vw] lg:h-[62vh] lg:w-[22vw]"
          >
            <span className="font-display text-6xl font-light text-gold">✦</span>
            <p className="font-display text-3xl font-medium text-ink">View the Full Collection</p>
            <p className="text-xs tracking-[0.25em] text-ink/60 uppercase">
              Explore all styles
            </p>
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
