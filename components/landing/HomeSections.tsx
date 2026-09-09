"use client";

import dynamic from "next/dynamic";
import type { Product } from "@/lib/data/products";
import type { StorefrontCategory } from "@/lib/services/storefront-data";
import LazyMount from "@/components/landing/LazyMount";
import SectionSkeleton from "@/components/landing/SectionSkeleton";

const CategoryShowcase = dynamic(
  () => import("@/components/landing/CategoryShowcase"),
  { ssr: false },
);

const BestSellers = dynamic(
  () => import("@/components/landing/BestSellers"),
  { ssr: false },
);

// const WhyChoose = dynamic(() => import("@/components/landing/WhyChoose"), {
//   ssr: false,
// });

// const Testimonials = dynamic(
//   () => import("@/components/landing/Testimonials"),
//   { ssr: false },
// );

// const BrandStory = dynamic(() => import("@/components/landing/BrandStory"), {
//   ssr: false,
// });

type HomeSectionsProps = {
  products: Product[];
  categories: StorefrontCategory[];
};

export default function HomeSections({
  products,
  categories,
}: HomeSectionsProps) {
  return (
    <>
      <LazyMount
        fallback={
          <SectionSkeleton
            eyebrow="The Collection"
            title="Shop by Category"
            description="Curated pieces across Men, Women & Kids. Find the style that speaks to you."
            className="bg-[#F4EFE6]"
            style={{ minHeight: 680 }}
          />
        }
      >
        <CategoryShowcase categories={categories} />
      </LazyMount>

      <LazyMount
        fallback={
          <SectionSkeleton
            eyebrow="Most Loved"
            title="Best Sellers"
            description="The products our clients return for, again and again."
            className="bg-[#F4EFE6]"
            style={{ minHeight: 820 }}
          />
        }
      >
        <BestSellers products={products} />
      </LazyMount>

      {/* <LazyMount
        fallback={
          <SectionSkeleton
            eyebrow="The MD Difference"
            title="Why Choose Libaas"
            description="More than clothing — a promise of quality, fit and obsession with detail."
            className="bg-[#F4EFE6]"
            style={{ minHeight: 1100 }}
          />
        }
      >
        <WhyChoose />
      </LazyMount> */}

      {/* <LazyMount
        fallback={
          <SectionSkeleton
            eyebrow="Word of Mouth"
            title="Loved by Our Customers"
            description="Real reviews from clients who made Libaas their signature."
            className="bg-[#E9E1D3]"
            style={{ minHeight: 660 }}
          />
        }
      >
        <Testimonials />
      </LazyMount> */}

      {/* <LazyMount
        fallback={
          <SectionSkeleton
            eyebrow="Our Story"
            title="Clothing, the way it was meant to be"
            className="bg-[#F4EFE6]"
            style={{ minHeight: 1240 }}
          />
        }
      >
        <BrandStory banner={storyBanner} />
      </LazyMount> */}
    </>
  );
}
