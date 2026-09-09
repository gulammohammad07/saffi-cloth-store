import type { Metadata } from "next";
import Link from "next/link";
import { Sparkles, Leaf, Recycle, HeartHandshake, PackageCheck, ArrowRight, ShieldCheck } from "lucide-react";

export const metadata: Metadata = {
  title: "Sustainability & Ethics | Libaas Atelier",
  description:
    "Learn about Libaas's commitment to pure natural fibers, zero deadstock production, fair artisan wages, and 100% plastic-free packaging.",
};

const pillars = [
  {
    icon: Leaf,
    title: "100% Pure, Biodegradable Fibers",
    desc: "We completely reject virgin polyester, nylon, and synthetic fast-fashion blends. Our clothes are woven from flax linen, combed cotton, and mulberry silk — fibers that return safely to the earth.",
  },
  {
    icon: Recycle,
    title: "Zero Deadstock Guarantee",
    desc: "The world discards 92 million tons of clothes annually. We produce strictly in micro-batches of 25 to 50 pieces per style, cutting only what is loved and worn.",
  },
  {
    icon: HeartHandshake,
    title: "Living Wages & Artisan Dignity",
    desc: "Our master tailors and pattern cutters earn on average 45% above regional minimum wage standards, with comprehensive health insurance and safe atelier environments.",
  },
  {
    icon: PackageCheck,
    title: "100% Plastic-Free Packaging",
    desc: "Your order arrives in certified unbleached FSC-certified kraft paper cartons, plant-based cornstarch garment bags, and water-activated paper tape.",
  },
];

const metrics = [
  { value: "0%", label: "Virgin Polyester", sub: "Only natural, breathable fibers" },
  { value: "100%", label: "Plastic-Free Packaging", sub: "Recycled & home compostable" },
  { value: "45%+", label: "Above Living Wage", sub: "Fair compensation for all artisans" },
  { value: "5+ Yrs", label: "Designed Lifespan", sub: "Built to outlast fast fashion" },
];

export default function SustainabilityPage() {
  return (
    <div className="min-h-screen bg-[#131110] text-[#FAF7F2]">
      {/* Glow Ambience */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden opacity-30">
        <div className="absolute top-20 left-1/4 h-[500px] w-[500px] rounded-full bg-[radial-gradient(circle,rgba(34,197,94,0.12),transparent_70%)] blur-3xl" />
        <div className="absolute top-1/2 right-10 h-[500px] w-[500px] rounded-full bg-[radial-gradient(circle,rgba(201,148,77,0.12),transparent_70%)] blur-3xl" />
      </div>

      {/* Hero */}
      <section className="relative px-6 pt-32 pb-20 text-center sm:pt-40 sm:pb-28">
        <div className="mx-auto max-w-4xl">
          <span className="inline-flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-4 py-1.5 text-xs font-semibold tracking-[0.24em] text-emerald-400 uppercase">
            <Leaf className="h-3.5 w-3.5" /> Conscious Production
          </span>
          <h1 className="mt-8 font-display text-4xl font-normal tracking-wide text-cream sm:text-6xl sm:leading-[1.15]">
            Conscious Craft, <br />
            <span className="bg-gradient-to-r from-emerald-400 via-gold to-gold-light bg-clip-text text-transparent italic">
              Enduring
            </span>{" "}
            Style
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-base leading-relaxed text-cream-dark/70 sm:text-lg">
            We measure our environmental impact not in buzzwords, but in years of honest wear.
            Clothing made with reverence for the planet, the artisan, and the wearer.
          </p>
        </div>
      </section>

      {/* Stats Ribbon */}
      <section className="relative border-y border-white/[0.06] bg-[#171514] px-6 py-16">
        <div className="mx-auto max-w-7xl">
          <div className="grid grid-cols-2 gap-8 text-center lg:grid-cols-4">
            {metrics.map((m) => (
              <div key={m.label} className="p-4">
                <span className="font-display text-4xl font-bold tracking-tight text-gold sm:text-5xl">
                  {m.value}
                </span>
                <p className="mt-2 text-base font-medium text-cream">{m.label}</p>
                <p className="mt-1 text-xs text-cream-dark/50">{m.sub}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 4 Pillars */}
      <section className="relative px-6 py-24 sm:py-32">
        <div className="mx-auto max-w-7xl">
          <div className="text-center">
            <span className="text-xs font-semibold tracking-[0.24em] text-gold uppercase">Our Commitments</span>
            <h2 className="mt-3 font-display text-3xl font-medium text-cream sm:text-4xl">
              How We Honor the Planet & People
            </h2>
          </div>

          <div className="mt-16 grid gap-8 md:grid-cols-2">
            {pillars.map((p) => (
              <div
                key={p.title}
                className="flex flex-col justify-between rounded-2xl border border-white/[0.08] bg-[#181615] p-8 transition-all hover:border-emerald-500/30"
              >
                <div>
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-emerald-500/30 bg-emerald-500/10 text-emerald-400">
                    <p.icon className="h-6 w-6" />
                  </div>
                  <h3 className="mt-6 text-xl font-semibold text-cream">{p.title}</h3>
                  <p className="mt-3 text-sm leading-relaxed text-cream-dark/70">{p.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* The Mending Promise */}
      <section className="relative border-t border-white/[0.06] bg-[#161413] px-6 py-20">
        <div className="mx-auto max-w-5xl rounded-3xl border border-gold/30 bg-gradient-to-b from-white/[0.03] to-transparent p-10 sm:p-14">
          <div className="flex items-center gap-4 text-gold">
            <ShieldCheck className="h-8 w-8" />
            <h3 className="font-display text-2xl font-medium text-cream sm:text-3xl">
              Our Lifetime Mending Kit
            </h3>
          </div>
          <p className="mt-4 text-sm leading-relaxed text-cream-dark/70 sm:text-base">
            Every Libaas garment ships with a matching packet containing color-matched organic thread,
            extra shell buttons, and a swatched fabric patch. If you ever lose a button or need a repair guide,
            our atelier will gladly assist you free of charge.
          </p>
          <div className="mt-8 flex flex-wrap gap-4">
            <Link
              href="/shop"
              className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-gold to-gold-light px-7 py-3 text-xs font-semibold tracking-wider text-ink uppercase hover:shadow-[0_0_20px_rgba(201,148,77,0.4)] transition-all"
            >
              Shop Sustainable Staples <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
