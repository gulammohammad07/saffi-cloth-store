import Link from "next/link";
import type { Product } from "@/lib/data/products";
import ProductCard from "@/components/product/ProductCard";
import SectionHeading from "@/components/landing/SectionHeading";

export default function NewArrivals({ products }: { products: Product[] }) {
  const arrivals = products.filter((p) => p.badge === "New Arrival");

  return (
    <section className="bg-[#F3EEE5] py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-6">
        <SectionHeading
          eyebrow="Fresh From the Atelier"
          title="New Arrivals"
          description="The newest styles to land on our shelves — ready to wear."
        />

        <div className="grid grid-cols-1 gap-7 sm:grid-cols-2 lg:grid-cols-4">
          {arrivals.slice(0, 8).map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>

        <div className="mt-16 text-center">
          <Link
            href="/shop?sort=newest"
            className="inline-flex items-center gap-3 rounded-full border border-gold/40 bg-white/80 px-10 py-4 text-xs font-semibold tracking-[0.2em] text-ink/60 uppercase backdrop-blur-xl transition-all duration-700 hover:border-gold hover:bg-gold hover:text-ink hover:shadow-[0_20px_50px_-15px_rgba(188,78,34,0.5)]"
          >
            View All Clothing
          </Link>
        </div>
      </div>
    </section>
  );
}
