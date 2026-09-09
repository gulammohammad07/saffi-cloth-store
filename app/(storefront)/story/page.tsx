import type { Metadata } from "next";
import Link from "next/link";
import { Sparkles, ShieldCheck, Heart, Award, ArrowRight, Scissors } from "lucide-react";

export const metadata: Metadata = {
  title: "Our Story | Libaas Atelier",
  description:
    "Discover the heritage, master artisans, and philosophy behind Libaas — a modern house of thoughtfully crafted clothing.",
};

const milestones = [
  {
    year: "2021",
    title: "A Single Sewing Table",
    description:
      "Libaas began with two master tailors, one vintage Singer machine, and an unwavering vow: clothing should be made to outlast fast-fashion trends.",
  },
  {
    year: "2023",
    title: "The Mumbai Atelier",
    description:
      "Our dedicated studio opened in Mumbai, welcoming patrons seeking bespoke fits, natural handlooms, and timeless silhouettes.",
  },
  {
    year: "2024",
    title: "100+ Hand-Curated Silhouettes",
    description:
      "We expanded our repertoire to include pure Belgian linens, hand-spun cottons, and heirloom Banarasi brocades for modern living.",
  },
  {
    year: "Today",
    title: "Loved by Over 25,000 Patrons",
    description:
      "From bespoke occasion wear to daily luxury staples, every Libaas garment carries the touch of true artisan devotion.",
  },
];

const values = [
  {
    icon: Scissors,
    title: "Artisanal Precision",
    description:
      "Every hem, seam, and stitch is cut by experienced tailors who understand how natural fabrics drape and breathe on real human forms.",
  },
  {
    icon: Heart,
    title: "Conscious Materials",
    description:
      "We source directly from heritage weaving clusters across India. Zero microplastics, breathable weaves, and skin-friendly natural dyes.",
  },
  {
    icon: ShieldCheck,
    title: "Finished to Endure",
    description:
      "Reinforced stress points, French enclosed seams, and genuine shell buttons ensure your garment looks immaculate wash after wash.",
  },
  {
    icon: Award,
    title: "Honest Pricing",
    description:
      "By working directly with master weavers and our internal atelier, we deliver genuine haute craftsmanship without luxury markups.",
  },
];

export default function StoryPage() {
  return (
    <div className="min-h-screen bg-[#131110] text-[#FAF7F2]">
      {/* Background Ambience */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden opacity-30">
        <div className="absolute -top-40 left-1/2 h-[600px] w-[600px] -translate-x-1/2 rounded-full bg-[radial-gradient(circle,rgba(188,78,34,0.18),transparent_70%)] blur-3xl" />
        <div className="absolute top-1/2 -right-40 h-[500px] w-[500px] rounded-full bg-[radial-gradient(circle,rgba(201,148,77,0.12),transparent_70%)] blur-3xl" />
      </div>

      {/* Hero Section */}
      <section className="relative px-6 pt-32 pb-20 text-center sm:pt-40 sm:pb-28">
        <div className="mx-auto max-w-4xl">
          <span className="inline-flex items-center gap-2 rounded-full border border-gold/30 bg-gold/10 px-4 py-1.5 text-xs font-semibold tracking-[0.24em] text-gold uppercase">
            <Sparkles className="h-3.5 w-3.5" /> Our Heritage & Ethos
          </span>
          <h1 className="mt-8 font-display text-4xl font-normal tracking-wide text-cream sm:text-6xl sm:leading-[1.15]">
            A Modern House of <br />
            <span className="bg-gradient-to-r from-gold via-[#E8B775] to-gold-light bg-clip-text text-transparent italic">
              Thoughtfully Made
            </span>{" "}
            Clothing
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-base leading-relaxed text-cream-dark/70 sm:text-lg">
            We reject the frantic pace of disposable fashion. Libaas was founded on
            the quiet conviction that clothing should feel effortless, elevate everyday life,
            and carry the soul of the craftspeople who shaped it.
          </p>
        </div>
      </section>

      {/* Philosophy Statement */}
      <section className="relative border-y border-white/[0.06] bg-[#181514] px-6 py-20">
        <div className="mx-auto grid max-w-6xl gap-12 lg:grid-cols-12 lg:items-center">
          <div className="lg:col-span-5">
            <p className="text-xs font-semibold tracking-[0.2em] text-gold uppercase">The Libaas Philosophy</p>
            <h2 className="mt-3 font-display text-3xl font-medium tracking-tight text-cream sm:text-4xl">
              &ldquo;True elegance is quiet, comfortable, and never rushed.&rdquo;
            </h2>
            <div className="mt-6 h-0.5 w-16 bg-gradient-to-r from-gold to-transparent" />
          </div>
          <div className="space-y-6 text-sm leading-relaxed text-cream-dark/70 sm:text-base lg:col-span-7">
            <p>
              In an era dominated by synthetic blends and mass production, we returned
              to the roots of bespoke garment making. Every garment in our collection starts
              not with a computer algorithm, but with a dialogue between raw fiber, master weaver,
              and tailor.
            </p>
            <p>
              Whether it is our signature breathable daily linen shirts, festive raw silk kurtas,
              or fluid modern dresses, each piece is engineered with meticulous ease. We design
              for life as it is lived — dinner with family, busy commutes, festive celebrations,
              and quiet Sunday mornings.
            </p>
          </div>
        </div>
      </section>

      {/* Values Grid */}
      <section className="relative px-6 py-24 sm:py-32">
        <div className="mx-auto max-w-7xl">
          <div className="text-center">
            <span className="text-xs font-semibold tracking-[0.24em] text-gold uppercase">The Pillars</span>
            <h2 className="mt-3 font-display text-3xl font-medium text-cream sm:text-4xl">
              What Sets Our Garments Apart
            </h2>
          </div>

          <div className="mt-16 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {values.map((v) => (
              <div
                key={v.title}
                className="group relative rounded-2xl border border-white/[0.08] bg-white/[0.02] p-8 transition-all duration-500 hover:border-gold/40 hover:bg-white/[0.04] hover:-translate-y-1"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-gold/30 bg-gold/10 text-gold transition-colors duration-300 group-hover:bg-gold group-hover:text-ink">
                  <v.icon className="h-6 w-6" />
                </div>
                <h3 className="mt-6 text-lg font-semibold text-cream">{v.title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-cream-dark/60">{v.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Timeline Section */}
      <section className="relative border-t border-white/[0.06] bg-[#161413] px-6 py-24 sm:py-32">
        <div className="mx-auto max-w-5xl">
          <div className="text-center">
            <span className="text-xs font-semibold tracking-[0.24em] text-gold uppercase">Our Evolution</span>
            <h2 className="mt-3 font-display text-3xl font-medium text-cream sm:text-4xl">
              Milestones of the Atelier
            </h2>
          </div>

          <div className="mt-16 space-y-10">
            {milestones.map((m) => (
              <div
                key={m.year}
                className="relative grid gap-6 rounded-2xl border border-white/[0.06] bg-white/[0.02] p-8 sm:grid-cols-12 sm:items-center sm:gap-10 hover:border-gold/30 transition-colors"
              >
                <div className="sm:col-span-3">
                  <span className="font-display text-3xl font-bold tracking-tight text-gold sm:text-4xl">
                    {m.year}
                  </span>
                </div>
                <div className="sm:col-span-9">
                  <h3 className="text-xl font-semibold text-cream">{m.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-cream-dark/70">{m.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Banner */}
      <section className="relative px-6 py-20 text-center">
        <div className="mx-auto max-w-4xl rounded-3xl border border-gold/30 bg-gradient-to-b from-white/[0.04] to-transparent p-12 sm:p-16">
          <h2 className="font-display text-3xl font-medium text-cream sm:text-4xl">
            Experience the Libaas Standard
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-sm leading-relaxed text-cream-dark/70 sm:text-base">
            Explore our curated collections of everyday and occasion wear, crafted with
            uncompromising attention to detail.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <Link
              href="/shop"
              className="inline-flex items-center gap-2.5 rounded-full bg-gradient-to-r from-gold to-gold-light px-8 py-3.5 text-sm font-semibold tracking-wide text-ink transition-transform duration-300 hover:scale-105 hover:shadow-[0_0_25px_rgba(188,78,34,0.4)]"
            >
              Explore Collection <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              href="/craftsmanship"
              className="inline-flex items-center gap-2.5 rounded-full border border-white/20 bg-white/5 px-8 py-3.5 text-sm font-semibold tracking-wide text-cream transition-colors hover:border-gold hover:text-gold"
            >
              Our Craftsmanship
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
