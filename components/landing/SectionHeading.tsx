"use client";

import { m as motion } from "framer-motion";
import { cn } from "@/lib/utils";

export default function SectionHeading({
  eyebrow,
  title,
  description,
  align = "center",
  dark = false,
}: {
  eyebrow: string;
  title: string;
  description?: string;
  align?: "center" | "left";
  dark?: boolean;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 35 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
      className={cn(
        "mb-16",
        align === "center" ? "text-center" : "text-left",
      )}
    >
      <div className={cn("flex items-center gap-5", align === "center" && "justify-center")}>
        <span className="h-px w-14 bg-gold/80" />
        <p className="text-xs font-semibold tracking-[0.32em] text-gold uppercase">
          {eyebrow}
        </p>
      </div>

      <h2
        className={cn(
          "mt-5 font-display text-3xl font-medium tracking-tight sm:text-5xl lg:text-6xl",
          dark ? "text-cream" : "text-ink",
        )}
      >
        {title}
      </h2>

      {description && (
        <p
          className={cn(
            "mx-auto mt-5 max-w-xl text-base leading-[1.7]",
            align === "center" && "mx-auto text-center",
            dark ? "text-cream-dark/60" : "text-ink/60",
          )}
        >
          {description}
        </p>
      )}
    </motion.div>
  );
}
