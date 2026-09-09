import type { Metadata } from "next";
import Link from "next/link";
import { FileText, Scale, ShieldAlert, CheckCircle2 } from "lucide-react";

export const metadata: Metadata = {
  title: "Terms of Service | Libaas Atelier",
  description:
    "Review the terms and conditions governing purchases, website access, and services provided by Libaas.",
};

export default function TermsOfServicePage() {
  return (
    <div className="min-h-screen bg-[#131110] text-[#FAF7F2]">
      {/* Background Ambience */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden opacity-30">
        <div className="absolute top-20 right-1/4 h-[500px] w-[500px] rounded-full bg-[radial-gradient(circle,rgba(201,148,77,0.12),transparent_70%)] blur-3xl" />
      </div>

      {/* Hero */}
      <section className="relative px-6 pt-32 pb-16 text-center sm:pt-40 sm:pb-20">
        <div className="mx-auto max-w-3xl">
          <span className="inline-flex items-center gap-2 rounded-full border border-gold/30 bg-gold/10 px-4 py-1.5 text-xs font-semibold tracking-[0.24em] text-gold uppercase">
            <Scale className="h-3.5 w-3.5" /> Commercial Terms
          </span>
          <h1 className="mt-8 font-display text-4xl font-normal tracking-wide text-cream sm:text-6xl">
            Terms of <span className="bg-gradient-to-r from-gold via-[#E8B775] to-gold-light bg-clip-text text-transparent italic">Service</span>
          </h1>
          <p className="mx-auto mt-4 max-w-xl text-xs tracking-wider text-cream-dark/50 uppercase">
            Last Updated: September 2026 &bull; Effective for all patrons
          </p>
        </div>
      </section>

      {/* Terms Body */}
      <section className="relative px-6 pb-28">
        <div className="mx-auto max-w-4xl space-y-12">
          {/* Welcome Box */}
          <div className="rounded-2xl border border-gold/30 bg-[#181615] p-8">
            <h2 className="text-sm font-semibold tracking-wider text-gold uppercase">
              Notice of Acceptance
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-cream-dark/80">
              By accessing, browsing, or purchasing products from the Libaas storefront, you acknowledge that you have read, understood, and agree to be legally bound by these Terms of Service and our Privacy Policy. If you do not agree to these terms, please do not use our digital services.
            </p>
          </div>

          {/* Section 1 */}
          <div className="space-y-4">
            <h2 className="font-display text-2xl font-medium text-cream">
              1. Storefront Eligibility & Account Terms
            </h2>
            <div className="space-y-3 text-sm leading-relaxed text-cream-dark/75">
              <p>
                To place an order or maintain an account on our platform, you must be at least 18 years of age or possess legal parental consent. You are responsible for maintaining the confidentiality of your account credentials and password.
              </p>
              <p>
                Libaas reserves the right to refuse service, terminate accounts, or cancel orders at its discretion if unauthorized or fraudulent activity is detected.
              </p>
            </div>
          </div>

          {/* Section 2 */}
          <div className="space-y-4">
            <h2 className="font-display text-2xl font-medium text-cream">
              2. Product Accuracy, Natural Fabrics & Colors
            </h2>
            <div className="space-y-3 text-sm leading-relaxed text-cream-dark/75">
              <p>
                We strive to display the colors, weaves, and draping of our garments as accurately as possible. However, because our pieces are crafted from natural fibers (flax linen, handloom cotton, mulberry silk) and screen color calibrations vary across mobile and desktop displays, slight variations in shade and texture are intrinsic hallmarks of artisanal clothing.
              </p>
              <p>
                Handloom fabrics may feature minor slubs and organic variations; these are not manufacturing flaws but proof of handcraft authenticity.
              </p>
            </div>
          </div>

          {/* Section 3 */}
          <div className="space-y-4">
            <h2 className="font-display text-2xl font-medium text-cream">
              3. Pricing, Invoicing & Orders
            </h2>
            <div className="space-y-3 text-sm leading-relaxed text-cream-dark/75">
              <p>
                All prices listed are in Indian Rupees (INR) and inclusive of applicable Goods and Services Tax (GST). We reserve the right to revise catalog prices without prior notice. In the rare event an item is displayed at an incorrect price due to typographical error, we reserve the right to cancel the order and issue a full immediate refund.
              </p>
            </div>
          </div>

          {/* Section 4 */}
          <div className="space-y-4">
            <h2 className="font-display text-2xl font-medium text-cream">
              4. Shipping, Risk of Loss & Title
            </h2>
            <p className="text-sm leading-relaxed text-cream-dark/75">
              All shipments are insured during transit. Title and risk of loss pass to the customer upon verified delivery confirmation by our courier partners (via signature or OTP validation). For detailed delivery timelines, please review our <Link href="/shipping" className="text-gold underline">Shipping Policy</Link>.
            </p>
          </div>

          {/* Section 5 */}
          <div className="space-y-4">
            <h2 className="font-display text-2xl font-medium text-cream">
              5. Returns, Size Exchanges & Cancellations
            </h2>
            <p className="text-sm leading-relaxed text-cream-dark/75">
              Orders may be cancelled prior to dispatch by messaging our concierge. Doorstep returns and size exchanges are accepted within 7 calendar days of delivery in accordance with our <Link href="/returns" className="text-gold underline">Returns Policy</Link>. Bespoke custom garments cut to non-standard sizing are final sale.
            </p>
          </div>

          {/* Section 6 */}
          <div className="space-y-4">
            <h2 className="font-display text-2xl font-medium text-cream">
              6. Intellectual Property
            </h2>
            <p className="text-sm leading-relaxed text-cream-dark/75">
              All visual designs, typography, brand marks, photography, copy, software code, and silhouettes appearing on this website are the exclusive intellectual property of Libaas. Any reproduction, distribution, or commercial exploitation without written consent is strictly prohibited.
            </p>
          </div>

          {/* Section 7 */}
          <div className="space-y-4">
            <h2 className="font-display text-2xl font-medium text-cream">
              7. Governing Law & Jurisdiction
            </h2>
            <p className="text-sm leading-relaxed text-cream-dark/75">
              These Terms of Service shall be governed by and construed in accordance with the laws of the Republic of India. Any disputes arising in connection with these terms shall be subject to the exclusive jurisdiction of the competent courts in Mumbai, Maharashtra, India.
            </p>
          </div>

          {/* Legal Help */}
          <div className="rounded-2xl border border-white/[0.08] bg-[#181615] p-6 text-xs text-cream-dark/70">
            <p>
              Questions regarding these Terms of Service should be directed to our legal department at <a href="mailto:legal@libaas.com" className="text-gold underline">legal@libaas.com</a>.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
