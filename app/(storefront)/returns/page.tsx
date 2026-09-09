import type { Metadata } from "next";
import Link from "next/link";
import { RotateCcw, CheckCircle2, XCircle, ArrowRight, ShieldCheck, Clock, HelpCircle } from "lucide-react";

export const metadata: Metadata = {
  title: "Returns & Exchanges | Libaas Atelier",
  description:
    "Review Libaas's 7-day hassle-free doorstep returns, exchanges, and refund guidelines.",
};

const returnSteps = [
  {
    step: "01",
    title: "Initiate Request",
    desc: "Log into your account and select 'Return / Exchange' next to your order, or message our WhatsApp concierge with your Order ID.",
  },
  {
    step: "02",
    title: "Complimentary Pickup",
    desc: "Our courier arrives at your doorstep within 24-48 hours to collect the securely packaged garment. No printing of shipping labels required.",
  },
  {
    step: "03",
    title: "Swift Exchange or Refund",
    desc: "For size exchanges, the replacement is dispatched immediately upon pickup scan. Refunds reflect in your source account within 2-4 business days.",
  },
];

const checklistAccept = [
  "Garment is unwashed, unworn, and free of perfume or makeup marks",
  "Original Libaas tags and fabric identification labels are intact",
  "Returned in original packaging with provided mending kit",
  "Requested within 7 calendar days of doorstep delivery",
];

const checklistDecline = [
  "Custom tailored or altered garments created to bespoke measurements",
  "Items returned after the 7-day trial window",
  "Garments showing visible wear, washing, or fabric distortion",
];

export default function ReturnsPage() {
  return (
    <div className="min-h-screen bg-[#131110] text-[#FAF7F2]">
      {/* Ambience */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden opacity-30">
        <div className="absolute top-20 right-1/4 h-[500px] w-[500px] rounded-full bg-[radial-gradient(circle,rgba(201,148,77,0.15),transparent_70%)] blur-3xl" />
      </div>

      {/* Hero */}
      <section className="relative px-6 pt-32 pb-20 text-center sm:pt-40 sm:pb-24">
        <div className="mx-auto max-w-4xl">
          <span className="inline-flex items-center gap-2 rounded-full border border-gold/30 bg-gold/10 px-4 py-1.5 text-xs font-semibold tracking-[0.24em] text-gold uppercase">
            <RotateCcw className="h-3.5 w-3.5" /> 7-Day Guarantee
          </span>
          <h1 className="mt-8 font-display text-4xl font-normal tracking-wide text-cream sm:text-6xl">
            Returns & <span className="bg-gradient-to-r from-gold via-[#E8B775] to-gold-light bg-clip-text text-transparent italic">Exchanges</span>
          </h1>
          <p className="mx-auto mt-4 max-w-xl text-base leading-relaxed text-cream-dark/70">
            We want you to feel confident and completely at ease in your Libaas garments.
            Enjoy simple, doorstep returns and size exchanges with zero friction.
          </p>

          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <Link
              href="/account/orders"
              className="inline-flex items-center gap-2.5 rounded-full bg-gradient-to-r from-gold to-gold-light px-8 py-3.5 text-xs font-semibold tracking-wider text-ink uppercase hover:shadow-[0_0_20px_rgba(201,148,77,0.4)] transition-all"
            >
              Initiate Return from Orders <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              href="/contact"
              className="inline-flex items-center gap-2.5 rounded-full border border-white/20 bg-white/5 px-8 py-3.5 text-xs font-semibold tracking-wider text-cream hover:border-gold hover:text-gold transition-colors"
            >
              Contact Concierge
            </Link>
          </div>
        </div>
      </section>

      {/* 3 Step Visual */}
      <section className="relative border-t border-white/[0.06] bg-[#161413] px-6 py-20">
        <div className="mx-auto max-w-6xl">
          <div className="text-center">
            <span className="text-xs font-semibold tracking-[0.24em] text-gold uppercase">The Process</span>
            <h2 className="mt-2 font-display text-3xl font-medium text-cream">
              3 Simple Steps to Return or Exchange
            </h2>
          </div>

          <div className="mt-14 grid gap-8 md:grid-cols-3">
            {returnSteps.map((item) => (
              <div
                key={item.step}
                className="relative rounded-2xl border border-white/[0.08] bg-[#1a1716] p-8 hover:border-gold/30 transition-colors"
              >
                <span className="font-display text-4xl font-bold text-gold/40">{item.step}</span>
                <h3 className="mt-4 text-xl font-semibold text-cream">{item.title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-cream-dark/70">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Checklist */}
      <section className="relative px-6 py-24">
        <div className="mx-auto max-w-6xl">
          <div className="text-center">
            <span className="text-xs font-semibold tracking-[0.24em] text-gold uppercase">Policy Guidelines</span>
            <h2 className="mt-2 font-display text-3xl font-medium text-cream">
              Eligibility & Guidelines
            </h2>
          </div>

          <div className="mt-14 grid gap-8 md:grid-cols-2">
            {/* Accepted */}
            <div className="rounded-2xl border border-emerald-500/30 bg-emerald-500/[0.03] p-8">
              <div className="flex items-center gap-3 text-emerald-400">
                <CheckCircle2 className="h-6 w-6" />
                <h3 className="text-lg font-semibold">Eligible for Full Return or Size Swap</h3>
              </div>
              <ul className="mt-6 space-y-3.5 text-sm text-cream-dark/80">
                {checklistAccept.map((item) => (
                  <li key={item} className="flex items-start gap-3">
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 mt-2 shrink-0" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Ineligible */}
            <div className="rounded-2xl border border-rose-500/30 bg-rose-500/[0.03] p-8">
              <div className="flex items-center gap-3 text-rose-400">
                <XCircle className="h-6 w-6" />
                <h3 className="text-lg font-semibold">Non-Returnable Items</h3>
              </div>
              <ul className="mt-6 space-y-3.5 text-sm text-cream-dark/80">
                {checklistDecline.map((item) => (
                  <li key={item} className="flex items-start gap-3">
                    <span className="h-1.5 w-1.5 rounded-full bg-rose-400 mt-2 shrink-0" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Refund Speed */}
      <section className="relative border-t border-white/[0.06] bg-[#161413] px-6 py-16 text-center">
        <div className="mx-auto max-w-3xl">
          <div className="inline-flex h-12 w-12 items-center justify-center rounded-full border border-gold/30 bg-gold/10 text-gold">
            <Clock className="h-6 w-6" />
          </div>
          <h3 className="mt-4 font-display text-2xl font-medium text-cream">
            Refunds to Original Payment Method
          </h3>
          <p className="mt-3 text-sm leading-relaxed text-cream-dark/70">
            For prepaid orders via UPI, cards, or net banking, refunds are credited directly back to the original source account within 24 to 48 hours of inspection. For Cash on Delivery (COD) orders, a secure bank transfer or UPI transfer link is issued instantly upon pickup.
          </p>
        </div>
      </section>
    </div>
  );
}
