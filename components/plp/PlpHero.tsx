"use client";

import Link from "next/link";
import {
  m as motion,
  useMotionValue,
  useScroll,
  useSpring,
  useTransform,
} from "framer-motion";
import { useRef } from "react";
import { ArrowRight, Sparkles } from "lucide-react";
import BottleVisual from "@/components/plp/BottleVisual";
import { useHoverCapable } from "@/lib/hooks/use-media-query";

const particles = [
  { top: "18%", left: "8%", size: 5, delay: 0, duration: 8 },
  { top: "30%", left: "16%", size: 3, delay: 1.6, duration: 9 },
  { top: "64%", left: "6%", size: 4, delay: 0.8, duration: 7 },
  { top: "76%", left: "14%", size: 3, delay: 2.2, duration: 8.5 },
  { top: "14%", left: "78%", size: 4, delay: 1.1, duration: 7.5 },
  { top: "26%", left: "90%", size: 5, delay: 2.6, duration: 9 },
  { top: "58%", left: "88%", size: 3, delay: 0.4, duration: 6.5 },
  { top: "70%", left: "94%", size: 4, delay: 1.9, duration: 8 },
  { top: "42%", left: "44%", size: 3, delay: 3.2, duration: 7 },
  { top: "82%", left: "52%", size: 4, delay: 0.6, duration: 9.5 },
  { top: "12%", left: "46%", size: 3, delay: 2.8, duration: 6 },
  { top: "50%", left: "96%", size: 3, delay: 1.3, duration: 7.8 },
];

const floatingChips = [
  { top: "15%", right: "6%", label: "New Drops", delay: 1 },
  { top: "58%", right: "0%", label: "Premium Fabrics", delay: 2 },
  { top: "70%", right: "30%", label: "Made in India", delay: 3 },
];

export default function PlpHero() {
  const ref = useRef<HTMLElement>(null);
  const motionOk = useHoverCapable();

  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const rotateX = useSpring(my, { stiffness: 110, damping: 20 });
  const rotateY = useSpring(mx, { stiffness: 110, damping: 20 });

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });
  const sceneY = useTransform(scrollYProgress, [0, 1], [0, 110]);
  const contentY = useTransform(scrollYProgress, [0, 1], [0, -80]);
  const fade = useTransform(scrollYProgress, [0, 0.7], [1, 0]);

  const handleMove = (e: React.MouseEvent<HTMLElement>) => {
    if (!motionOk) return;
    const { innerWidth, innerHeight } = window;
    mx.set((e.clientX / innerWidth - 0.5) * 10);
    my.set(-(e.clientY / innerHeight - 0.5) * 10);
  };

  return (
    <section
      ref={ref}
      onMouseMove={handleMove}
      className="relative flex min-h-[92svh] items-center overflow-hidden bg-[#EDE6DA]"
    >
      {/* Desert sky gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#EFE9DE] via-[#EDE6DA] to-[#D3E7F1]" />

      {/* Sun glow */}
      <div className="absolute left-1/2 top-[-18%] h-[70vmin] w-[70vmin] -translate-x-1/2 rounded-full bg-[radial-gradient(circle,rgba(221,139,95,0.5),rgba(221,139,95,0.12)_55%,transparent_72%)]" />
      <div className="absolute left-1/2 top-[-30%] h-[46vmin] w-[46vmin] -translate-x-1/2 rounded-full bg-[radial-gradient(circle,rgba(255,255,255,0.7),transparent_68%)]" />

      {/* Soft cinematic rays */}
      <div className="rays absolute -right-[18%] top-1/2 h-[150%] w-[70%] opacity-60 motion-reduce:animate-none" />

      {/* Desert dunes */}
      <div className="absolute inset-x-0 bottom-0 h-[38%] bg-[radial-gradient(ellipse_120%_100%_at_50%_100%,rgba(214,163,131,0.55),rgba(214,163,131,0)_62%)]" />
      <div className="absolute inset-x-[-10%] bottom-[-14%] h-[42%] rounded-[100%] bg-[#D6A383]/80 blur-xl" />
      <div className="absolute inset-x-[-6%] bottom-[-20%] h-[38%] rounded-[100%] bg-[#BC4E22]/70 blur-2xl" />

      {/* Floating particles */}
      {particles.map((p, i) => (
        <motion.span
          key={i}
          className="pointer-events-none absolute rounded-full"
          style={{
            top: p.top,
            left: p.left,
            width: p.size,
            height: p.size,
            background:
              "radial-gradient(circle, rgba(188,78,34,0.9), rgba(188,78,34,0))",
            boxShadow: "0 0 14px 2px rgba(188,78,34,0.28)",
          }}
          animate={motionOk ? { y: [0, -34, 0], opacity: [0.15, 0.8, 0.15], scale: [1, 1.12, 1] } : { y: 0, opacity: 0.5 }}
          transition={{ duration: p.duration, delay: p.delay, repeat: Infinity, ease: "easeInOut" }}
        />
      ))}

      {/* Bottom fade into cream */}
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-[#EDE6DA] to-transparent" />

      <div className="relative z-20 mx-auto grid w-full max-w-7xl items-center gap-6 px-6 pt-28 pb-24 lg:grid-cols-2 lg:gap-0 lg:pt-24 lg:pb-20">
        {/* Copy */}
        <motion.div
          style={{ y: contentY, opacity: fade }}
          className="text-center lg:text-left"
        >
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="inline-flex items-center gap-4"
          >
            <span className="hidden h-px w-12 bg-gradient-to-r from-transparent to-gold sm:block" />
            <span className="text-xs font-semibold tracking-[0.42em] text-gold uppercase">
              Premium
            </span>
            <span className="hidden h-px w-12 bg-gradient-to-l from-transparent to-gold sm:block" />
          </motion.div>

          <h1
            className="mt-6 font-display text-5xl font-medium leading-[1.02] text-ink sm:text-7xl lg:text-7xl"
          >
            The New
            <br />
            <span className="gold-gradient-text animate-shine italic motion-reduce:animate-none">
              Season
            </span>
          </h1>

          <motion.p
            initial={{ opacity: 0, y: 28 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.85, delay: 0.4 }}
            className="mx-auto mt-7 flex items-center justify-center gap-3 text-sm font-light tracking-[0.28em] text-ink/60 uppercase lg:mx-0 lg:justify-start"
          >
            <span>Pure</span>
            <span className="text-gold">•</span>
            <span>Luxury</span>
            <span className="text-gold">•</span>
            <span>Timeless</span>
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 28 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.85, delay: 0.55 }}
            className="mt-12 flex justify-center lg:justify-start"
          >
            <Link
              href="/shop"
              className="group relative inline-flex items-center gap-3 overflow-hidden rounded-full border border-gold/70 bg-white/60 px-9 py-4 text-sm font-semibold tracking-wide text-ink shadow-[0_12px_40px_-14px_rgba(188,78,34,0.6)] backdrop-blur-md transition-all duration-300 hover:scale-[1.03] hover:bg-gradient-to-r hover:from-[#BC4E22] hover:via-gold hover:to-[#DD8B5F] hover:text-white hover:shadow-[0_16px_50px_-10px_rgba(188,78,34,0.8)]"
            >
              <span className="relative z-10 flex items-center gap-2.5">
                Explore the Collection
                <ArrowRight
                  size={16}
                  className="transition-transform duration-300 group-hover:translate-x-1"
                />
              </span>
              <span className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/35 to-transparent transition-transform duration-700 group-hover:translate-x-full" />
            </Link>
          </motion.div>
        </motion.div>

        {/* Visual */}
        <motion.div
          style={{
            y: sceneY,
            rotateX: motionOk ? rotateX : 0,
            rotateY: motionOk ? rotateY : 0,
            transformStyle: "preserve-3d",
          }}
          className="relative mx-auto w-full max-w-md"
        >
          <BottleVisual motionOk={motionOk} />

          {floatingChips.map((chip) => (
            <motion.span
              key={chip.label}
              animate={motionOk ? { y: [0, -16, 0], opacity: [0.5, 1, 0.5] } : { y: 0, opacity: 1 }}
              transition={{ duration: 5.5, repeat: Infinity, delay: chip.delay }}
              style={{ top: chip.top, right: chip.right }}
              className="absolute flex items-center gap-2 rounded-full border border-gold/40 bg-white/75 px-5 py-2 text-xs font-medium tracking-[0.22em] text-ink/60 uppercase shadow-lg backdrop-blur-md"
            >
              <Sparkles size={12} className="text-gold" />
              {chip.label}
            </motion.span>
          ))}

          {/* Scroll hint */}
          <motion.div
            animate={motionOk ? { y: [0, 8, 0] } : { y: 0 }}
            transition={{ duration: 1.8, repeat: Infinity }}
            className="absolute -bottom-16 left-1/2 flex h-10 w-6 -translate-x-1/2 items-start justify-center rounded-full border border-gold/50 p-1.5"
          >
            <div className="h-2 w-1 rounded-full bg-gold" />
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
