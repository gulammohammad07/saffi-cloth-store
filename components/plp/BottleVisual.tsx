"use client";

import { m as motion } from "framer-motion";

export default function BottleVisual({ motionOk = true }: { motionOk?: boolean }) {
  return (
    <div
      aria-hidden
      className="relative flex h-full min-h-[440px] w-full items-center justify-center"
    >
      {/* Halo */}
      <div className="absolute left-1/2 top-1/2 h-[78%] w-[78%] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(circle,rgba(188,78,34,0.28),rgba(214,163,131,0.12)_45%,transparent_68%)]" />
      <div className="absolute left-1/2 top-1/2 h-[52%] w-[52%] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(circle,rgba(255,255,255,0.5),transparent_70%)]" />

      <motion.div
        animate={motionOk ? { y: [0, -16, 0] } : { y: 0 }}
        transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
        style={{ willChange: "transform" }}
        className="relative h-[420px] w-[200px] sm:h-[460px] sm:w-[220px]"
      >
        {/* Fluted gold stopper */}
        <div className="absolute left-1/2 top-0 h-14 w-16 -translate-x-1/2 rounded-t-full rounded-b-md bg-gradient-to-b from-[#e8d3a4] via-[#BC4E22] to-[#93371A] shadow-[0_0_30px_rgba(188,78,34,0.45)]" />
        <div className="absolute left-1/2 top-3 h-1 w-16 -translate-x-1/2 rounded-full bg-white/40 blur-[1px]" />
        <div className="absolute left-1/2 top-11 h-2 w-10 -translate-x-1/2 rounded-full bg-[#7A6239]" />

        {/* Gold collar */}
        <div className="absolute left-1/2 top-[58px] h-7 w-14 -translate-x-1/2 rounded-lg bg-gradient-to-b from-[#DBA381] to-[#BC4E22]" />
        <div className="absolute left-1/2 top-[58px] h-7 w-2.5 -translate-x-1/2 rounded-full bg-[#7A6239]" />

        {/* Glass body */}
        <div className="absolute left-1/2 top-[86px] h-[300px] w-[176px] -translate-x-1/2 overflow-hidden rounded-[2.8rem] rounded-b-[2.2rem] border border-white/40 bg-gradient-to-b from-white/25 via-white/[0.08] to-white/[0.04] shadow-[0_28px_80px_-24px_rgba(28,26,23,0.45),inset_0_1px_0_rgba(255,255,255,0.6)]">
          {/* Liquid */}
          <div className="absolute inset-x-2 top-14 bottom-2 rounded-[2.4rem] rounded-b-[2rem] bg-gradient-to-b from-[#D9B878] via-[#BC4E22] to-[#93371A] shadow-[inset_0_14px_28px_rgba(255,240,200,0.4),inset_0_-10px_20px_rgba(0,0,0,0.22)]" />
          {/* Liquid surface sheen */}
          <div className="absolute left-1/2 top-[52px] h-2 w-24 -translate-x-1/2 rounded-full bg-[#F3CDB4]/70 blur-[1px]" />

          {/* Reflections */}
          <div className="absolute inset-y-6 left-6 w-2 rounded-full bg-gradient-to-b from-white/70 via-white/25 to-transparent blur-[1px]" />
          <div className="absolute inset-y-12 left-10 w-1 rounded-full bg-white/30 blur-[1px]" />

          {/* Label */}
          <div className="absolute inset-x-5 bottom-10 rounded-md border border-gold/40 bg-[#F1EBE1]/90 py-3 text-center shadow-[0_4px_16px_rgba(0,0,0,0.12)]">
            <div className="mx-auto h-px w-8 bg-gold/60" />
            <p className="mt-1 font-display text-xl font-semibold tracking-[0.3em] text-ink">
              MD
            </p>
            <p className="mt-0.5 text-xs font-semibold tracking-[0.28em] text-gold uppercase">
              Libaas
            </p>
            <div className="mx-auto mt-1 h-px w-8 bg-gold/60" />
          </div>
        </div>

        {/* Base shadow */}
        <div className="absolute -bottom-12 left-1/2 h-8 w-52 -translate-x-1/2 rounded-full bg-black/25 blur-xl" />
      </motion.div>
    </div>
  );
}
