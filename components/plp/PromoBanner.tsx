"use client";

import Image from "next/image";
import Link from "next/link";
import { m as motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import type { Product } from "@/lib/data/products";

export default function PromoBanner({ products }: { products: Product[] }) {
  const [first, second] = products;

  if (products.length === 0) return null;

  return (
    <section className="relative overflow-hidden bg-[#ECE5D8] py-24 sm:py-36">
      <div className="pointer-events-none absolute -left-40 top-1/4 h-[500px] w-[500px] bg-[radial-gradient(circle,rgba(188,78,34,0.1),transparent_70%)]" />
      <div className="pointer-events-none absolute -right-40 bottom-1/4 h-[400px] w-[400px] bg-[radial-gradient(circle,rgba(221,139,95,0.08),transparent_70%)]" />

      <span
        aria-hidden
        className="pointer-events-none absolute -top-10 right-4 hidden font-display text-9xl leading-none font-semibold text-ink/[0.04] sm:block"
      >
        02
      </span>

      <div className="relative mx-auto grid max-w-7xl items-center gap-16 px-6 lg:grid-cols-2">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        >
          <div className="flex items-center gap-5">
            <span className="h-px w-14 bg-gold" />
            <p className="text-xs font-semibold tracking-[0.34em] text-gold uppercase">
              The Edit · No. 04
            </p>
          </div>

          <h2 className="mt-8 font-display text-5xl font-medium leading-[0.96] tracking-tight text-ink sm:text-7xl">
            The{" "}
            <span className="gold-gradient-text animate-shine italic motion-reduce:animate-none">
              Oud
            </span>{" "}
            Edit
          </h2>

          <p className="mt-8 max-w-md text-base leading-[1.7] text-mute">
            Curated for the new season — premium fabrics,
            distilled into silhouettes for those who wear
            comfort with ease.
          </p>

          <Link
            href="/shop"
            className="group mt-11 inline-flex items-center gap-3.5 border-b border-[#E3DACB] pb-3 text-xs font-semibold tracking-[0.24em] text-ink/60 uppercase transition-all duration-700 hover:border-gold hover:text-gold"
          >
            Discover the Edit
            <ArrowUpRight
              size={15}
              className="transition-transform duration-500 group-hover:translate-x-1.5 group-hover:-translate-y-1.5"
            />
          </Link>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.94, y: 20 }}
          whileInView={{ opacity: 1, scale: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
          className="relative mx-auto h-[420px] w-full max-w-md sm:h-[540px]"
        >
          <div className="absolute left-[6%] top-[6%] h-[82%] w-[62%] -rotate-6 overflow-hidden rounded-[2.5rem] border border-[#E3DACB] bg-white shadow-[0_50px_100px_-30px_rgba(19,17,16,0.15)] backdrop-blur-xl">
            {second && (
              <div className="relative h-full w-full">
                <Image
                  src={second.image}
                  alt={second.name}
                  fill
                  sizes="(max-width: 1024px) 80vw, 400px"
                  className="object-contain p-10"
                />
                <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-white/90 to-transparent p-5 pt-16">
                  <p className="font-display text-base font-semibold text-ink">
                    {second.name}
                  </p>
                </div>
              </div>
            )}
          </div>

          <div className="absolute right-0 top-[16%] h-[78%] w-[58%] rotate-6 overflow-hidden rounded-[2.5rem] border border-gold/25 bg-white shadow-[0_60px_120px_-40px_rgba(188,78,34,0.3)]">
            {first && (
              <div className="relative h-full w-full">
                <Image
                  src={first.image}
                  alt={first.name}
                  fill
                  sizes="(max-width: 1024px) 80vw, 380px"
                  className="object-contain p-10"
                />
                <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-[#F4EFE6] to-transparent p-5 pt-16">
                  <p className="font-display text-base font-semibold text-ink">
                    {first.name}
                  </p>
                </div>
              </div>
            )}
          </div>

          <motion.div
            animate={{ y: [0, -12, 0] }}
            transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
            className="absolute left-0 top-[58%] rounded-2xl border border-gold/30 bg-white/90 px-6 py-5 shadow-2xl backdrop-blur-2xl"
          >
            <p className="font-display text-3xl font-semibold text-gold">
              12
            </p>
            <p className="mt-1 text-xs font-semibold tracking-[0.2em] text-mute uppercase">
              Pieces Per Drop
            </p>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
