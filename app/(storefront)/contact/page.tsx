"use client";

import { useState } from "react";
import { Sparkles, Mail, Phone, MapPin, Clock, MessageSquare, Send, CheckCircle2 } from "lucide-react";
import { toast } from "sonner";

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    inquiryType: "Order Status",
    orderId: "",
    message: "",
  });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.email.trim() || !formData.message.trim()) {
      toast.error("Please fill in your name, email, and message.");
      return;
    }

    setLoading(true);
    // Simulate instantaneous graceful submission
    setTimeout(() => {
      setLoading(false);
      setSubmitted(true);
      toast.success("Thank you! Your inquiry has been dispatched to our concierge.");
    }, 600);
  };

  return (
    <div className="min-h-screen bg-[#131110] text-[#FAF7F2]">
      {/* Background Ambience */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden opacity-30">
        <div className="absolute top-20 right-1/4 h-[500px] w-[500px] rounded-full bg-[radial-gradient(circle,rgba(201,148,77,0.15),transparent_70%)] blur-3xl" />
      </div>

      {/* Hero */}
      <section className="relative px-6 pt-32 pb-16 text-center sm:pt-40 sm:pb-20">
        <div className="mx-auto max-w-3xl">
          <span className="inline-flex items-center gap-2 rounded-full border border-gold/30 bg-gold/10 px-4 py-1.5 text-xs font-semibold tracking-[0.24em] text-gold uppercase">
            <MessageSquare className="h-3.5 w-3.5" /> Client Concierge
          </span>
          <h1 className="mt-8 font-display text-4xl font-normal tracking-wide text-cream sm:text-6xl">
            Get in <span className="bg-gradient-to-r from-gold via-[#E8B775] to-gold-light bg-clip-text text-transparent italic">Touch</span>
          </h1>
          <p className="mx-auto mt-4 max-w-xl text-base leading-relaxed text-cream-dark/70">
            Have a question regarding fit, order tracking, bespoke tailoring, or styling advice?
            Our Mumbai concierge team is here to assist you.
          </p>
        </div>
      </section>

      {/* Content Grid: Form + Details */}
      <section className="relative px-6 pb-28">
        <div className="mx-auto grid max-w-6xl gap-12 lg:grid-cols-12">
          {/* Contact Details */}
          <div className="space-y-6 lg:col-span-5">
            <div className="rounded-2xl border border-white/[0.08] bg-[#181615] p-8">
              <h2 className="text-xs font-semibold tracking-[0.24em] text-gold uppercase">
                Direct Channels
              </h2>
              <p className="mt-2 text-xl font-medium text-cream">
                We respond within hours
              </p>

              <div className="mt-8 space-y-6 text-sm text-cream-dark/70">
                <div className="flex items-start gap-4">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-gold/30 bg-gold/10 text-gold">
                    <Mail className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="font-medium text-cream">Email Support</p>
                    <a
                      href="mailto:support@libaas.com"
                      className="text-gold hover:underline"
                    >
                      support@libaas.com
                    </a>
                    <p className="text-xs text-cream-dark/50 mt-0.5">24/7 inbox monitoring</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-gold/30 bg-gold/10 text-gold">
                    <Phone className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="font-medium text-cream">Phone & WhatsApp</p>
                    <a
                      href="https://wa.me/919876543210"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-gold hover:underline"
                    >
                      +91 98765 43210
                    </a>
                    <p className="text-xs text-cream-dark/50 mt-0.5">Instant WhatsApp assistance</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-gold/30 bg-gold/10 text-gold">
                    <MapPin className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="font-medium text-cream">Atelier & Studio</p>
                    <p className="text-cream-dark/70">
                      Libaas House, 4th Floor, Mathuradas Mills Compound, Lower Parel, Mumbai 400013
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-gold/30 bg-gold/10 text-gold">
                    <Clock className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="font-medium text-cream">Operating Hours</p>
                    <p className="text-cream-dark/70">Monday to Saturday: 10:00 AM – 7:30 PM IST</p>
                    <p className="text-xs text-cream-dark/50">Closed on Sundays & National Holidays</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Sizing Card */}
            <div className="rounded-2xl border border-gold/20 bg-gradient-to-br from-gold/10 to-transparent p-6">
              <h3 className="text-base font-semibold text-cream">Unsure about your size?</h3>
              <p className="mt-2 text-xs leading-relaxed text-cream-dark/70">
                Share your chest, waist, and height measurements via WhatsApp or in the message box,
                and our master tailor will recommend your ideal fit.
              </p>
            </div>
          </div>

          {/* Form */}
          <div className="rounded-2xl border border-white/[0.08] bg-[#181615] p-8 lg:col-span-7">
            {submitted ? (
              <div className="flex flex-col items-center justify-center py-16 text-center">
                <div className="flex h-16 w-16 items-center justify-center rounded-full border border-gold/30 bg-gold/10 text-gold">
                  <CheckCircle2 className="h-8 w-8" />
                </div>
                <h3 className="mt-6 font-display text-2xl font-medium text-cream">
                  Inquiry Received
                </h3>
                <p className="mt-3 max-w-md text-sm text-cream-dark/70">
                  Thank you for reaching out, {formData.name}. Our concierge team will review your message and reply via email within 4-12 hours.
                </p>
                <button
                  onClick={() => {
                    setSubmitted(false);
                    setFormData({
                      name: "",
                      email: "",
                      phone: "",
                      inquiryType: "Order Status",
                      orderId: "",
                      message: "",
                    });
                  }}
                  className="mt-8 rounded-full border border-gold/40 px-6 py-2.5 text-xs font-semibold tracking-wider text-gold uppercase hover:bg-gold hover:text-ink transition-all"
                >
                  Send Another Message
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <h2 className="font-display text-2xl font-medium text-cream">Send a Message</h2>
                  <p className="mt-1 text-xs text-cream-dark/60">
                    Fill in your details below and we will get back to you promptly.
                  </p>
                </div>

                <div className="grid gap-6 sm:grid-cols-2">
                  <div>
                    <label className="block text-xs font-medium text-cream-dark/70 mb-2">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="e.g. Daniyal Khan"
                      className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-cream placeholder:text-cream-dark/30 focus:border-gold focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-cream-dark/70 mb-2">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="e.g. name@example.com"
                      className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-cream placeholder:text-cream-dark/30 focus:border-gold focus:outline-none"
                    />
                  </div>
                </div>

                <div className="grid gap-6 sm:grid-cols-2">
                  <div>
                    <label className="block text-xs font-medium text-cream-dark/70 mb-2">
                      Phone Number (Optional)
                    </label>
                    <input
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      placeholder="e.g. +91 98765 43210"
                      className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-cream placeholder:text-cream-dark/30 focus:border-gold focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-cream-dark/70 mb-2">
                      Inquiry Category
                    </label>
                    <select
                      value={formData.inquiryType}
                      onChange={(e) => setFormData({ ...formData, inquiryType: e.target.value })}
                      className="w-full rounded-xl border border-white/10 bg-[#1e1a19] px-4 py-3 text-sm text-cream focus:border-gold focus:outline-none"
                    >
                      <option value="Order Status">Order Status & Tracking</option>
                      <option value="Size Consultation">Size & Fit Guidance</option>
                      <option value="Returns & Exchange">Returns or Exchange</option>
                      <option value="Bespoke Request">Bespoke & Bulk Inquiries</option>
                      <option value="Other">General Question</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-cream-dark/70 mb-2">
                    Order ID (If applicable)
                  </label>
                  <input
                    type="text"
                    value={formData.orderId}
                    onChange={(e) => setFormData({ ...formData, orderId: e.target.value })}
                    placeholder="e.g. LIB-94218"
                    className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-cream placeholder:text-cream-dark/30 focus:border-gold focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-cream-dark/70 mb-2">
                    How can we assist you? *
                  </label>
                  <textarea
                    rows={5}
                    required
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    placeholder="Tell us about your inquiry, measurements, or request..."
                    className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-cream placeholder:text-cream-dark/30 focus:border-gold focus:outline-none"
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-gold to-gold-light px-8 py-4 text-xs font-semibold tracking-wider text-ink uppercase hover:shadow-[0_0_25px_rgba(201,148,77,0.4)] transition-all disabled:opacity-50"
                >
                  {loading ? (
                    "Sending Message..."
                  ) : (
                    <>
                      <Send className="h-4 w-4" /> Send Inquiry to Concierge
                    </>
                  )}
                </button>
              </form>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
