"use client";

import Image from "next/image";
import { useRef, useState } from "react";
import { ZoomIn } from "lucide-react";
import type { Product } from "@/lib/data/products";
import ImageNavArrow from "@/components/product/ImageNavArrow";
import { cn } from "@/lib/utils";

export default function ProductViewer({ product }: { product: Product }) {
  const [active, setActive] = useState(0);
  const [showVideo, setShowVideo] = useState(false);
  const [zoomOrigin, setZoomOrigin] = useState<{ x: number; y: number } | null>(
    null,
  );
  const scrollerRef = useRef<HTMLDivElement>(null);
  const frameRef = useRef<HTMLDivElement>(null);

  // Where the pointer currently is, as a percentage of the frame. Written and
  // read only inside event handlers — never during render.
  const pointer = useRef({ x: 50, y: 50 });

  // Non-null means zoomed, and holds the transform-origin captured at the
  // moment of the click. Keeping it in state (rather than reading the ref at
  // render time) is what makes the zoom actually re-render at the right spot.
  const zoomed = zoomOrigin !== null;

  const images = product.gallery.length ? product.gallery : [product.image];
  const hasVideo = !!product.video;

  const scrollToImage = (index: number) => {
    const el = scrollerRef.current;
    if (!el) return;
    el.scrollTo({ left: index * el.clientWidth, behavior: "smooth" });
  };

  const selectImage = (index: number) => {
    setActive(index);
    setShowVideo(false);
    setZoomOrigin(null);
    pointer.current = { x: 50, y: 50 };
    scrollToImage(index);
  };

  const selectVideo = () => {
    setShowVideo(true);
    setZoomOrigin(null);
    scrollerRef.current?.scrollTo({ left: 0 });
  };

  // Keep the active index in sync when the user swipes or drag-scrolls.
  const syncActive = () => {
    const el = scrollerRef.current;
    if (!el || showVideo) return;
    const next = Math.min(
      images.length - 1,
      Math.max(0, Math.round(el.scrollLeft / el.clientWidth)),
    );
    if (next !== active) {
      setActive(next);
      setZoomOrigin(null);
    }
  };

  const handleMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (showVideo) return;
    const el = scrollerRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    if (rect.width === 0) return;
    pointer.current = {
      // Slides sit side by side inside the scroller, so the click position
      // inside the current slide is the viewport position plus the scroll
      // offset. Expressing it as a percentage keeps zoom origin stable no
      // matter which slide is on screen.
      x: ((e.clientX - rect.left + el.scrollLeft) / rect.width) * 100,
      y: ((e.clientY - rect.top) / rect.height) * 100,
    };
  };

  const toggleZoom = () => {
    setZoomOrigin((current) => (current ? null : { ...pointer.current }));
  };

  const reset = () => {
    pointer.current = { x: 50, y: 50 };
    setZoomOrigin(null);
  };

  return (
    <div className="grid gap-4 md:grid-cols-[80px_1fr]">
      {/* Thumbnails */}
      <div className="order-2 flex gap-3 overflow-x-auto pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden md:order-1 md:flex-col md:overflow-visible md:pb-0">            {images.map((image, index) => (
              <button
                key={index}
                type="button"
                onClick={() => selectImage(index)}
                className={cn(
                  "relative h-20 w-20 shrink-0 overflow-hidden rounded-xl border-2 bg-white transition-all",
                  active === index && !showVideo
                    ? "border-gold shadow-md"
                    : "border-transparent opacity-60 hover:opacity-100",
                )}
                aria-label={`View image ${index + 1}`}
              >
            <Image
              src={image}
              alt={`${product.name} view ${index + 1}`}
              fill
              sizes="80px"
              className="object-contain p-1.5"
            />
          </button>
        ))}
        {hasVideo && (
          <button
            type="button"
            onClick={selectVideo}
            className={cn(
              "relative h-20 w-20 shrink-0 overflow-hidden rounded-xl border-2 bg-white transition-all",
              showVideo
                ? "border-gold shadow-md"
                : "border-transparent opacity-60 hover:opacity-100",
            )}
            aria-label="Play video"
          >
            <div className="flex h-full w-full items-center justify-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
                className="h-6 w-6 text-ink"
              >
                <path
                  fillRule="evenodd"
                  d="M4.5 5.653c0-1.426 1.529-2.33 2.779-1.643l11.54 6.348c1.295.712 1.295 2.573 0 3.285L7.28 19.991c-1.25.687-2.779-.217-2.779-1.643V5.653z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
          </button>
        )}
      </div>

      {/* Main viewer — swipeable on touch, click-to-zoom on desktop */}
      <div
        ref={frameRef}
        onMouseMove={handleMove}
        onMouseLeave={reset}
        onClick={() => {
          if (hasVideo && showVideo) return;
          toggleZoom();
        }}
        className={cn(
          "group relative order-1 overflow-hidden rounded-3xl bg-[#EFE9DE] md:order-2",
          zoomed ? "cursor-zoom-out" : "cursor-zoom-in",
        )}
      >
        <div
          ref={scrollerRef}
          onScroll={syncActive}
          className="flex aspect-square w-full snap-x snap-mandatory overflow-x-auto overflow-y-hidden [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        >
          {showVideo && hasVideo ? (
            <div className="relative h-full w-full shrink-0 snap-start overflow-hidden">
              <video
                key={product.video}
                src={product.video}
                controls
                autoPlay
                className="absolute inset-0 h-full w-full object-contain"
              />
            </div>
          ) : (
            images.map((image, index) => (
              <div
                key={index}
                className="relative h-full w-full shrink-0 snap-start overflow-hidden"
              >
                <div
                  className={cn(
                    // The zoom transition belongs here, on the element that
                    // owns the scale and the transform-origin.
                    "absolute inset-0 transition-transform duration-700",
                    zoomed && active === index && "scale-125",
                  )}
                  style={
                    zoomed && active === index && zoomOrigin
                      ? {
                          transformOrigin: `${zoomOrigin.x}% ${zoomOrigin.y}%`,
                        }
                      : undefined
                  }
                >
                  <Image
                    src={image}
                    alt={product.name}
                    fill
                    priority={index === 0}
                    quality={75}
                    sizes="(max-width: 768px) 100vw, 50vw"
                    className="object-cover"
                  />
                </div>
              </div>
            ))
          )}
        </div>

        {!showVideo && images.length > 1 && (
          <>
            <ImageNavArrow
              direction="left"
              onClick={(e) => {
                e.stopPropagation();
                selectImage((active - 1 + images.length) % images.length);
              }}
              ariaLabel="Previous image"
              className="md:opacity-0 md:group-hover:opacity-100"
            />
            <ImageNavArrow
              direction="right"
              onClick={(e) => {
                e.stopPropagation();
                selectImage((active + 1) % images.length);
              }}
              ariaLabel="Next image"
              className="md:opacity-0 md:group-hover:opacity-100"
            />
          </>
        )}

        {/* Image counter (touch only — desktop has hover arrows) */}
        {!showVideo && images.length > 1 && (
          <div className="pointer-events-none absolute bottom-3 right-3 z-10 rounded-full bg-black/35 px-2.5 py-1 text-xs font-medium text-white md:hidden">
            {active + 1} / {images.length}
          </div>
        )}

        {/* Zoom hint */}
        {!showVideo && (
          <div className="pointer-events-none absolute right-4 top-4 flex h-10 w-10 items-center justify-center rounded-full bg-white/80 text-ink/60 opacity-0 shadow backdrop-blur transition-opacity group-hover:opacity-100">
            <ZoomIn size={18} />
          </div>
        )}

        {/* Floating shine */}
        {!showVideo && (
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-tr from-transparent via-white/20 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
        )}
      </div>
    </div>
  );
}
