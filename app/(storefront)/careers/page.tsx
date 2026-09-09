import type { Metadata } from "next";
import Link from "next/link";
import { Sparkles, Briefcase, MapPin, Clock, ArrowRight, Heart, Award, Users, Compass } from "lucide-react";

export const metadata: Metadata = {
  title: "Careers | Join the Libaas Atelier",
  description:
    "Explore career opportunities in design, master pattern cutting, textile sourcing, and e-commerce at Libaas.",
};

const perks = [
  {
    icon: Award,
    title: "Artisanal Mastery",
    desc: "Work alongside generational masters who hold deep knowledge of Indian textiles and contemporary garment engineering.",
  },
  {
    icon: Heart,
    title: "Comprehensive Well-Being",
    desc: "Full medical coverage for you and your dependents, mental wellness support, and flexible working environments.",
  },
  {
    icon: Users,
    title: "Annual Wardrobe Credit",
    desc: "Generous complimentary clothing allowance and family discounts across all Libaas collections every season.",
  },
  {
    icon: Compass,
    title: "Continuous Learning",
    desc: "Dedicated stipend for textile workshops, pattern making courses, and global design conferences.",
  },
];

const openRoles = [
  {
    title: "Senior Apparel Designer (Menswear & Modern Ethnic)",
    department: "Design Atelier",
    location: "Mumbai Atelier (On-site)",
    type: "Full-time",
    experience: "4-7 Years",
    desc: "Lead silhouette development for our upcoming men's festive and relaxed linen collections. Deep proficiency in draping, textile specification, and tech packs required.",
  },
  {
    title: "Master Pattern Cutter & Tailoring Supervisor",
    department: "Production",
    location: "Mumbai Atelier (On-site)",
    type: "Full-time",
    experience: "8+ Years",
    desc: "Supervise our master sample cutting table, draft bespoke and graded commercial patterns, and uphold exacting 1mm tolerances on all seams.",
  },
  {
    title: "E-Commerce Growth & Merchandising Lead",
    department: "Digital Experience",
    location: "Mumbai / Hybrid",
    type: "Full-time",
    experience: "3-5 Years",
    desc: "Oversee storefront merchandising, conversion rate optimization, inventory allocation, and luxury digital customer journeys.",
  },
  {
    title: "Textile Sourcing & Quality Specialist",
    department: "Supply Chain",
    location: "Pan-India / Travel",
    type: "Full-time",
    experience: "3-6 Years",
    desc: "Build direct relationships with handloom weaver clusters across Varanasi, Chanderi, and Tamil Nadu. Rigorous fabric quality control and OEKO-TEX compliance.",
  },
];

export default function CareersPage() {
  return (
    <div className="min-h-screen bg-[#131110] text-[#FAF7F2]">
      {/* Glow Ambience */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden opacity-30">
        <div className="absolute top-20 right-1/4 h-[500px] w-[500px] rounded-full bg-[radial-gradient(circle,rgba(201,148,77,0.15),transparent_70%)] blur-3xl" />
      </div>

      {/* Hero */}
      <section className="relative px-6 pt-32 pb-20 text-center sm:pt-40 sm:pb-28">
        <div className="mx-auto max-w-4xl">
          <span className="inline-flex items-center gap-2 rounded-full border border-gold/30 bg-gold/10 px-4 py-1.5 text-xs font-semibold tracking-[0.24em] text-gold uppercase">
            <Briefcase className="h-3.5 w-3.5" /> Join Our Guild
          </span>
          <h1 className="mt-8 font-display text-4xl font-normal tracking-wide text-cream sm:text-6xl sm:leading-[1.15]">
            Craft the Future of <br />
            <span className="bg-gradient-to-r from-gold via-[#E8B775] to-gold-light bg-clip-text text-transparent italic">
              Modern Clothing
            </span>
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-base leading-relaxed text-cream-dark/70 sm:text-lg">
            We are building a sanctuary for thoughtful design, master tailors, and forward-thinking digital builders.
            Explore open opportunities to create work you are genuinely proud of.
          </p>
        </div>
      </section>

      {/* Perks Grid */}
      <section className="relative border-y border-white/[0.06] bg-[#171514] px-6 py-20">
        <div className="mx-auto max-w-7xl">
          <div className="text-center">
            <span className="text-xs font-semibold tracking-[0.24em] text-gold uppercase">Life at Libaas</span>
            <h2 className="mt-3 font-display text-3xl font-medium text-cream sm:text-4xl">
              Why You&apos;ll Love Working Here
            </h2>
          </div>

          <div className="mt-16 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {perks.map((p) => (
              <div
                key={p.title}
                className="rounded-2xl border border-white/[0.08] bg-white/[0.02] p-8 hover:border-gold/30 transition-colors"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-gold/30 bg-gold/10 text-gold">
                  <p.icon className="h-6 w-6" />
                </div>
                <h3 className="mt-6 text-base font-semibold text-cream">{p.title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-cream-dark/60">{p.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Open Positions */}
      <section className="relative px-6 py-24 sm:py-32">
        <div className="mx-auto max-w-5xl">
          <div className="text-center">
            <span className="text-xs font-semibold tracking-[0.24em] text-gold uppercase">Opportunities</span>
            <h2 className="mt-3 font-display text-3xl font-medium text-cream sm:text-4xl">
              Open Positions
            </h2>
            <p className="mt-3 text-sm text-cream-dark/70">
              Ready to leave an indelible mark? Find the role that matches your calling.
            </p>
          </div>

          <div className="mt-16 space-y-6">
            {openRoles.map((role) => (
              <div
                key={role.title}
                className="group rounded-2xl border border-white/[0.08] bg-[#181615] p-8 transition-all duration-300 hover:border-gold/40 hover:bg-[#1D1A19]"
              >
                <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                  <div>
                    <span className="text-xs font-semibold tracking-wider text-gold uppercase">
                      {role.department}
                    </span>
                    <h3 className="mt-2 text-xl font-semibold text-cream group-hover:text-gold transition-colors">
                      {role.title}
                    </h3>
                  </div>
                  <a
                    href={`mailto:careers@libaas.com?subject=Application for ${encodeURIComponent(role.title)}`}
                    className="inline-flex items-center gap-2 self-start rounded-full bg-gold/10 border border-gold/30 px-5 py-2 text-xs font-semibold tracking-wide text-gold hover:bg-gold hover:text-ink transition-all"
                  >
                    Apply Now <ArrowRight className="h-3.5 w-3.5" />
                  </a>
                </div>

                <p className="mt-4 text-sm leading-relaxed text-cream-dark/70">{role.desc}</p>

                <div className="mt-6 flex flex-wrap items-center gap-4 text-xs text-cream-dark/50">
                  <span className="flex items-center gap-1.5">
                    <MapPin className="h-3.5 w-3.5 text-gold" /> {role.location}
                  </span>
                  <span className="flex items-center gap-1.5">
                    <Clock className="h-3.5 w-3.5 text-gold" /> {role.type}
                  </span>
                  <span className="rounded-full bg-white/5 px-2.5 py-0.5 text-cream-dark/70">
                    Exp: {role.experience}
                  </span>
                </div>
              </div>
            ))}
          </div>

          {/* General Application */}
          <div className="mt-16 rounded-3xl border border-dashed border-white/20 bg-white/[0.02] p-10 text-center">
            <h3 className="text-xl font-semibold text-cream">Don&apos;t see your role?</h3>
            <p className="mx-auto mt-2 max-w-md text-sm text-cream-dark/70">
              We are perpetually looking for exceptional craftspeople, pattern cutters, and fashion visionaries. Send us your portfolio or CV.
            </p>
            <a
              href="mailto:careers@libaas.com?subject=General Inquiry / Portfolio Submission"
              className="mt-6 inline-flex items-center gap-2 rounded-full border border-gold/40 px-6 py-2.5 text-xs font-semibold tracking-wider text-gold uppercase hover:bg-gold hover:text-ink transition-all"
            >
              Send Open Application <ArrowRight className="h-3.5 w-3.5" />
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
