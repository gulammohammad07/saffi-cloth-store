"use client";

import Link from "next/link";
import { getImageProps } from "next/image";
import { ArrowRight } from "lucide-react";
import { useState } from "react";

type HeroBanner = {
  title: string | null;
  subtitle: string | null;
  description: string | null;
  desktopImageUrl: string;
  tabletImageUrl: string | null;
  mobileImageUrl: string | null;
};

export default function Hero({ banner }: { banner?: HeroBanner }) {
  const [imgError, setImgError] = useState(false);

  const fallbackImage =
    banner?.desktopImageUrl ??
    banner?.tabletImageUrl ??
    banner?.mobileImageUrl ??
    "";

  const showImage = Boolean(fallbackImage) && !imgError;

  /**
   * Art direction WITH optimisation. Each breakpoint gets its own uploaded
   * asset, but every variant is routed through Next's image optimiser
   * (AVIF/WebP + width variants) via getImageProps. Putting a raw <source>
   * next to a <next/image> instead makes the browser serve the unoptimised
   * original on mobile *and* discard the preloaded desktop file — two
   * downloads, neither of them fast.
   */
  const shared = {
    alt: banner?.title
      ? `${banner.title} — Libaas`
      : "Libaas clothing collection",
    sizes: "100vw",
    quality: 75,
    priority: true,
    // This image is the LCP candidate; make sure the browser starts it at
    // high priority even when the markup is parsed late in the body.
    loading: "eager" as const,
    fetchPriority: "high" as const,
  };

  const desktop = showImage
    ? getImageProps({ ...shared, src: fallbackImage, width: 1920, height: 1080 })
    : null;

  const tablet =
    showImage && banner?.tabletImageUrl
      ? getImageProps({
          ...shared,
          src: banner.tabletImageUrl,
          width: 1024,
          height: 1366,
        })
      : null;

  const mobile =
    showImage && banner?.mobileImageUrl
      ? getImageProps({
          ...shared,
          src: banner.mobileImageUrl,
          width: 828,
          height: 1472,
        })
      : null;

  // Mutually exclusive media queries, reused for both <source> and the
  // preload hints so the browser only ever fetches one hero image.
  const variants = [
    mobile ? { media: "(max-width: 767px)", srcSet: mobile.props.srcSet } : null,
    tablet
      ? {
          media: "(min-width: 768px) and (max-width: 1023px)",
          srcSet: tablet.props.srcSet,
        }
      : null,
  ].filter((v): v is { media: string; srcSet: string } => Boolean(v?.srcSet));

  const desktopMedia = tablet
    ? "(min-width: 1024px)"
    : mobile
      ? "(min-width: 768px)"
      : undefined;

  return (
    <section className="relative flex min-h-[100svh] items-center overflow-hidden bg-[#0D0B09]">
      {desktop ? (
        <>
          {variants.map((v) => (
            <link
              key={v.media}
              rel="preload"
              as="image"
              imageSrcSet={v.srcSet}
              imageSizes="100vw"
              media={v.media}
            />
          ))}
          {desktop.props.srcSet && (
            <link
              rel="preload"
              as="image"
              imageSrcSet={desktop.props.srcSet}
              imageSizes="100vw"
              media={desktopMedia}
            />
          )}

          <div className="absolute inset-0">
            <picture>
              {variants.map((v) => (
                <source
                  key={v.media}
                  media={v.media}
                  srcSet={v.srcSet}
                  sizes="100vw"
                />
              ))}
              {/* eslint-disable-next-line jsx-a11y/alt-text */}
              <img
                {...desktop.props}
                className="absolute inset-0 h-full w-full object-cover"
                onError={() => setImgError(true)}
              />
            </picture>

            {/* Scrim so the white headline stays legible over any banner the
                admin uploads, however light it happens to be. */}
            <div className="absolute inset-0 bg-gradient-to-t from-[#0D0B09]/90 via-[#0D0B09]/65 to-[#0D0B09]/45" />
          </div>
        </>
      ) : (
        <div className="absolute inset-0 bg-gradient-to-br from-[#0D0B09] via-[#181512] to-[#1C1A17]" />
      )}

      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-1/2 top-1/4 h-[600px] w-[600px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(circle,rgba(188,78,34,0.18),transparent_70%)]" />
        <div className="absolute left-1/4 bottom-1/4 h-[400px] w-[400px] rounded-full bg-[radial-gradient(circle,rgba(221,139,95,0.12),transparent_70%)]" />
      </div>

      <div className="relative z-10 mx-auto w-full max-w-7xl px-6 py-28 text-center lg:py-32">
        {/* CSS animation, not framer-motion, on purpose. The <h1> here is the
            LCP element on mobile; a JS-driven initial={{ opacity: 0 }} keeps it
            unpaintable until the motion bundle hydrates, which cost us over a
            second of LCP on a throttled connection. */}
        <div className="animate-rise-in">
          {(banner?.subtitle ?? "Modern Essentials — Est. 2025") && (
            <p className="text-xs font-semibold tracking-[0.22em] text-gold">
              {banner?.subtitle ?? "Modern Essentials — Est. 2025"}
            </p>
          )}

          {(banner?.title ?? "Wear Your Story") && (
            <h1 className="mt-8 font-display text-5xl font-medium leading-[0.98] tracking-tight text-white sm:text-7xl lg:text-9xl">
              {banner?.title ?? "Wear Your Story"}
            </h1>
          )}

          {(banner?.description ?? "Premium everyday wear for men, women and kids — cut in India, designed to last.") && (
            <p className="mx-auto mt-8 max-w-xl text-base leading-relaxed text-cream-dark sm:text-base">
              {banner?.description ?? "Premium everyday wear for men, women and kids — cut in India, designed to last."}
            </p>
          )}

          <div className="mt-12 flex flex-col items-center justify-center gap-5 sm:flex-row sm:gap-4">
            {/* /shop pulls a heavy route chunk — don't let the viewport
                prefetch it inside the LCP/load window. */}
            <Link
              href="/shop"
              prefetch={false}
              className="group relative inline-flex items-center gap-3 overflow-hidden rounded-full bg-gradient-to-r from-[#BC4E22] via-[#E09A72] to-[#BC4E22] px-10 py-4.5 text-sm font-semibold tracking-[0.15em] text-ink shadow-[0_0_60px_rgba(188,78,34,0.35)] transition-all duration-700 hover:shadow-[0_0_80px_rgba(188,78,34,0.5)] hover:scale-[1.04]"
            >
              <span className="relative z-10 flex items-center gap-2.5">
                Explore Collection
                <ArrowRight
                  size={16}
                  className="transition-transform duration-500 group-hover:translate-x-1.5"
                />
              </span>
              <span className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/40 to-transparent transition-transform duration-1000 group-hover:translate-x-full" />
            </Link>

            <Link
              href="/shop"
              prefetch={false}
              className="inline-flex min-h-12 items-center gap-2 rounded-full border border-ink/20 bg-white px-8 py-3.5 text-sm font-medium tracking-wide text-ink transition-colors duration-500 hover:border-gold/60 hover:text-charcoal"
            >
              View all clothing
            </Link>
          </div>
        </div>
      </div>

      {/* Mouse-shaped scroll hint — desktop only; it clutters small screens */}
      <div className="animate-fade-in-slow absolute bottom-10 left-1/2 hidden -translate-x-1/2 sm:block">
        <div className="flex h-10 w-6 items-start justify-center rounded-full border border-[#E3DACB]">
          <div className="animate-scroll-hint mt-2 h-2 w-1 rounded-full bg-gold" />
        </div>
      </div>
    </section>
  );
}
