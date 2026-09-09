"use client";

import { useState } from "react";
import Link from "next/link";
import { Search, Package, Truck, CheckCircle2, Clock, MapPin, ArrowRight, ShieldCheck } from "lucide-react";
import { toast } from "sonner";

export default function TrackOrderPage() {
  const [orderId, setOrderId] = useState("");
  const [contact, setContact] = useState("");
  const [trackingResult, setTrackingResult] = useState<null | {
    id: string;
    courier: string;
    awb: string;
    estimatedDelivery: string;
    status: string;
    timeline: { title: string; time: string; done: boolean; current?: boolean; desc: string }[];
  }>(null);
  const [loading, setLoading] = useState(false);

  const handleTrack = (e: React.FormEvent) => {
    e.preventDefault();
    if (!orderId.trim() || !contact.trim()) {
      toast.error("Please enter both Order ID and Phone/Email.");
      return;
    }

    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      const cleanId = orderId.toUpperCase().startsWith("LIB-") ? orderId.toUpperCase() : `LIB-${orderId.toUpperCase()}`;
      setTrackingResult({
        id: cleanId,
        courier: "Bluedart Air Express",
        awb: "BLR" + Math.floor(10000000 + Math.random() * 90000000),
        estimatedDelivery: "Thursday, by 7:00 PM",
        status: "In Transit — Out for Delivery Soon",
        timeline: [
          {
            title: "Order Confirmed & Placed",
            time: "Yesterday, 11:30 AM",
            done: true,
            desc: "Payment verified and order allocated to Mumbai atelier.",
          },
          {
            title: "Tailoring & Quality Sign-Off",
            time: "Yesterday, 4:15 PM",
            done: true,
            desc: "Garment hand-pressed, inspected for seam tension, and packaged in breathable unbleached kraft box.",
          },
          {
            title: "Dispatched from Mumbai Hub",
            time: "Today, 02:40 AM",
            done: true,
            desc: "Shipment scanned at primary sorting facility and loaded onto air cargo.",
          },
          {
            title: "Arrived at Destination City Hub",
            time: "Today, 09:15 AM",
            done: true,
            current: true,
            desc: "Sorted for local delivery route. Driver assignment in progress.",
          },
          {
            title: "Doorstep Delivery",
            time: "Expected Today by 7:00 PM",
            done: false,
            desc: "Courier will contact you prior to arrival with delivery OTP.",
          },
        ],
      });
      toast.success(`Tracking details loaded for ${cleanId}`);
    }, 500);
  };

  return (
    <div className="min-h-screen bg-[#131110] text-[#FAF7F2]">
      {/* Glow Ambience */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden opacity-30">
        <div className="absolute top-20 left-1/3 h-[500px] w-[500px] rounded-full bg-[radial-gradient(circle,rgba(201,148,77,0.15),transparent_70%)] blur-3xl" />
      </div>

      {/* Hero */}
      <section className="relative px-6 pt-32 pb-16 text-center sm:pt-40 sm:pb-20">
        <div className="mx-auto max-w-3xl">
          <span className="inline-flex items-center gap-2 rounded-full border border-gold/30 bg-gold/10 px-4 py-1.5 text-xs font-semibold tracking-[0.24em] text-gold uppercase">
            <Package className="h-3.5 w-3.5" /> Real-Time Fulfilment
          </span>
          <h1 className="mt-8 font-display text-4xl font-normal tracking-wide text-cream sm:text-6xl">
            Track Your <span className="bg-gradient-to-r from-gold via-[#E8B775] to-gold-light bg-clip-text text-transparent italic">Shipment</span>
          </h1>
          <p className="mx-auto mt-4 max-w-xl text-base leading-relaxed text-cream-dark/70">
            Enter your Libaas order number and registered phone number or email to view live transit progress.
          </p>
        </div>
      </section>

      {/* Search Input Box */}
      <section className="relative px-6 pb-20">
        <div className="mx-auto max-w-2xl">
          <form
            onSubmit={handleTrack}
            className="rounded-3xl border border-white/[0.1] bg-[#181615] p-6 sm:p-8 shadow-2xl space-y-4"
          >
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="block text-xs font-medium text-cream-dark/70 mb-1.5">
                  Order ID or Tracking No. *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. LIB-94281"
                  value={orderId}
                  onChange={(e) => setOrderId(e.target.value)}
                  className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-cream placeholder:text-cream-dark/30 focus:border-gold focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-cream-dark/70 mb-1.5">
                  Phone Number or Email *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. 9876543210 or user@email.com"
                  value={contact}
                  onChange={(e) => setContact(e.target.value)}
                  className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-cream placeholder:text-cream-dark/30 focus:border-gold focus:outline-none"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-gold to-gold-light px-8 py-3.5 text-xs font-semibold tracking-wider text-ink uppercase hover:shadow-[0_0_25px_rgba(201,148,77,0.4)] transition-all disabled:opacity-50"
            >
              {loading ? (
                "Scanning Hub Records..."
              ) : (
                <>
                  <Search className="h-4 w-4" /> Track Order Status
                </>
              )}
            </button>

            <div className="text-center pt-2">
              <Link
                href="/account/orders"
                className="text-xs text-cream-dark/60 hover:text-gold transition-colors inline-flex items-center gap-1"
              >
                Logged in? View all past orders in your Account <ArrowRight className="h-3 w-3" />
              </Link>
            </div>
          </form>

          {/* Results Card */}
          {trackingResult && (
            <div className="mt-12 rounded-3xl border border-gold/30 bg-[#191716] p-8 sm:p-10 transition-all">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between border-b border-white/[0.08] pb-6 gap-4">
                <div>
                  <span className="text-xs font-semibold text-gold tracking-wider uppercase">
                    Order Found
                  </span>
                  <h2 className="mt-1 text-2xl font-semibold text-cream">
                    {trackingResult.id}
                  </h2>
                  <p className="text-xs text-cream-dark/60 mt-1">
                    Courier: <span className="text-cream">{trackingResult.courier}</span> &bull; AWB: <span className="font-mono text-gold">{trackingResult.awb}</span>
                  </p>
                </div>
                <div className="rounded-2xl border border-gold/20 bg-gold/5 px-5 py-3 text-right">
                  <span className="text-xs text-cream-dark/60">Estimated Delivery</span>
                  <p className="text-sm font-semibold text-gold">{trackingResult.estimatedDelivery}</p>
                </div>
              </div>

              {/* Status Header */}
              <div className="mt-6 flex items-center gap-3">
                <span className="h-3 w-3 rounded-full bg-emerald-400 animate-pulse" />
                <span className="text-sm font-semibold text-cream">{trackingResult.status}</span>
              </div>

              {/* Timeline */}
              <div className="mt-8 space-y-8 relative before:absolute before:left-3 before:top-2 before:bottom-2 before:w-0.5 before:bg-white/10">
                {trackingResult.timeline.map((step, idx) => (
                  <div key={step.title} className="relative flex items-start gap-6 pl-1">
                    <div
                      className={`h-5 w-5 rounded-full border-2 shrink-0 z-10 flex items-center justify-center ${
                        step.current
                          ? "border-gold bg-gold ring-4 ring-gold/20"
                          : step.done
                          ? "border-emerald-400 bg-emerald-400"
                          : "border-white/20 bg-[#191716]"
                      }`}
                    >
                      {step.done && <CheckCircle2 className="h-3 w-3 text-ink" />}
                    </div>
                    <div>
                      <div className="flex flex-wrap items-center gap-3">
                        <h4 className={`text-sm font-semibold ${step.done ? "text-cream" : "text-cream-dark/40"}`}>
                          {step.title}
                        </h4>
                        <span className="text-xs text-cream-dark/50">{step.time}</span>
                      </div>
                      <p className="mt-1 text-xs text-cream-dark/70 leading-relaxed max-w-lg">
                        {step.desc}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-10 pt-6 border-t border-white/[0.08] flex items-center justify-between text-xs text-cream-dark/60">
                <span>Need immediate delivery assistance?</span>
                <Link href="/contact" className="text-gold hover:underline">
                  Contact Support Concierge &rarr;
                </Link>
              </div>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
