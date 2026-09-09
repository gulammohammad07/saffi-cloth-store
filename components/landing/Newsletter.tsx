"use client";

import { useState } from "react";
import { m as motion } from "framer-motion";
import { Mail, Send } from "lucide-react";
import { toast } from "sonner";

export default function Newsletter() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;
    setSubmitted(true);
    toast.success("Welcome to the inner circle");
  };

  return (
    <section className="relative overflow-hidden bg-[#EDE6DA] py-28 text-ink">
      {/* Marble backdrop */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#EFE9DE] via-[#EDE6DA] to-[#E9E1D3]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(221,139,95,0.35),transparent_55%)]" />
      <div className="absolute -left-24 top-1/2 h-[340px] w-[340px] -translate-y-1/2 bg-[radial-gradient(circle,rgba(214,163,131,0.3),transparent_70%)]" />
      <div className="absolute -right-24 top-1/4 h-[280px] w-[280px] bg-[radial-gradient(circle,rgba(221,139,95,0.3),transparent_70%)]" />

      {/* floating gold specks */}
      {[
        { top: "18%", left: "12%", delay: 0, size: 5 },
        { top: "72%", left: "20%", delay: 1.4, size: 4 },
        { top: "30%", left: "82%", delay: 0.8, size: 6 },
        { top: "64%", left: "88%", delay: 2.1, size: 4 },
        { top: "40%", left: "55%", delay: 1, size: 3 },
      ].map((dot, i) => (
        <motion.span
          key={i}
          className="pointer-events-none absolute rounded-full"
          style={{
            top: dot.top,
            left: dot.left,
            width: dot.size,
            height: dot.size,
            background:
              "radial-gradient(circle, rgba(221,139,95,0.9), rgba(221,139,95,0))",
          }}
          animate={{ y: [0, -30, 0], opacity: [0.2, 0.9, 0.2] }}
          transition={{
            duration: 7,
            delay: dot.delay,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      ))}

      <div className="relative mx-auto max-w-3xl px-6 text-center">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full border border-gold/40 bg-white/70 shadow-[0_0_40px_rgba(188,78,34,0.4)] backdrop-blur-md">
            <Mail size={22} className="text-gold" />
          </div>

          <h2 className="mt-6 font-display text-3xl font-medium text-ink sm:text-6xl">
            Join the{" "}
            <span className="gold-gradient-text animate-shine italic">
              Inner Circle
            </span>
          </h2>

          <p className="mx-auto mt-4 max-w-md text-sm leading-relaxed text-ink/60">
            Early access to limited drops, private sales and styling notes
            from our studio. One elegant email a week.
          </p>

          {submitted ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="mx-auto mt-10 max-w-md rounded-2xl border border-gold/30 bg-white/70 p-8 shadow-[0_24px_50px_-24px_rgba(28,26,23,0.3)] backdrop-blur-md"
            >
              <p className="font-display text-2xl text-ink">Welcome to Libaas. ✦</p>
              <p className="mt-2 text-sm text-ink/60">
                Your first private drop is on its way.
              </p>
            </motion.div>
          ) : (
            <form
              onSubmit={handleSubmit}
              className="mx-auto mt-10 flex max-w-md flex-col gap-3 sm:flex-row"
            >
              <div className="relative flex-1">
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Your email address"
                  className="w-full rounded-full border border-gold/30 bg-white/70 px-6 py-4 text-sm text-ink placeholder:text-ink/30 shadow-[inset_0_1px_3px_rgba(28,26,23,0.06)] backdrop-blur-md focus:border-gold focus:outline-none focus:ring-2 focus:ring-gold/25"
                />
              </div>
              <button
                type="submit"
                className="group flex items-center justify-center gap-2 rounded-full bg-gradient-to-r from-[#93371A] via-gold to-[#DD8B5F] px-8 py-4 text-sm font-semibold text-white shadow-[0_10px_40px_-10px_rgba(188,78,34,0.8)] transition-all hover:scale-105 hover:shadow-[0_10px_50px_-5px_rgba(188,78,34,0.9)]"
              >
                Subscribe
                <Send
                  size={15}
                  className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                />
              </button>
            </form>
          )}

          <p className="mt-5 text-xs tracking-wide text-ink/60">
            No spam. Unsubscribe anytime.
          </p>
        </motion.div>
      </div>
    </section>
  );
}
