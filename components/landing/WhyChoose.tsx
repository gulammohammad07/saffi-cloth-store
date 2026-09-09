"use client";

import { useEffect, useRef, useState } from "react";
import { m as motion, useInView, animate } from "framer-motion";
import {
  Gem,
  Leaf,
  FlaskConical,
  ShieldCheck,
  Truck,
  Award,
  type LucideIcon,
} from "lucide-react";
import SectionHeading from "@/components/landing/SectionHeading";

type Stat = {
  value: number;
  decimals?: number;
  suffix: string;
  label: string;
};

const stats: Stat[] = [
  { value: 10, suffix: "K+", label: "Happy Clients" },
  { value: 100, suffix: "+", label: "Curated Styles" },
  { value: 8, suffix: "+", label: "Years of Craft" },
  { value: 4.9, decimals: 1, suffix: "★", label: "Avg. Rating" },
];

type Pillar = {
  icon: LucideIcon;
  title: string;
  text: string;
};

const pillars: Pillar[] = [
  {
    icon: Gem,
    title: "Premium Fabrics",
    text: "Cotton, linen and blended weaves — sourced directly from trusted mills.",
  },
  {
    icon: FlaskConical,
    title: "Easy Care",
    text: "Machine-wash friendly fabrics that hold their shape and colour.",
  },
  {
    icon: Leaf,
    title: "Honest Craft",
    text: "Quality-checked piece by piece before it ever reaches your wardrobe.",
  },
  {
    icon: ShieldCheck,
    title: "Authenticity Guaranteed",
    text: "Every garment quality-checked at our studio before it ships.",
  },
  {
    icon: Truck,
    title: "Fast Nationwide Delivery",
    text: "Carefully packed and delivered to your door in 2–5 days.",
  },
  {
    icon: Award,
    title: "Loved by Our Customers",
    text: "A 4.9-star rating from thousands of shoppers across the country.",
  },
];

export default function WhyChoose() {
  return (
    <section className="relative overflow-hidden bg-[#F4EFE6] py-28">
      <div className="pointer-events-none absolute -left-32 top-24 h-[380px] w-[380px] bg-[radial-gradient(circle,rgba(188,78,34,0.14),transparent_70%)]" />
      <div className="pointer-events-none absolute -right-24 bottom-16 h-[340px] w-[340px] bg-[radial-gradient(circle,rgba(147,55,26,0.16),transparent_70%)]" />

      <div className="relative mx-auto max-w-7xl px-6">
        <SectionHeading
          eyebrow="The MD Difference"
          title="Why Choose Libaas"
          description="More than clothing — a promise of quality, fit and obsession with detail."
        />

        {/* Animated counters */}
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4 lg:gap-6">
          {stats.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.5, delay: i * 0.08 }}
              className="glass-luxury relative overflow-hidden rounded-3xl p-7 text-center"
            >
              <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-gold/50 to-transparent" />
              <Counter {...stat} />
              <p className="mt-2 text-xs font-semibold tracking-[0.2em] text-ink/60 uppercase">
                {stat.label}
              </p>
            </motion.div>
          ))}
        </div>

        {/* Pillars */}
        <div className="mt-14 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {pillars.map((pillar, i) => (
            <motion.div
              key={pillar.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.55, delay: (i % 3) * 0.1 }}
              className="group glass-luxury relative overflow-hidden rounded-3xl p-7 transition-all duration-500 hover:-translate-y-1.5 hover:shadow-[0_30px_60px_-15px_rgba(188,78,34,0.35)]"
            >
              <div className="pointer-events-none absolute -right-8 -top-8 h-24 w-24 rounded-full bg-gold/10 blur-2xl transition-all duration-500 group-hover:bg-gold/25" />

              <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-gold/30 bg-gradient-to-br from-gold/20 to-gold/5 text-gold transition-all duration-500 group-hover:scale-110 group-hover:shadow-[0_0_30px_rgba(188,78,34,0.35)]">
                <pillar.icon size={24} strokeWidth={1.6} />
              </div>

              <h3 className="mt-5 font-display text-xl font-semibold text-ink">
                {pillar.title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-ink/60">
                {pillar.text}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Counter({ value, decimals = 0, suffix }: Stat) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    if (!inView) return;
    const controls = animate(0, value, {
      duration: 2,
      ease: [0.22, 1, 0.36, 1],
      onUpdate: (v) => setDisplay(v),
    });
    return () => controls.stop();
  }, [inView, value]);

  const formatted =
    decimals > 0
      ? display.toFixed(decimals)
      : Math.round(display).toLocaleString("en-IN");

  return (
    <p className="gold-gradient-text font-display text-5xl font-semibold sm:text-6xl">
      <span ref={ref}>{formatted}</span>
      {suffix}
    </p>
  );
}
