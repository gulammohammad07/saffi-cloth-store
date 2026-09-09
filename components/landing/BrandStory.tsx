"use client";

import { getImageProps } from "next/image";
import { m as motion, useScroll, useTransform } from "framer-motion";
import { useRef, useState } from "react";
import { Sparkles, Droplets, Clock, ChevronRight } from "lucide-react";
import type { StorefrontBanner } from "@/lib/services/storefront-data";

const pillars = [
  {
    icon: Sparkles,
    title: "Premium Fabrics",
    text: "Handpicked cottons, linens and silks from trusted mills across India.",
  },
  {
    icon: Droplets,
    title: "Precision Fit",
    text: "True-to-size cuts, designed on real bodies — not just hangers.",
  },
  {
    icon: Clock,
    title: "Finished to Last",
    text: "Careful stitching and quality trims that survive season after season.",
  },
];

const milestones = [
  {
    year: "2021",
    title: "A Single Sewing Table",
    text: "Libaas begins with one master tailor and a sewing table in Mumbai.",
  },
  {
    year: "2023",
    title: "The First Studio",
    text: "Our atelier opens, and the first small-batch collections find their homes.",
  },
  {
    year: "2024",
    title: "100+ Curated Styles",
    text: "Linen, denim and silk join a growing, hand-curated wardrobe.",
  },
  {
    year: "Today",
    title: "Loved Across India",
    text: "10,000+ customers across the country wear Libaas every day.",
  },
];

export default function BrandStory({
  banner,
}: {
  banner?: StorefrontBanner | null;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const imageY = useTransform(scrollYProgress, [0, 1], [40, -40]);

  const fallbackImage =
    banner?.desktopImageUrl ??
    banner?.tabletImageUrl ??
    banner?.mobileImageUrl ??
    null;

  const [imgError, setImgError] = useState(false);
  const showImage = !!fallbackImage && !imgError;

  // Same art-direction-with-optimisation approach as the hero: a raw <source>
  // beside a <next/image> bypasses the optimiser entirely on small screens.
  const storyShared = {
    alt: banner?.title ?? "the craft of fine clothing",
    sizes: "(max-width: 1024px) 100vw, 50vw",
    quality: 75,
  };

  const storyDesktop = showImage
    ? getImageProps({ ...storyShared, src: fallbackImage, width: 1200, height: 1500 })
    : null;

  const storyVariants = showImage
    ? [
        banner?.mobileImageUrl
          ? {
              media: "(max-width: 767px)",
              srcSet: getImageProps({
                ...storyShared,
                src: banner.mobileImageUrl,
                width: 828,
                height: 1035,
              }).props.srcSet,
            }
          : null,
        banner?.tabletImageUrl
          ? {
              media: "(min-width: 768px) and (max-width: 1023px)",
              srcSet: getImageProps({
                ...storyShared,
                src: banner.tabletImageUrl,
                width: 1024,
                height: 1280,
              }).props.srcSet,
            }
          : null,
      ].filter((v): v is { media: string; srcSet: string } => Boolean(v?.srcSet))
    : [];

  return (
    <section id="story" className="overflow-hidden bg-[#F4EFE6] py-28 text-ink">
      <div className="mx-auto max-w-7xl px-6">
        <div
          className={`grid items-center gap-16 ${
            showImage
              ? "lg:grid-cols-2"
              : "lg:grid-cols-1 lg:mx-auto lg:max-w-3xl"
          }`}
        >
          {/* Visual */}
          {showImage && (
            <motion.div
              initial={{ opacity: 0, x: -40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.7 }}
              className="relative order-2 lg:order-1"
            >
              <motion.div
                style={{ y: imageY }}
                className="relative aspect-[4/5] overflow-hidden rounded-[2rem] border border-gold/25 shadow-[0_40px_80px_-40px_rgba(28,26,23,0.45)]"
              >
                <picture>
                  {storyVariants.map((v) => (
                    <source
                      key={v.media}
                      media={v.media}
                      srcSet={v.srcSet}
                      sizes={storyShared.sizes}
                    />
                  ))}
                  {storyDesktop && (
                    /* eslint-disable-next-line @next/next/no-img-element, jsx-a11y/alt-text */
                    <img
                      {...storyDesktop.props}
                      className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 hover:scale-105"
                      onError={() => setImgError(true)}
                    />
                  )}
                </picture>
                <div className="absolute inset-0 bg-gradient-to-t from-[#F4EFE6]/35 to-transparent" />
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.3 }}
                className="absolute -bottom-6 -right-6 hidden rounded-2xl border border-gold/40 bg-white/80 p-6 shadow-[0_0_50px_rgba(188,78,34,0.25)] backdrop-blur-md sm:block"
              >
                <p className="gold-gradient-text font-display text-3xl font-semibold">
                  8+ Yrs
                </p>
                <p className="mt-1 text-xs tracking-[0.2em] text-ink/60 uppercase">
                  of Craft
                </p>
              </motion.div>
            </motion.div>
          )}

          {/* Copy */}
          <div className="order-1 lg:order-2">
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="text-xs font-semibold tracking-[0.3em] text-gold uppercase"
            >
              Our Story
            </motion.p>

            <motion.h2
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="mt-4 font-display text-3xl font-medium sm:text-5xl"
            >
              Clothing, the way
              <span className="gold-gradient-text italic">
                {" "}
                it was meant to be
              </span>
            </motion.h2>

            <motion.p
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="mt-6 text-sm leading-relaxed text-ink/60"
            >
              Born from a love of well-made clothing, Libaas began with a
              single sewing table and a belief: that style should be honest,
              comfortable and personal. No shortcuts — just premium fabrics,
              cut with care and finished by hand.
            </motion.p>

            <div className="mt-10 space-y-6">
              {pillars.map((pillar, index) => (
                <motion.div
                  key={pillar.title}
                  initial={{ opacity: 0, x: 30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: 0.2 + index * 0.1 }}
                  className="group flex gap-4 rounded-2xl border border-gold/20 bg-white/60 p-4 shadow-[0_10px_30px_-18px_rgba(28,26,23,0.2)] transition-colors duration-500 hover:border-gold/40 hover:bg-white/80"
                >
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border border-gold/30 bg-gold/10">
                    <pillar.icon size={20} className="text-gold" />
                  </div>
                  <div>
                    <h3 className="font-display text-base font-medium text-ink">
                      {pillar.title}
                    </h3>
                    <p className="mt-1 text-sm text-ink/60">
                      {pillar.text}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>

        {/* Timeline */}
        <div ref={ref} className="mt-28 grid gap-10 lg:grid-cols-4 lg:gap-6">
          {milestones.map((milestone, index) => (
            <motion.div
              key={milestone.year}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.6, delay: index * 0.12 }}
              className="relative"
            >
              {index < milestones.length - 1 && (
                <div className="absolute left-[5px] top-7 hidden h-full w-px bg-gradient-to-b from-gold/50 to-gold/10 lg:block" />
              )}
              <div className="absolute left-0 top-1.5 hidden h-[11px] w-[11px] rounded-full border-2 border-gold bg-[#F4EFE6] lg:block" />
              <div className="lg:pl-8">
                <p className="gold-gradient-text font-display text-3xl font-semibold">
                  {milestone.year}
                </p>
                <h3 className="mt-3 font-display text-base font-medium text-ink">
                  {milestone.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-ink/60">
                  {milestone.text}
                </p>
                <ChevronRight size={14} className="mt-3 hidden text-gold/60 lg:block" />
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
