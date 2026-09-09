"use client";

import { useState, useTransition, useRef } from "react";
import {
  createCategory,
  updateCategory,
  type CategoryActionState,
} from "@/app/admin/categories/actions";
import ImageUploader, { type ImageValue } from "@/components/admin/ImageUploader";

const initialState: CategoryActionState = {
  success: false,
};

export type CategoryFormInitial = {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  imageUrl: string | null;
  imagePublicId: string | null;
  isActive: boolean;
};

type CategoryFormProps = {
  initial?: CategoryFormInitial | null;
  onSuccess?: () => void;
};

export default function CategoryForm({ initial, onSuccess }: CategoryFormProps) {
  const [state, setState] = useState<CategoryActionState>(initialState);
  const [pending, startTransition] = useTransition();
  const [image, setImage] = useState<ImageValue>({
    url: initial?.imageUrl ?? "",
    publicId: initial?.imagePublicId ?? null,
  });
  const formRef = useRef<HTMLFormElement>(null);

  const resetForm = () => {
    setState(initialState);
    setImage({
      url: initial?.imageUrl ?? "",
      publicId: initial?.imagePublicId ?? null,
    });
    formRef.current?.reset();
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    startTransition(async () => {
      const result = initial
        ? await updateCategory(initial.id, initialState, formData)
        : await createCategory(initialState, formData);
      setState(result);
      if (result.success) {
        resetForm();
        onSuccess?.();
      }
    });
  };

  return (
    <form
      ref={formRef}
      onSubmit={handleSubmit}
      className="rounded-2xl border bg-white p-6 shadow-sm"
    >
      <div className="mb-6">
        <h2 className="text-2xl font-semibold">
          {initial ? "Edit Category" : "Create Category"}
        </h2>
        <p className="text-sm text-gray-500">
          {initial
            ? "Update category details and image."
            : "Add a new product category with an image."}
        </p>
      </div>

      {state.message && (
        <p
          className={`mb-4 text-sm ${
            state.success ? "text-green-600" : "text-red-600"
          }`}
        >
          {state.message}
        </p>
      )}

      <div className="grid gap-6 md:grid-cols-2">
        <div>
          <label className="mb-2 block font-medium">Category Name</label>
          <input
            name="name"
            defaultValue={initial?.name ?? ""}
            className="w-full rounded-lg border p-3"
            placeholder="Kurtas"
            required
          />
          {state.errors?.name && (
            <p className="mt-1 text-sm text-red-600">{state.errors.name[0]}</p>
          )}
        </div>

        <div>
          <label className="mb-2 block font-medium">Slug</label>
          <input
            name="slug"
            defaultValue={initial?.slug ?? ""}
            className="w-full rounded-lg border p-3"
            placeholder="kurtas"
            required
          />
          {state.errors?.slug && (
            <p className="mt-1 text-sm text-red-600">{state.errors.slug[0]}</p>
          )}
        </div>

        <div className="md:col-span-2">
          <label className="mb-2 block font-medium">Description</label>
          <textarea
            name="description"
            defaultValue={initial?.description ?? ""}
            className="w-full rounded-lg border p-3"
            rows={3}
            placeholder="Men's everyday styles"
          />
          {state.errors?.description && (
            <p className="mt-1 text-sm text-red-600">
              {state.errors.description[0]}
            </p>
          )}
        </div>

        <div className="md:col-span-2">
          <label className="mb-2 block font-medium">Category Image</label>
          <ImageUploader value={image} onChange={setImage} label="Category image" />
          <input type="hidden" name="imageUrl" value={image.url} />
          <input type="hidden" name="imagePublicId" value={image.publicId ?? ""} />
          {state.errors?.imageUrl && (
            <p className="mt-1 text-sm text-red-600">
              {state.errors.imageUrl[0]}
            </p>
          )}
        </div>
      </div>

      <label className="mt-6 flex items-center gap-2 text-sm font-medium">
        <input
          type="checkbox"
          name="isActive"
          defaultChecked={initial?.isActive ?? true}
          className="h-4 w-4"
        />
        Active (shown on the storefront)
      </label>

      <button
        type="submit"
        disabled={pending}
        className="mt-6 rounded-xl bg-black px-8 py-3 text-white hover:bg-zinc-800 disabled:opacity-50"
      >
        {pending ? "Saving..." : initial ? "Update Category" : "Create Category"}
      </button>
    </form>
  );
}
