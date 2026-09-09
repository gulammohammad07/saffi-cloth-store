"use client";

import { useRef, useTransition } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { createBrandAction } from "@/lib/actions/brand.actions";

export default function BrandForm() {
  const router = useRouter();
  const formRef = useRef<HTMLFormElement>(null);
  const [pending, startTransition] = useTransition();

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    startTransition(async () => {
      await createBrandAction(formData);
      formRef.current?.reset();
      toast.success("Brand created successfully.");
      router.refresh();
    });
  };

  return (
    <form
      ref={formRef}
      onSubmit={handleSubmit}
      className="rounded-2xl border bg-white p-6 shadow-sm"
    >
      <h2 className="mb-6 text-2xl font-semibold">Add Brand</h2>

      <div className="grid gap-5 md:grid-cols-2">
        <input
          name="name"
          placeholder="Libaas"
          required
          className="rounded-lg border p-3"
        />

        <input
          name="slug"
          placeholder="libaas"
          required
          className="rounded-lg border p-3"
        />
      </div>

      <button
        type="submit"
        disabled={pending}
        className="mt-5 rounded-xl bg-black px-6 py-3 text-white disabled:opacity-50"
      >
        {pending ? "Saving..." : "Save Brand"}
      </button>
    </form>
  );
}
