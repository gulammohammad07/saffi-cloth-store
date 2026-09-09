import type { Metadata } from "next";
import Link from "next/link";
import { Truck, ShieldCheck, MapPin, Clock, ArrowRight, Package, CheckCircle2 } from "lucide-react";
import { getStoreSettings } from "@/lib/services/settings.service";
import { formatPrice } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Shipping & Delivery | Libaas Atelier",
  description:
    "Learn about Libaas's insured delivery timelines, complimentary shipping thresholds, and tracking processes across India.",
};

const deliveryZones = [
  {
    region: "Metro Tier-1 Cities",
    cities: "Mumbai, Delhi NCR, Bengaluru, Hyderabad, Chennai, Kolkata, Pune",
    timeline: "2 to 3 Business Days",
    courier: "Bluedart / Delhivery Air Express",
  },
  {
    region: "Tier-2 & Major Towns",
    cities: "Ahmedabad, Jaipur, Lucknow, Chandigarh, Indore, Kochi, Surat",
    timeline: "3 to 5 Business Days",
    courier: "Delhivery / Bluedart Surface Express",
  },
  {
    region: "Rest of India & Outlying Areas",
    cities: "All serviceable pin codes across Indian states and union territories",
    timeline: "5 to 7 Business Days",
    courier: "India Post Speed Post / DTDC Express",
  },
];

const dispatchSteps = [
  {
    step: "1",
    title: "Atelier Quality Inspection",
    desc: "Every garment is steamed, thread-trimmed, and signed off by a master tailor.",
  },
  {
    step: "2",
    title: "Protective Packaging",
    desc: "Garments are carefully folded in breathable garment covers and unbleached kraft boxes.",
  },
  {
    step: "3",
    title: "Air Express Dispatch",
    desc: "Handed to our courier partners with full transit insurance coverage against damage or loss.",
  },
  {
    step: "4",
    title: "Live SMS & WhatsApp Alerts",
    desc: "You receive instant tracking links the moment the package scans at the hub.",
  },
];

export default async function ShippingPage() {
  const settings = await getStoreSettings();

  return (
    <div className="min-h-screen bg-[#131110] text-[#FAF7F2]">
      {/* Ambience */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden opacity-30">
        <div className="absolute top-20 left-1/4 h-[500px] w-[500px] rounded-full bg-[radial-gradient(circle,rgba(201,148,77,0.15),transparent_70%)] blur-3xl" />
      </div>

      {/* Hero */}
      <section className="relative px-6 pt-32 pb-20 text-center sm:pt-40 sm:pb-24">
        <div className="mx-auto max-w-4xl">
          <span className="inline-flex items-center gap-2 rounded-full border border-gold/30 bg-gold/10 px-4 py-1.5 text-xs font-semibold tracking-[0.24em] text-gold uppercase">
            <Truck className="h-3.5 w-3.5" /> Pan-India Fulfilment
          </span>
          <h1 className="mt-8 font-display text-4xl font-normal tracking-wide text-cream sm:text-6xl">
            Shipping & <span className="bg-gradient-to-r from-gold via-[#E8B775] to-gold-light bg-clip-text text-transparent italic">Delivery</span>
          </h1>
          <p className="mx-auto mt-4 max-w-xl text-base leading-relaxed text-cream-dark/70">
            Every Libaas piece is packed with meticulous care and dispatched through our premium insured courier partners.
          </p>
        </div>
      </section>

      {/* Free Shipping Banner */}
      <section className="relative px-6 pb-16">
        <div className="mx-auto max-w-5xl rounded-2xl border border-gold/30 bg-gradient-to-r from-gold/15 via-gold/5 to-transparent p-8 sm:p-10 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-5">
            <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl border border-gold/40 bg-gold/20 text-gold">
              <Package className="h-7 w-7" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-cream">
                Complimentary Shipping on Orders Above {formatPrice(settings.freeShippingThreshold)}
              </h2>
              <p className="mt-1 text-xs text-cream-dark/70">
                Applicable on all prepaid and COD orders delivered anywhere in India. Standard flat shipping fee of {formatPrice(settings.shippingFee)} on smaller orders.
              </p>
            </div>
          </div>
          <Link
            href="/shop"
            className="shrink-0 rounded-full bg-gradient-to-r from-gold to-gold-light px-6 py-3 text-xs font-semibold tracking-wider text-ink uppercase hover:shadow-[0_0_20px_rgba(201,148,77,0.4)] transition-all"
          >
            Start Shopping
          </Link>
        </div>
      </section>

      {/* Delivery Zones Table */}
      <section className="relative border-t border-white/[0.06] bg-[#161413] px-6 py-20">
        <div className="mx-auto max-w-5xl">
          <div className="text-center">
            <span className="text-xs font-semibold tracking-[0.24em] text-gold uppercase">Timelines</span>
            <h2 className="mt-2 font-display text-3xl font-medium text-cream">
              Estimated Delivery Windows
            </h2>
          </div>

          <div className="mt-12 space-y-4">
            {deliveryZones.map((zone) => (
              <div
                key={zone.region}
                className="rounded-2xl border border-white/[0.08] bg-[#1a1716] p-6 sm:p-8 flex flex-col md:flex-row md:items-center md:justify-between gap-6 hover:border-gold/30 transition-colors"
              >
                <div className="space-y-1">
                  <span className="text-xs font-semibold tracking-wider text-gold uppercase">
                    {zone.region}
                  </span>
                  <h3 className="text-lg font-semibold text-cream">{zone.cities}</h3>
                  <p className="text-xs text-cream-dark/50">Partner: {zone.courier}</p>
                </div>
                <div className="md:text-right shrink-0">
                  <div className="inline-flex items-center gap-2 rounded-full border border-gold/20 bg-gold/5 px-4 py-2 text-sm font-semibold text-gold">
                    <Clock className="h-4 w-4" /> {zone.timeline}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 4 Dispatch Steps */}
      <section className="relative px-6 py-24">
        <div className="mx-auto max-w-7xl">
          <div className="text-center">
            <span className="text-xs font-semibold tracking-[0.24em] text-gold uppercase">Journey of a Parcel</span>
            <h2 className="mt-2 font-display text-3xl font-medium text-cream">
              How Your Order Is Handled
            </h2>
          </div>

          <div className="mt-16 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {dispatchSteps.map((s) => (
              <div
                key={s.step}
                className="rounded-2xl border border-white/[0.08] bg-white/[0.02] p-8 hover:border-gold/30 transition-colors"
              >
                <span className="font-display text-3xl font-bold text-gold/50">{s.step}</span>
                <h3 className="mt-4 text-base font-semibold text-cream">{s.title}</h3>
                <p className="mt-2 text-xs leading-relaxed text-cream-dark/60">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Transit Insurance Note */}
      <section className="relative border-t border-white/[0.06] bg-[#171514] px-6 py-16 text-center">
        <div className="mx-auto max-w-3xl">
          <div className="inline-flex h-12 w-12 items-center justify-center rounded-full border border-gold/30 bg-gold/10 text-gold">
            <ShieldCheck className="h-6 w-6" />
          </div>
          <h3 className="mt-4 font-display text-2xl font-medium text-cream">
            100% Insured Transit
          </h3>
          <p className="mt-3 text-sm leading-relaxed text-cream-dark/70">
            If your package is lost, delayed, or damaged during transit, our support concierge
            will immediately arrange a complimentary replacement or full refund without red tape.
          </p>
          <div className="mt-6">
            <Link
              href="/track-order"
              className="inline-flex items-center gap-2 text-xs font-semibold tracking-wider text-gold uppercase hover:underline"
            >
              Track an existing shipment <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
