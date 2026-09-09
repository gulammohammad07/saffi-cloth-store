import type { Metadata } from "next";
import Link from "next/link";
import { Sparkles, Scissors, Layers, CheckCircle2, ArrowRight, Eye, Shield, Compass } from "lucide-react";

export const metadata: Metadata = {
  title: "Craftsmanship & Tailoring | Libaas Atelier",
  description:
    "Explore the slow-tailoring process, artisanal fabrics, and bespoke finishing details that make every Libaas garment exceptional.",
};

const stages = [
  {
    step: "01",
    title: "Fabric Curation & Pre-Shrinkage",
    desc: "Before a single blade touches cloth, our raw textiles undergo natural pre-washing and gentle air-drying to eliminate shrinkage and test colorfastness.",
    detail: "100% natural fibers — long-staple cotton, French linen, and mulberry silk.",
  },
  {
    step: "02",
    title: "Precision Pattern Drafting",
    desc: "Unlike mass factories that use generic automated lasers, our master pattern cutters draft contours shaped to natural human posture and freedom of movement.",
    detail: "Graded for relaxed drape, balanced armholes, and all-day comfort.",
  },
  {
    step: "03",
    title: "Enclosed French Seaming",
    desc: "We stitch every seam twice, completely enclosing raw edges inside clean fabric folds. The inside of your garment looks just as pristine as the exterior.",
    detail: "Zero itchy edges, no unraveling threads, durable for years of wear.",
  },
  {
    step: "04",
    title: "24-Point Master Inspection",
    desc: "Each finished garment is individually inspected for tension balance, button security, buttonhole alignment, and hand-pressed with heated brass irons.",
    detail: "Signed off by our master atelier supervisor before dispatch.",
  },
];

const textileClusters = [
  {
    region: "Varanasi, UP",
    fabric: "Heritage Banarasi Brocade & Katan Silk",
    desc: "Woven on traditional jacquard pit-looms with real zari and lightweight silk yarns, yielding rich luster without excessive stiffness.",
  },
  {
    region: "Chanderi, MP",
    fabric: "Featherweight Cotton-Silk Blends",
    desc: "Famous for sheer texture, gossamer drape, and subtle golden bootis, ideal for ethereal evening layers.",
  },
  {
    region: "Coimbatore & Salem",
    fabric: "High-Count Combed Pure Cottons",
    desc: "Extra-long staple yarn spun for crisp shirting, breathability in high humidity, and unmatched skin softness.",
  },
  {
    region: "European Flax",
    fabric: "100% Pure Natural Linen",
    desc: "Naturally thermoregulating, antimicrobial, and softening with every wash — perfect for year-round effortless tailoring.",
  },
];

const garmentAnatomy = [
  {
    icon: Scissors,
    title: "French Enclosed Seams",
    description: "Every internal seam is encased in clean fabric folds, eliminating irritation and preventing fraying forever.",
  },
  {
    icon: Sparkles,
    title: "Genuine Mother-of-Pearl Buttons",
    description: "Natural trochus shell buttons cut with iridescent depth, cross-stitched with reinforced shank necks.",
  },
  {
    icon: Shield,
    title: "Bar-Tacked Stress Anchors",
    description: "Pocket corners, side slits, and plackets feature microscopic high-density bar-tacks for structural integrity.",
  },
  {
    icon: Layers,
    title: "Lightweight Floating Interlinings",
    description: "Our collars and lapels use flexible canvas instead of stiff glue, creating a soft roll that never bubbles.",
  },
];

export default function CraftsmanshipPage() {
  return (
    <div className="min-h-screen bg-[#131110] text-[#FAF7F2]">
      {/* Background Glow */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden opacity-30">
        <div className="absolute top-20 right-1/4 h-[500px] w-[500px] rounded-full bg-[radial-gradient(circle,rgba(201,148,77,0.15),transparent_70%)] blur-3xl" />
        <div className="absolute bottom-40 left-10 h-[500px] w-[500px] rounded-full bg-[radial-gradient(circle,rgba(188,78,34,0.12),transparent_70%)] blur-3xl" />
      </div>

      {/* Hero */}
      <section className="relative px-6 pt-32 pb-20 text-center sm:pt-40 sm:pb-28">
        <div className="mx-auto max-w-4xl">
          <span className="inline-flex items-center gap-2 rounded-full border border-gold/30 bg-gold/10 px-4 py-1.5 text-xs font-semibold tracking-[0.24em] text-gold uppercase">
            <Compass className="h-3.5 w-3.5" /> The Atelier Standard
          </span>
          <h1 className="mt-8 font-display text-4xl font-normal tracking-wide text-cream sm:text-6xl sm:leading-[1.15]">
            The Art of <br />
            <span className="bg-gradient-to-r from-gold via-[#E8B775] to-gold-light bg-clip-text text-transparent italic">
              Slow Tailoring
            </span>
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-base leading-relaxed text-cream-dark/70 sm:text-lg">
            A garment should never be a compromise between beauty and endurance.
            Here is an intimate look into how our tailors cut, stitch, and finish every Libaas creation.
          </p>
        </div>
      </section>

      {/* 4 Steps */}
      <section className="relative border-t border-white/[0.06] bg-[#171514] px-6 py-24 sm:py-32">
        <div className="mx-auto max-w-7xl">
          <div className="text-center">
            <span className="text-xs font-semibold tracking-[0.24em] text-gold uppercase">The Method</span>
            <h2 className="mt-3 font-display text-3xl font-medium text-cream sm:text-4xl">
              From Raw Loom to Finished Garment
            </h2>
          </div>

          <div className="mt-16 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {stages.map((s) => (
              <div
                key={s.step}
                className="relative flex flex-col justify-between rounded-2xl border border-white/[0.08] bg-white/[0.02] p-8 transition-all duration-300 hover:border-gold/40 hover:bg-white/[0.04]"
              >
                <div>
                  <span className="font-display text-4xl font-bold text-gold/60">{s.step}</span>
                  <h3 className="mt-4 text-lg font-semibold text-cream">{s.title}</h3>
                  <p className="mt-3 text-sm leading-relaxed text-cream-dark/70">{s.desc}</p>
                </div>
                <div className="mt-6 rounded-xl border border-gold/20 bg-gold/[0.04] p-3 text-xs text-gold/90">
                  {s.detail}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Sourcing Map */}
      <section className="relative px-6 py-24 sm:py-32">
        <div className="mx-auto max-w-7xl">
          <div className="text-center">
            <span className="text-xs font-semibold tracking-[0.24em] text-gold uppercase">Textile Geography</span>
            <h2 className="mt-3 font-display text-3xl font-medium text-cream sm:text-4xl">
              Sourced Directly from Master Weaving Clusters
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-sm leading-relaxed text-cream-dark/70 sm:text-base">
              India&apos;s weaving traditions span millennia. We partner directly with family looms
              to preserve ancestral handloom techniques while adapting them for contemporary life.
            </p>
          </div>

          <div className="mt-16 grid gap-8 sm:grid-cols-2">
            {textileClusters.map((c) => (
              <div
                key={c.region}
                className="rounded-2xl border border-white/[0.08] bg-[#191716] p-8 transition-all hover:border-gold/30"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold tracking-wider text-gold uppercase">{c.region}</span>
                  <span className="h-2 w-2 rounded-full bg-gold" />
                </div>
                <h3 className="mt-3 text-xl font-semibold text-cream">{c.fabric}</h3>
                <p className="mt-3 text-sm leading-relaxed text-cream-dark/70">{c.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Anatomy Grid */}
      <section className="relative border-t border-white/[0.06] bg-[#161413] px-6 py-24 sm:py-32">
        <div className="mx-auto max-w-7xl">
          <div className="text-center">
            <span className="text-xs font-semibold tracking-[0.24em] text-gold uppercase">Micro-Details</span>
            <h2 className="mt-3 font-display text-3xl font-medium text-cream sm:text-4xl">
              Anatomy of a Libaas Garment
            </h2>
          </div>

          <div className="mt-16 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {garmentAnatomy.map((a) => (
              <div
                key={a.title}
                className="rounded-2xl border border-white/[0.06] bg-white/[0.02] p-8 hover:border-gold/30 transition-colors"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-gold/30 bg-gold/10 text-gold">
                  <a.icon className="h-6 w-6" />
                </div>
                <h3 className="mt-6 text-base font-semibold text-cream">{a.title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-cream-dark/60">{a.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="relative px-6 py-20 text-center">
        <div className="mx-auto max-w-4xl rounded-3xl border border-gold/30 bg-gradient-to-b from-white/[0.04] to-transparent p-12 sm:p-16">
          <h2 className="font-display text-3xl font-medium text-cream sm:text-4xl">
            Touch the Difference
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-sm leading-relaxed text-cream-dark/70 sm:text-base">
            Discover garments made with integrity, built for your real life.
          </p>
          <div className="mt-8 flex justify-center">
            <Link
              href="/shop"
              className="inline-flex items-center gap-2.5 rounded-full bg-gradient-to-r from-gold to-gold-light px-8 py-3.5 text-sm font-semibold tracking-wide text-ink transition-transform duration-300 hover:scale-105"
            >
              Shop Handcrafted Silhouettes <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
