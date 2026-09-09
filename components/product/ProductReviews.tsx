"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { m as motion } from "framer-motion";
import { Loader2, Star } from "lucide-react";
import type { Product } from "@/lib/data/products";
import {
  getProductReviewAggregateAction,
  submitReviewAction,
  type ReviewAggregate,
} from "@/lib/actions/review.actions";
import { useAuth } from "@/lib/store/auth-context";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

const REVIEWERS = [
  { name: "Aarav S.", location: "Mumbai" },
  { name: "Meera P.", location: "Delhi" },
  { name: "Kabir M.", location: "Bengaluru" },
  { name: "Ishita R.", location: "Pune" },
  { name: "Vihaan K.", location: "Hyderabad" },
  { name: "Ananya T.", location: "Chennai" },
];

const COMMENTS = [
  "Absolutely stunning — lasts the whole day and evolves beautifully on the skin.",
  "The quality is remarkable. It smells far more expensive than it costs.",
  "Received so many compliments. My new signature scent, no question.",
  "Rich, layered and elegant. The delivery and packaging were top-notch too.",
  "Subtle at first, then opens into something truly special. Worth every rupee.",
  "The quality is outstanding. The projection is outstanding.",
];

const ZERO_DISTRIBUTION = [5, 4, 3, 2, 1].map((stars) => ({
  stars,
  percent: 0,
}));

// Sample reviews fill a brand-new product's tab so it never looks empty. They
// are placeholder content: no verified badge, clearly labelled as samples.
function buildSeedReviews(product: Product) {
  const seed = product.id.split("").reduce((a, c) => a + c.charCodeAt(0), 0);
  return REVIEWERS.map((reviewer, i) => {
    const rating = product.rating >= 4.8 ? 5 : product.rating >= 4.5 ? 4 : 4;
    return {
      key: `seed-${i}`,
      name: reviewer.name,
      location: reviewer.location,
      rating,
      comment: COMMENTS[(seed + i) % COMMENTS.length],
      date: `${10 + ((seed + i) % 9)} ${["Jan", "Feb", "Mar", "Apr", "May", "Jun"][i % 6]} 2026`,
      verified: false,
      sample: true,
    };
  }).slice(0, 4);
}

function formatDate(iso: string) {
  try {
    return new Date(iso).toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  } catch {
    return "";
  }
}

type DisplayReview = {
  key: string;
  name: string;
  location: string;
  rating: number;
  comment: string;
  date: string;
  verified: boolean;
  sample: boolean;
};

export default function ProductReviews({
  product,
  aggregate,
  onAggregateChange,
}: {
  product: Product;
  aggregate: ReviewAggregate | null;
  onAggregateChange: (aggregate: ReviewAggregate) => void;
}) {
  const router = useRouter();
  const { user, status } = useAuth();
  const [showForm, setShowForm] = useState(false);
  const [userRating, setUserRating] = useState(5);
  const [comment, setComment] = useState("");
  const [submitting, setSubmitting] = useState(false);

  // Keep the aggregate fresh whenever the tab opens.
  useEffect(() => {
    let active = true;
    getProductReviewAggregateAction(product.id).then((next) => {
      if (active) onAggregateChange(next);
    });
    return () => {
      active = false;
    };
  }, [product.id, onAggregateChange]);

  const realReviews =
    aggregate && aggregate.reviews.length > 0 ? aggregate.reviews : null;
  const displayReviews: DisplayReview[] = realReviews
    ? realReviews.map((review) => ({
        key: review.id,
        name: review.name,
        location: "Verified buyer",
        rating: review.rating,
        comment: review.comment,
        date: formatDate(review.createdAt),
        verified: review.verified,
        sample: false,
      }))
    : buildSeedReviews(product);

  const average = aggregate?.average ?? product.rating;
  const count = aggregate?.count ?? product.reviewCount;
  const verifiedCount = aggregate?.verifiedCount ?? 0;
  const distribution = aggregate?.distribution ?? ZERO_DISTRIBUTION;

  const handleSubmit = async () => {
    if (status === "loading") return;
    if (!user) {
      router.push(`/sign-in?next=/product/${product.slug}`);
      return;
    }
    setSubmitting(true);
    const result = await submitReviewAction({
      productId: product.id,
      rating: userRating,
      comment,
    });
    setSubmitting(false);

    if (!result.success) {
      toast.error(result.message ?? "Could not submit your review.");
      return;
    }

    toast.success(result.message);
    setShowForm(false);
    setUserRating(5);
    setComment("");
    if (result.aggregate) onAggregateChange(result.aggregate);
    // Server-side: cards and the product page recompute their ratings.
    router.refresh();
  };

  return (
    <div className="grid gap-12 lg:grid-cols-[320px_1fr]">
      {/* Summary */}
      <div>
        <div className="rounded-3xl border border-[#1C1A17]/10 bg-white p-8 text-center">
          <p className="font-display text-6xl font-semibold text-ink">
            {average}
          </p>
          <div className="mt-2 flex justify-center gap-1">
            {Array.from({ length: 5 }).map((_, i) => (
              <Star
                key={i}
                size={16}
                className={
                  i < Math.round(average)
                    ? "fill-gold text-gold"
                    : "text-ink/30"
                }
              />
            ))}
          </div>
          <p className="mt-2 text-sm text-ink/60">
            {count} reviews
            {verifiedCount > 0 && (
              <>
                {" "}
                • <span className="text-gold">{verifiedCount} verified</span>
              </>
            )}
          </p>

          <div className="mt-6 space-y-2">
            {distribution.map((d) => (
              <div key={d.stars} className="flex items-center gap-3">
                <span className="w-8 text-right text-xs text-ink/60">
                  {d.stars}★
                </span>
                <div className="h-2 flex-1 overflow-hidden rounded-full bg-[#1C1A17]/10">
                  <div
                    className="h-full rounded-full bg-gold"
                    style={{ width: `${d.percent}%` }}
                  />
                </div>
                <span className="w-8 text-xs text-ink/60">
                  {d.percent}%
                </span>
              </div>
            ))}
          </div>
        </div>

        <button
          type="button"
          onClick={() => {
            if (!user) {
              router.push(`/sign-in?next=/product/${product.slug}`);
              return;
            }
            setShowForm((s) => !s);
          }}
          className="mt-4 w-full rounded-full bg-[#1C1A17] py-3.5 text-sm font-medium text-white transition-colors hover:bg-gold"
        >
          Write a Review
        </button>

        {showForm && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-4 rounded-2xl border border-[#1C1A17]/10 bg-white p-6"
          >
            <p className="mb-3 text-sm font-medium">Your rating</p>
            <div className="mb-4 flex gap-1">
              {Array.from({ length: 5 }).map((_, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => setUserRating(i + 1)}
                  aria-label={`Rate ${i + 1} stars`}
                >
                  <Star
                    size={22}
                    className={cn(
                      "transition-colors",
                      i < userRating
                        ? "fill-gold text-gold"
                        : "text-ink/30",
                    )}
                  />
                </button>
              ))}
            </div>
            <textarea
              rows={3}
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Share your experience..."
              className="w-full rounded-xl border border-[#1C1A17]/15 p-3 text-sm focus:border-gold focus:outline-none"
            />
            <button
              type="button"
              disabled={submitting}
              onClick={handleSubmit}
              className="mt-3 flex items-center gap-2 rounded-full bg-gold px-6 py-2.5 text-sm font-medium text-white transition-colors hover:bg-[#1C1A17] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {submitting && <Loader2 size={14} className="animate-spin" />}
              {submitting ? "Submitting…" : "Submit Review"}
            </button>
          </motion.div>
        )}
      </div>

      {/* Review list */}
      <div className="space-y-6">
        {displayReviews.map((review, index) => (
          <motion.div
            key={review.key}
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: index * 0.08 }}
            className="rounded-2xl border border-[#1C1A17]/10 bg-white p-6"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#1C1A17] font-display text-base text-gold">
                  {review.name.charAt(0)}
                </div>
                <div>
                  <p className="text-sm font-semibold text-ink">
                    {review.name}
                  </p>
                  <p className="text-xs text-ink/60">
                    {review.location} • {review.date}
                  </p>
                </div>
              </div>
              <div className="flex gap-0.5">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    size={13}
                    className={
                      i < review.rating
                        ? "fill-gold text-gold"
                        : "text-ink/30"
                    }
                  />
                ))}
              </div>
            </div>

            <p className="mt-4 text-sm leading-relaxed text-ink/60">
              &ldquo;{review.comment}&rdquo;
            </p>

            {review.verified && (
              <p className="mt-3 text-xs font-medium tracking-wider text-gold uppercase">
                ✓ Verified Purchase
              </p>
            )}
            {review.sample && (
              <p className="mt-3 text-xs font-medium tracking-wider text-mute uppercase">
                Sample review
              </p>
            )}
          </motion.div>
        ))}
      </div>
    </div>
  );
}