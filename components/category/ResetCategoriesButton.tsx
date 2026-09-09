"use client";

import { useTransition } from "react";
import { toast } from "sonner";
import { resetCategories } from "@/app/admin/categories/actions";

export default function ResetCategoriesButton() {
  const [pending, startTransition] = useTransition();

  const handleClick = () => {
    startTransition(async () => {
      const result = await resetCategories();
      if (result.success) {
        toast.success(result.message ?? "Categories reset.");
      } else {
        toast.error(result.message ?? "Failed to reset categories.");
      }
    });
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={pending}
      className="rounded-full bg-gold px-6 py-2.5 text-sm font-semibold text-white shadow-[0_0_30px_rgba(188,78,34,0.35)] transition-all hover:scale-105 hover:shadow-[0_0_50px_rgba(188,78,34,0.55)] disabled:opacity-50"
    >
      {pending ? "Resetting..." : "Reset to clothing defaults"}
    </button>
  );
}
