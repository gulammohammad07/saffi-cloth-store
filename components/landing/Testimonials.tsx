"use client";

import { Quote, Star } from "lucide-react";
import { testimonials } from "@/lib/data/products";
import SectionHeading from "@/components/landing/SectionHeading";

const cards = [...testimonials, ...testimonials];

export default function Testimonials() {
  return (
    <section className="relative overflow-hidden bg-[#E9E1D3] py-28 text-ink">
      <div className="pointer-events-none absolute left-1/2 top-0 h-px w-[60%] -translate-x-1/2 bg-gradient-to-r from-transparent via-gold/40 to-transparent" />
      <div className="pointer-events-none absolute left-1/2 top-1/2 h-[420px] w-[720px] -translate-x-1/2 -translate-y-1/2 bg-[radial-gradient(ellipse,rgba(214,163,131,0.2),transparent_70%)]" />

      <div className="relative mx-auto max-w-7xl px-6">
        <SectionHeading
          eyebrow="Word of Mouth"
          title="Loved by Our Customers"
          description="Real reviews from clients who made Libaas their signature."
        />
      </div>

      <div className="relative mt-4">
        <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-16 bg-gradient-to-r from-[#E9E1D3] to-transparent sm:w-32" />
        <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-16 bg-gradient-to-l from-[#E9E1D3] to-transparent sm:w-32" />

        <div className="overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_4%,black_96%,transparent)]">
          <div
            className="group flex w-max gap-6 animate-marquee gpu group-hover:[animation-play-state:paused]"
            style={{ animationDuration: "70s", animationDirection: "reverse" }}
          >
            {cards.map((t, i) => (
              <article
                key={`${t.name}-${i}`}
                className="relative w-[320px] shrink-0 rounded-[1.75rem] border border-gold/20 bg-white/70 p-8 shadow-[0_24px_50px_-24px_rgba(28,26,23,0.3)] backdrop-blur-sm transition-all duration-500 hover:-translate-y-1 hover:border-gold/40 hover:shadow-[0_34px_60px_-24px_rgba(188,78,34,0.45)] sm:w-[400px]"
              >
                <Quote
                  size={36}
                  className="absolute right-6 top-6 text-gold/30"
                />

                <div className="flex items-center gap-1">
                  {Array.from({ length: 5 }).map((_, starIndex) => (
                    <Star
                      key={starIndex}
                      size={15}
                      className={
                        starIndex < t.rating
                          ? "fill-gold text-gold"
                          : "text-ink/30"
                      }
                    />
                  ))}
                </div>

                <blockquote className="mt-5 text-sm leading-relaxed text-ink/60">
                  &ldquo;{t.quote}&rdquo;
                </blockquote>

                <footer className="mt-7 flex items-center gap-4">
                  <div className="flex h-11 w-11 items-center justify-center rounded-full bg-gradient-to-br from-gold/40 to-gold/10 font-display text-base font-semibold text-gold">
                    {t.name.charAt(0)}
                  </div>
                  <div>
                    <p className="text-sm font-semibold tracking-[0.12em] text-ink uppercase">
                      {t.name}
                    </p>
                    <p className="mt-0.5 text-xs tracking-wide text-ink/60">
                      {t.location}
                    </p>
                  </div>
                </footer>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
