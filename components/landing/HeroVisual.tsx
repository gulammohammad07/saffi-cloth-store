"use client";

import { m as motion } from "framer-motion";

const sparkles = [
  { top: "16%", left: "16%", size: 5, delay: 0.4, duration: 6 },
  { top: "30%", left: "88%", size: 4, delay: 1.6, duration: 7 },
  { top: "64%", left: "10%", size: 4, delay: 0.9, duration: 5.5 },
  { top: "76%", left: "84%", size: 5, delay: 2.2, duration: 6.5 },
];

export default function HeroVisual({ motionOk = true }: { motionOk?: boolean }) {
  return (
    <div
      aria-hidden
      className="relative flex h-full min-h-[420px] w-full items-center justify-center"
    >
      <div className="absolute left-1/2 top-1/2 h-[72%] w-[72%] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(circle,rgba(188,78,34,0.22),transparent_62%)]" />

      {motionOk &&
        sparkles.map((s, i) => (
          <motion.span
            key={i}
            className="absolute rounded-full"
            style={{
              top: s.top,
              left: s.left,
              width: s.size,
              height: s.size,
              background:
                "radial-gradient(circle, rgba(221,139,95,0.95), rgba(221,139,95,0))",
              boxShadow: "0 0 12px 2px rgba(188,78,34,0.35)",
            }}
            animate={{ y: [0, -26, 0], opacity: [0.15, 0.85, 0.15], scale: [1, 1.15, 1] }}
            transition={{ duration: s.duration, delay: s.delay, repeat: Infinity, ease: "easeInOut" }}
          />
        ))}

      <motion.div
        animate={motionOk ? { y: [0, -14, 0] } : { y: 0 }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
        style={{ willChange: "transform" }}
        className="relative h-[380px] w-[170px] sm:h-[420px] sm:w-[185px]"
      >
        <div className="absolute left-1/2 top-0 h-16 w-14 -translate-x-1/2 rounded-t-[2rem] rounded-b-lg bg-gradient-to-b from-[#DCC49A] via-[#BC4E22] to-[#93371A] shadow-[0_0_30px_rgba(188,78,34,0.4)]" />
        <div className="absolute left-1/2 top-2 h-2 w-16 -translate-x-1/2 rounded-full bg-[#DCC49A]/70 blur-[1px]" />

        <div className="absolute left-1/2 top-[58px] h-8 w-12 -translate-x-1/2 rounded-md bg-gradient-to-b from-[#EFE9DE] to-[#BC4E22]/60" />

        <div className="absolute left-1/2 top-[90px] h-[250px] w-[140px] -translate-x-1/2 rounded-[2.6rem] rounded-b-[1.8rem] border border-white/25 bg-gradient-to-b from-white/15 via-white/[0.06] to-white/[0.02] shadow-[0_24px_70px_-20px_rgba(0,0,0,0.7)]">
          <div className="absolute -top-1 left-1/2 h-1.5 w-[72%] -translate-x-1/2 rounded-full bg-gradient-to-r from-transparent via-[#DCC49A] to-transparent" />

          <div className="absolute inset-x-4 bottom-4 top-20 rounded-b-[2rem] rounded-t-[5rem] bg-gradient-to-b from-[#D9B878] via-[#BC4E22] to-[#93371A]/85 shadow-[inset_0_12px_24px_rgba(255,240,200,0.35),inset_0_-8px_18px_rgba(0,0,0,0.25)]" />

          <div className="absolute inset-y-6 left-4 w-1.5 rounded-full bg-gradient-to-b from-white/50 via-white/20 to-transparent blur-[1px]" />
          <div className="absolute inset-y-10 left-7 w-0.5 rounded-full bg-white/20 blur-[1px]" />

          <div className="absolute left-6 right-6 top-[82px] h-1 rounded-full bg-[#F3CDB4]/50 blur-[1px]" />
        </div>

        <div className="absolute -bottom-10 left-1/2 h-7 w-44 -translate-x-1/2 rounded-full bg-black/55 blur-lg" />
      </motion.div>
    </div>
  );
}
