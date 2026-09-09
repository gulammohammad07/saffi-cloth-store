import Link from "next/link";
import { ShieldCheck, Truck, BadgeCheck } from "lucide-react";
import {
  InstagramIcon,
  FacebookIcon,
  XIcon,
  YoutubeIcon,
} from "@/components/layout/SocialIcons";
import { formatPrice } from "@/lib/utils";
import { DEFAULT_FREE_SHIPPING_THRESHOLD } from "@/lib/constants/shipping";

const columns = [
  {
    title: "Shop",
    links: [
      { label: "All Clothing", href: "/shop" },
      { label: "Men", href: "/shop?type=men" },
      { label: "Women", href: "/shop?type=women" },
      { label: "Kids", href: "/shop?type=kids" },
    ],
  },
  {
    title: "Company",
    links: [
      { label: "Our Story", href: "/story" },
      { label: "Craftsmanship", href: "/craftsmanship" },
      { label: "Journal", href: "/journal" },
      { label: "Sustainability", href: "/sustainability" },
      { label: "Careers", href: "/careers" },
    ],
  },
  {
    title: "Support",
    links: [
      { label: "Contact Us", href: "/contact" },
      { label: "Shipping & Delivery", href: "/shipping" },
      { label: "Returns & Exchanges", href: "/returns" },
      { label: "Track Order", href: "/track-order" },
      { label: "FAQs", href: "/faqs" },
    ],
  },
];

function buildTrustBadges(freeShippingThreshold: number) {
  return [
    {
      icon: Truck,
      label: "Free Shipping",
      sub: `On orders over ${formatPrice(freeShippingThreshold)}`,
    },
    { icon: ShieldCheck, label: "Secure Payment", sub: "256-bit encrypted" },
    { icon: BadgeCheck, label: "Authentic", sub: "100% genuine fabrics" },
  ];
}

export default function Footer({
  freeShippingThreshold = DEFAULT_FREE_SHIPPING_THRESHOLD,
}: {
  freeShippingThreshold?: number;
}) {
  const trustBadges = buildTrustBadges(freeShippingThreshold);

  return (
    <footer className="relative overflow-hidden bg-[#131110]">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-1/2 top-0 h-px w-[80%] -translate-x-1/2 bg-gradient-to-r from-transparent via-gold/20 to-transparent" />
        <div className="absolute -right-40 top-1/4 h-[500px] w-[500px] bg-[radial-gradient(circle,rgba(188,78,34,0.08),transparent_70%)]" />
      </div>

      <div className="relative border-b border-white/[0.06]">
        <div className="mx-auto grid max-w-7xl grid-cols-2 gap-10 px-6 py-14 sm:grid-cols-3">
          {trustBadges.map((badge) => (
            <div key={badge.label} className="flex items-center gap-5">
              <div className="flex h-12 w-12 items-center justify-center rounded-full border border-gold/30 bg-white/10 text-gold">
                <badge.icon size={22} />
              </div>
              <div>
                <p className="text-sm font-semibold text-cream">
                  {badge.label}
                </p>
                <p className="text-xs text-cream-dark/60">
                  {badge.sub}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="relative mx-auto max-w-7xl px-6 py-20">
        <div className="grid gap-14 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <p className="font-display text-3xl font-semibold tracking-[0.2em] text-cream">
              LIB<span className="bg-gradient-to-r from-gold to-gold-light bg-clip-text text-transparent">AAS</span>
            </p>
            <p className="mt-6 max-w-sm text-base leading-[1.8] text-cream-dark/60">
              A modern house of thoughtfully made clothing. Every piece is
              designed for real life, cut with care and finished to last —
              because true style cannot be rushed.
            </p>

            <div className="mt-9 flex gap-3">
              {[
                { icon: InstagramIcon, label: "Instagram" },
                { icon: FacebookIcon, label: "Facebook" },
                { icon: XIcon, label: "X (Twitter)" },
                { icon: YoutubeIcon, label: "YouTube" },
              ].map((social) => (
                <a
                  key={social.label}
                  href="#"
                  aria-label={social.label}
                  className="flex h-11 w-11 items-center justify-center rounded-full border border-white/10 text-cream-dark/60 transition-all duration-500 hover:border-gold hover:bg-gradient-to-r hover:from-gold hover:to-gold-light hover:text-ink hover:shadow-[0_0_25px_rgba(188,78,34,0.3)]"
                >
                  <social.icon size={18} />
                </a>
              ))}
            </div>
          </div>

          {columns.map((column) => (
            <div
              key={column.title}
              className="lg:col-span-2"
            >
              {/* Footer column titles sit one level below the page's H2
                  section headings (H3), so the document outline never skips
                  a level. */}
              <h3 className="mb-6 text-xs font-semibold tracking-[0.24em] text-gold uppercase">
                {column.title}
              </h3>
              <ul className="space-y-3.5">
                {column.links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      prefetch={link.href === "/account" ? false : undefined}
                      className="text-sm text-cream-dark/60 transition-colors duration-300 hover:text-gold"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      <div className="relative border-t border-white/[0.06]">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-5 px-6 py-8 text-xs text-cream-dark/30 sm:flex-row">
          <p>© {new Date().getFullYear()} Libaas. All rights reserved.</p>
          <div className="flex items-center gap-8">
            <Link href="/privacy-policy" className="transition-colors duration-300 hover:text-gold">
              Privacy Policy
            </Link>
            <Link href="/terms-of-service" className="transition-colors duration-300 hover:text-gold">
              Terms of Service
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
