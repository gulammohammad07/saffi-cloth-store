"use client";

import { useState } from "react";
import Link from "next/link";
import { HelpCircle, ChevronDown, Search, MessageSquare, ArrowRight, ShieldCheck } from "lucide-react";

type FAQItem = {
  question: string;
  answer: string;
  category: "Orders & Shipping" | "Sizing & Fit" | "Returns & Refunds" | "Fabric & Care" | "Payments";
};

const faqs: FAQItem[] = [
  {
    category: "Orders & Shipping",
    question: "How long will it take for my order to arrive?",
    answer:
      "Metro cities (Mumbai, Delhi NCR, Bengaluru, Hyderabad, Chennai, Pune) typically receive orders within 2-3 business days. Tier-2 and rest of India locations take 4-6 business days. You will receive live SMS and WhatsApp tracking links as soon as your parcel departs our atelier.",
  },
  {
    category: "Orders & Shipping",
    question: "Is shipping free?",
    answer:
      "Yes! All orders above ₹999 qualify for complimentary insured priority shipping across India. For orders below this threshold, a flat shipping fee of ₹99 is applied at checkout.",
  },
  {
    category: "Orders & Shipping",
    question: "Can I modify my delivery address after placing an order?",
    answer:
      "If your order has not yet been collected by our courier partner, our concierge can update your shipping address immediately. Please message us on WhatsApp (+91 98765 43210) with your Order ID as soon as possible.",
  },
  {
    category: "Sizing & Fit",
    question: "How do I know what size to choose?",
    answer:
      "Each garment page includes a dedicated 'Size Guide' with garment dimensions (chest, waist, hip, length) laid flat. Our silhouettes are designed with comfortable, tailored ease. If you find yourself between sizes, we generally recommend sizing up for linen and true to size for cotton shirts and kurtas.",
  },
  {
    category: "Sizing & Fit",
    question: "Do you offer custom tailoring or bespoke sizing?",
    answer:
      "Yes! We offer bespoke size adjustments (such as sleeve length shortening or trouser hem modifications) on select styles. Reach out via WhatsApp or our Contact page before placing your order.",
  },
  {
    category: "Returns & Refunds",
    question: "What is your return and exchange policy?",
    answer:
      "We offer a 7-day hassle-free return and exchange window from the date of doorstep delivery. Garments must be unworn, unwashed, and have original tags intact. Pickup is complimentary and scheduled right from your address.",
  },
  {
    category: "Returns & Refunds",
    question: "When will I receive my refund?",
    answer:
      "Prepaid orders (UPI, Cards, Net Banking) are refunded within 24 to 48 hours following atelier inspection. For COD orders, we transfer refunds instantly to your UPI ID or bank account via a secure portal link.",
  },
  {
    category: "Fabric & Care",
    question: "How should I wash my linen and cotton garments?",
    answer:
      "We recommend machine washing in cold water on a delicate cycle with mild, eco-friendly liquid detergent. Avoid bleach and direct harsh midday sun when drying. Natural linen softens gracefully with each wash.",
  },
  {
    category: "Fabric & Care",
    question: "Do pure silk and Banarasi brocade pieces require dry cleaning?",
    answer:
      "Yes. For our heritage pure Katan silks, Banarasi brocades, and structured bandhgalas, professional dry cleaning is strictly recommended to protect real zari and delicate handloom weaves.",
  },
  {
    category: "Payments",
    question: "What payment methods are supported?",
    answer:
      "We accept all major UPI apps (Google Pay, PhonePe, Paytm), Credit and Debit Cards (Visa, Mastercard, RuPay, Amex), Net Banking across 50+ Indian banks, and Cash on Delivery (COD) on eligible pin codes.",
  },
  {
    category: "Payments",
    question: "Is my payment information secure?",
    answer:
      "Absolutely. All transactions are processed through 256-bit SSL encrypted PCI-DSS Level 1 compliant payment gateways. We never store your card numbers or CVV codes.",
  },
];

const categories = ["All", "Orders & Shipping", "Sizing & Fit", "Returns & Refunds", "Fabric & Care", "Payments"] as const;

export default function FAQsPage() {
  const [activeCategory, setActiveCategory] = useState<string>("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const filteredFaqs = faqs.filter((faq) => {
    const matchesCategory = activeCategory === "All" || faq.category === activeCategory;
    const matchesSearch =
      faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      faq.answer.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const toggleAccordion = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="min-h-screen bg-[#131110] text-[#FAF7F2]">
      {/* Ambience */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden opacity-30">
        <div className="absolute top-20 right-1/4 h-[500px] w-[500px] rounded-full bg-[radial-gradient(circle,rgba(201,148,77,0.15),transparent_70%)] blur-3xl" />
      </div>

      {/* Hero */}
      <section className="relative px-6 pt-32 pb-16 text-center sm:pt-40 sm:pb-20">
        <div className="mx-auto max-w-3xl">
          <span className="inline-flex items-center gap-2 rounded-full border border-gold/30 bg-gold/10 px-4 py-1.5 text-xs font-semibold tracking-[0.24em] text-gold uppercase">
            <HelpCircle className="h-3.5 w-3.5" /> Client Guidance
          </span>
          <h1 className="mt-8 font-display text-4xl font-normal tracking-wide text-cream sm:text-6xl">
            Frequently Asked <span className="bg-gradient-to-r from-gold via-[#E8B775] to-gold-light bg-clip-text text-transparent italic">Questions</span>
          </h1>
          <p className="mx-auto mt-4 max-w-xl text-base leading-relaxed text-cream-dark/70">
            Quick clarity on our sizing, shipping timelines, doorstep returns, and artisanal garment care.
          </p>

          {/* Search Box */}
          <div className="relative mx-auto mt-8 max-w-xl">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-cream-dark/40" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search your question (e.g. linen care, sizing, COD)..."
              className="w-full rounded-full border border-white/10 bg-white/5 pl-12 pr-6 py-3.5 text-sm text-cream placeholder:text-cream-dark/40 focus:border-gold focus:outline-none"
            />
          </div>

          {/* Category Tabs */}
          <div className="mt-8 flex flex-wrap justify-center gap-2">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`rounded-full px-5 py-2 text-xs font-medium tracking-wide transition-all ${
                  activeCategory === cat
                    ? "bg-gold text-ink shadow-[0_0_20px_rgba(201,148,77,0.4)]"
                    : "border border-white/10 bg-white/[0.03] text-cream-dark/70 hover:border-gold/30 hover:text-cream"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Accordion */}
      <section className="relative px-6 pb-28">
        <div className="mx-auto max-w-4xl space-y-4">
          {filteredFaqs.length === 0 ? (
            <div className="rounded-2xl border border-white/[0.08] bg-[#181615] p-12 text-center">
              <p className="text-cream-dark/70">No questions found matching &ldquo;{searchQuery}&rdquo;.</p>
              <button
                onClick={() => {
                  setSearchQuery("");
                  setActiveCategory("All");
                }}
                className="mt-4 text-xs font-semibold text-gold uppercase hover:underline"
              >
                Reset Search Filters
              </button>
            </div>
          ) : (
            filteredFaqs.map((faq, index) => {
              const isOpen = openIndex === index;
              return (
                <div
                  key={faq.question}
                  className={`rounded-2xl border transition-all ${
                    isOpen
                      ? "border-gold/40 bg-[#181615]"
                      : "border-white/[0.06] bg-white/[0.02] hover:border-white/20"
                  }`}
                >
                  <button
                    onClick={() => toggleAccordion(index)}
                    className="flex w-full items-center justify-between p-6 text-left"
                  >
                    <div className="pr-4">
                      <span className="text-[10px] font-semibold tracking-wider text-gold uppercase">
                        {faq.category}
                      </span>
                      <h3 className="mt-1 text-base font-medium text-cream sm:text-lg">
                        {faq.question}
                      </h3>
                    </div>
                    <ChevronDown
                      className={`h-5 w-5 shrink-0 text-gold transition-transform duration-300 ${
                        isOpen ? "rotate-180" : ""
                      }`}
                    />
                  </button>

                  {isOpen && (
                    <div className="border-t border-white/[0.06] px-6 pb-6 pt-4">
                      <p className="text-sm leading-relaxed text-cream-dark/75">
                        {faq.answer}
                      </p>
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>

        {/* Still Have Questions Box */}
        <div className="mx-auto mt-16 max-w-4xl rounded-3xl border border-gold/30 bg-gradient-to-br from-gold/10 via-transparent to-transparent p-8 sm:p-12 text-center">
          <div className="inline-flex h-12 w-12 items-center justify-center rounded-full border border-gold/30 bg-gold/10 text-gold">
            <MessageSquare className="h-6 w-6" />
          </div>
          <h2 className="mt-4 font-display text-2xl font-medium text-cream">
            Still Have a Question?
          </h2>
          <p className="mx-auto mt-2 max-w-md text-sm text-cream-dark/70">
            Our atelier concierge is accessible every Monday to Saturday, 10 AM to 7:30 PM.
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-4">
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-gold to-gold-light px-7 py-3 text-xs font-semibold tracking-wider text-ink uppercase hover:shadow-[0_0_20px_rgba(201,148,77,0.4)] transition-all"
            >
              Contact Support Concierge <ArrowRight className="h-4 w-4" />
            </Link>
            <a
              href="https://wa.me/919876543210"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/5 px-7 py-3 text-xs font-semibold tracking-wider text-cream hover:border-gold hover:text-gold transition-colors"
            >
              Chat on WhatsApp
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
