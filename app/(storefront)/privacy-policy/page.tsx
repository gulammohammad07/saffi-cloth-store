import type { Metadata } from "next";
import Link from "next/link";
import { Shield, Lock, Eye, FileText, CheckCircle2 } from "lucide-react";

export const metadata: Metadata = {
  title: "Privacy Policy | Libaas Atelier",
  description:
    "Read the comprehensive privacy policy for Libaas. Learn how we protect your personal information, payments, and data.",
};

export default function PrivacyPolicyPage() {
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
            <Shield className="h-3.5 w-3.5" /> Legal & Transparency
          </span>
          <h1 className="mt-8 font-display text-4xl font-normal tracking-wide text-cream sm:text-6xl">
            Privacy <span className="bg-gradient-to-r from-gold via-[#E8B775] to-gold-light bg-clip-text text-transparent italic">Policy</span>
          </h1>
          <p className="mx-auto mt-4 max-w-xl text-xs tracking-wider text-cream-dark/50 uppercase">
            Last Updated: September 2026 &bull; Effective Immediately
          </p>
        </div>
      </section>

      {/* Document Body */}
      <section className="relative px-6 pb-28">
        <div className="mx-auto max-w-4xl space-y-12">
          {/* Summary Box */}
          <div className="rounded-2xl border border-gold/30 bg-[#181615] p-8">
            <h2 className="text-sm font-semibold tracking-wider text-gold uppercase">
              Our Privacy Commitment
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-cream-dark/80">
              At Libaas, we hold your trust with the same care we apply to our tailoring. We do not sell, rent, or trade your personal data to third-party advertisers. Your information is gathered exclusively to tailor your garments, process payments, and ensure timely doorstep delivery.
            </p>
          </div>

          {/* Section 1 */}
          <div className="space-y-4">
            <h2 className="font-display text-2xl font-medium text-cream">
              1. Information We Collect
            </h2>
            <div className="space-y-3 text-sm leading-relaxed text-cream-dark/75">
              <p>When you visit or purchase from our website, we may collect:</p>
              <ul className="list-disc pl-5 space-y-2">
                <li>
                  <strong className="text-cream">Personal Identification Details:</strong> Full name, email address, contact phone number, and physical delivery address.
                </li>
                <li>
                  <strong className="text-cream">Measurement & Sizing Data:</strong> Custom measurements or size preferences shared with our atelier for tailored sizing.
                </li>
                <li>
                  <strong className="text-cream">Transactional Data:</strong> Order records, payment mode, invoice amounts, and delivery tracking notes.
                </li>
                <li>
                  <strong className="text-cream">Device & Log Information:</strong> IP address, device model, operating system, and anonymous navigational browsing analytics to optimize website performance.
                </li>
              </ul>
            </div>
          </div>

          {/* Section 2 */}
          <div className="space-y-4">
            <h2 className="font-display text-2xl font-medium text-cream">
              2. How We Utilize Your Information
            </h2>
            <div className="space-y-3 text-sm leading-relaxed text-cream-dark/75">
              <p>Your details are used strictly for legitimate commercial and fulfillment purposes:</p>
              <ul className="list-disc pl-5 space-y-2">
                <li>Processing, packing, and dispatching your garments.</li>
                <li>Transmitting automated order confirmation, shipment status, and delivery OTP alerts via SMS, email, and WhatsApp.</li>
                <li>Facilitating doorstep size exchanges or processing return refunds.</li>
                <li>Responding promptly to customer service requests and styling consultations.</li>
                <li>Preventing fraudulent transactions and ensuring network integrity.</li>
              </ul>
            </div>
          </div>

          {/* Section 3 */}
          <div className="space-y-4">
            <h2 className="font-display text-2xl font-medium text-cream">
              3. Payment Security & 256-Bit Encryption
            </h2>
            <p className="text-sm leading-relaxed text-cream-dark/75">
              All payment transactions are processed through RBI-authorized and PCI-DSS Level 1 compliant payment gateways. We implement bank-grade 256-bit SSL encryption. Libaas never stores, logs, or views your complete credit/debit card numbers, CVV, or banking passwords on our servers.
            </p>
          </div>

          {/* Section 4 */}
          <div className="space-y-4">
            <h2 className="font-display text-2xl font-medium text-cream">
              4. Third-Party Disclosures
            </h2>
            <p className="text-sm leading-relaxed text-cream-dark/75">
              We disclose your data only to trusted operational partners strictly necessary for executing your order:
            </p>
            <ul className="list-disc pl-5 space-y-2 text-sm text-cream-dark/75">
              <li>
                <strong className="text-cream">Logistics Partners:</strong> Bluedart, Delhivery, and DTDC receive your name, address, and phone number for delivery navigation.
              </li>
              <li>
                <strong className="text-cream">Communication Providers:</strong> Secure SMS/WhatsApp gateways for transmitting tracking updates.
              </li>
              <li>
                <strong className="text-cream">Statutory Authorities:</strong> Only when legally required by law enforcement or judicial summons.
              </li>
            </ul>
          </div>

          {/* Section 5 */}
          <div className="space-y-4">
            <h2 className="font-display text-2xl font-medium text-cream">
              5. Cookies & Tracking
            </h2>
            <p className="text-sm leading-relaxed text-cream-dark/75">
              We employ essential session cookies to remember the contents of your shopping bag, persist your authentication session, and analyze aggregated website speed. You can disable cookies in your browser settings, though certain storefront features like persistent cart drawers may require them.
            </p>
          </div>

          {/* Section 6 */}
          <div className="space-y-4">
            <h2 className="font-display text-2xl font-medium text-cream">
              6. Your Rights & Data Deletion
            </h2>
            <p className="text-sm leading-relaxed text-cream-dark/75">
              Under Indian data protection laws and international standards, you hold the right to review, update, or request the permanent deletion of your customer profile. To exercise these rights, email us at <a href="mailto:privacy@libaas.com" className="text-gold underline">privacy@libaas.com</a>.
            </p>
          </div>

          {/* Section 7 */}
          <div className="rounded-2xl border border-white/[0.08] bg-[#181615] p-6 space-y-2">
            <h3 className="text-base font-semibold text-cream">Grievance Redressal Officer</h3>
            <p className="text-xs text-cream-dark/70 leading-relaxed">
              In accordance with Information Technology Act 2000 and rules made thereunder:
            </p>
            <p className="text-xs text-cream-dark/80">
              <strong className="text-cream">Designation:</strong> Data Grievance Officer, Libaas Atelier<br />
              <strong className="text-cream">Address:</strong> Mathuradas Mills Compound, Lower Parel, Mumbai 400013, India<br />
              <strong className="text-cream">Email:</strong> grievance@libaas.com
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
