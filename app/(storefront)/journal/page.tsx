"use client";

import { useState } from "react";
import Link from "next/link";
import { Sparkles, Clock, Calendar, ArrowRight, BookOpen, Mail } from "lucide-react";
import { toast } from "sonner";

const categories = ["All", "Style Guide", "Textile Heritage", "Fabric Care", "Atelier Notes"];

const articles = [
  {
    id: "linen-summer-guide",
    title: "Why Pure Linen is the Unrivaled King of Indian Summers",
    category: "Textile Heritage",
    readTime: "4 min read",
    date: "March 2026",
    author: "Zoya Merchant, Master Pattern Cutter",
    summary:
      "A deep dive into the microscopic structure of flax fibers, how natural flax absorbs 20% of its weight in moisture without feeling damp, and how to embrace natural rumples with pride.",
  },
  {
    id: "capsule-wardrobe-essentials",
    title: "The 8-Piece Capsule Wardrobe for Effortless Modern Living",
    category: "Style Guide",
    readTime: "6 min read",
    date: "February 2026",
    author: "Editorial Atelier",
    summary:
      "Simplify your mornings without losing personal flair. How 3 foundational tops, 2 tailored trousers, and 3 versatile outer layers combine into 24 distinct, elevated outfits.",
  },
  {
    id: "caring-for-handlooms",
    title: "How to Wash, Air-Dry and Iron Silk and Handloom Cottons",
    category: "Fabric Care",
    readTime: "5 min read",
    date: "January 2026",
    author: "Raza Tailoring Guild",
    summary:
      "Avoid dry-cleaning chemicals that degrade natural fibers. Learn temperature management, cold salt soaks, shaded drying, and reverse steam ironing techniques.",
  },
  {
    id: "the-death-of-fast-fashion",
    title: "Why Buying Fewer, Better Things Changes Everything",
    category: "Atelier Notes",
    readTime: "7 min read",
    date: "January 2026",
    author: "Founder's Desk",
    summary:
      "The true cost of a cheap polyester shirt isn't the price tag. An honest reflection on artisan livelihoods, textile waste, and returning to the joy of mending.",
  },
  {
    id: "styling-festive-kurtas",
    title: "Modern Festive: How to Style Traditional Weaves for Contemporary Evenings",
    category: "Style Guide",
    readTime: "5 min read",
    date: "December 2025",
    author: "Zoya Merchant",
    summary:
      "Pairing raw silk bandhgalas with pleated chinos, layering sheer Chanderi stoles over minimalist monochrome separates, and choosing handcrafted leather footwear.",
  },
  {
    id: "anatomy-of-a-french-seam",
    title: "Behind the Stitches: Why We Refuse to Overlock Inside Seams",
    category: "Atelier Notes",
    readTime: "4 min read",
    date: "November 2025",
    author: "Atelier Production Team",
    summary:
      "An insider look at the double-pass French seam, why it requires twice as much time and thread, and why your skin will thank you twenty years from now.",
  },
];

export default function JournalPage() {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [email, setEmail] = useState("");

  const filteredArticles =
    selectedCategory === "All"
      ? articles
      : articles.filter((a) => a.category === selectedCategory);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !email.includes("@")) {
      toast.error("Please provide a valid email address.");
      return;
    }
    toast.success("Thank you for subscribing to The Libaas Journal!");
    setEmail("");
  };

  return (
    <div className="min-h-screen bg-[#131110] text-[#FAF7F2]">
      {/* Ambience */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden opacity-30">
        <div className="absolute top-10 left-1/3 h-[550px] w-[550px] rounded-full bg-[radial-gradient(circle,rgba(201,148,77,0.14),transparent_70%)] blur-3xl" />
      </div>

      {/* Hero */}
      <section className="relative px-6 pt-32 pb-16 text-center sm:pt-40 sm:pb-24">
        <div className="mx-auto max-w-3xl">
          <span className="inline-flex items-center gap-2 rounded-full border border-gold/30 bg-gold/10 px-4 py-1.5 text-xs font-semibold tracking-[0.24em] text-gold uppercase">
            <BookOpen className="h-3.5 w-3.5" /> Editorial & Musings
          </span>
          <h1 className="mt-8 font-display text-4xl font-normal tracking-wide text-cream sm:text-6xl">
            The Libaas <span className="bg-gradient-to-r from-gold via-[#E8B775] to-gold-light bg-clip-text text-transparent italic">Journal</span>
          </h1>
          <p className="mx-auto mt-5 max-w-xl text-base leading-relaxed text-cream-dark/70">
            Thoughtful essays on timeless dressing, textile histories, fabric care, and the artisans behind our garments.
          </p>
        </div>

        {/* Category Filters */}
        <div className="mt-12 flex flex-wrap justify-center gap-2.5">
          {categories.map((c) => (
            <button
              key={c}
              onClick={() => setSelectedCategory(c)}
              className={`rounded-full px-5 py-2 text-xs font-medium tracking-wide transition-all ${
                selectedCategory === c
                  ? "bg-gold text-ink shadow-[0_0_20px_rgba(201,148,77,0.4)]"
                  : "border border-white/10 bg-white/[0.03] text-cream-dark/70 hover:border-gold/30 hover:text-cream"
              }`}
            >
              {c}
            </button>
          ))}
        </div>
      </section>

      {/* Article Grid */}
      <section className="relative px-6 pb-28">
        <div className="mx-auto max-w-7xl">
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {filteredArticles.map((article) => (
              <article
                key={article.id}
                className="group flex flex-col justify-between rounded-2xl border border-white/[0.08] bg-[#171514] p-8 transition-all duration-300 hover:border-gold/40 hover:bg-[#1C1918] hover:-translate-y-1"
              >
                <div>
                  <div className="flex items-center justify-between text-xs text-cream-dark/50">
                    <span className="font-semibold tracking-wider text-gold uppercase">
                      {article.category}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="h-3 w-3" /> {article.readTime}
                    </span>
                  </div>

                  <h2 className="mt-4 font-display text-xl font-medium leading-snug text-cream group-hover:text-gold transition-colors">
                    {article.title}
                  </h2>

                  <p className="mt-3 text-sm leading-relaxed text-cream-dark/70">
                    {article.summary}
                  </p>
                </div>

                <div className="mt-8 border-t border-white/[0.06] pt-5">
                  <div className="flex items-center justify-between text-xs text-cream-dark/50">
                    <span className="flex items-center gap-1.5">
                      <Calendar className="h-3 w-3" /> {article.date}
                    </span>
                    <span className="inline-flex items-center gap-1 font-semibold text-gold group-hover:translate-x-1 transition-transform">
                      Read Story <ArrowRight className="h-3.5 w-3.5" />
                    </span>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Newsletter Box */}
      <section className="relative border-t border-white/[0.06] bg-[#161413] px-6 py-20 text-center">
        <div className="mx-auto max-w-2xl">
          <div className="flex h-12 w-12 mx-auto items-center justify-center rounded-full border border-gold/30 bg-gold/10 text-gold">
            <Mail className="h-5 w-5" />
          </div>
          <h2 className="mt-6 font-display text-2xl font-medium text-cream sm:text-3xl">
            Letters from the Atelier
          </h2>
          <p className="mt-3 text-sm leading-relaxed text-cream-dark/70">
            Receive our bi-weekly dispatch on slow tailoring, seasonal styling guides, and early access to small-batch drops.
          </p>

          <form onSubmit={handleSubscribe} className="mt-8 flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email address..."
              required
              className="flex-1 rounded-full border border-white/10 bg-white/5 px-5 py-3 text-sm text-cream placeholder:text-cream-dark/40 focus:border-gold focus:outline-none"
            />
            <button
              type="submit"
              className="rounded-full bg-gradient-to-r from-gold to-gold-light px-7 py-3 text-xs font-semibold tracking-wider text-ink uppercase hover:shadow-[0_0_20px_rgba(201,148,77,0.4)] transition-all"
            >
              Subscribe
            </button>
          </form>
        </div>
      </section>
    </div>
  );
}
