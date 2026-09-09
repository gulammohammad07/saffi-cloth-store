"use client";

import { useState, useTransition, useRef } from "react";
import {
  upsertBannerAction,
  type BannerActionState,
} from "@/lib/actions/banner.actions";
import ImageUploader, {
  type ImageValue,
} from "@/components/admin/ImageUploader";

const initialState: BannerActionState = {
  success: false,
};

export type BannerFormInitial = {
  title: string | null;
  subtitle: string | null;
  description: string | null;
  desktopImageUrl: string;
  desktopImagePublicId: string | null;
  tabletImageUrl: string | null;
  tabletImagePublicId: string | null;
  mobileImageUrl: string | null;
  mobileImagePublicId: string | null;
  linkUrl: string | null;
  isActive: boolean;
};

type BannerFormProps = {
  section: string;
  title: string;
  description: string;
  initial?: BannerFormInitial | null;
};

export default function BannerForm({
  section,
  title,
  description,
  initial,
}: BannerFormProps) {
  const [state, setState] = useState<BannerActionState>(initialState);
  const [pending, startTransition] = useTransition();
  const [desktopImage, setDesktopImage] = useState<ImageValue>({
    url: initial?.desktopImageUrl ?? "",
    publicId: initial?.desktopImagePublicId ?? null,
  });
  const [tabletImage, setTabletImage] = useState<ImageValue>({
    url: initial?.tabletImageUrl ?? "",
    publicId: initial?.tabletImagePublicId ?? null,
  });
  const [mobileImage, setMobileImage] = useState<ImageValue>({
    url: initial?.mobileImageUrl ?? "",
    publicId: initial?.mobileImagePublicId ?? null,
  });
  const formRef = useRef<HTMLFormElement>(null);

  const resetForm = () => {
    setState(initialState);
    setDesktopImage({ url: initial?.desktopImageUrl ?? "", publicId: initial?.desktopImagePublicId ?? null });
    setTabletImage({ url: initial?.tabletImageUrl ?? "", publicId: initial?.tabletImagePublicId ?? null });
    setMobileImage({ url: initial?.mobileImageUrl ?? "", publicId: initial?.mobileImagePublicId ?? null });
    formRef.current?.reset();
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    startTransition(async () => {
      const result = await upsertBannerAction(section, initialState, formData);
      setState(result);
      if (result.success) {
        resetForm();
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
        <h2 className="text-2xl font-semibold">{title}</h2>
        <p className="text-sm text-gray-500">{description}</p>
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
          <label className="mb-2 block font-medium">Title</label>
          <input
            name="title"
            defaultValue={initial?.title ?? ""}
            className="w-full rounded-lg border p-3"
            placeholder="New Season Drop"
          />
        </div>

        <div>
          <label className="mb-2 block font-medium">Subtitle</label>
          <input
            name="subtitle"
            defaultValue={initial?.subtitle ?? ""}
            className="w-full rounded-lg border p-3"
            placeholder="Where Style Meets Comfort"
          />
        </div>

        <div className="md:col-span-2">
          <label className="mb-2 block font-medium">Description</label>
          <textarea
            name="description"
            defaultValue={initial?.description ?? ""}
            className="w-full rounded-lg border p-3"
            rows={3}
            placeholder="Premium clothing for men, women and kids..."
          />
        </div>

        <div className="md:col-span-2">
          <label className="mb-2 block font-medium">Link URL</label>
          <input
            name="linkUrl"
            type="url"
            defaultValue={initial?.linkUrl ?? ""}
            className="w-full rounded-lg border p-3"
            placeholder="/shop"
          />
        </div>
      </div>

      <div className="mt-6 grid gap-6 md:grid-cols-3">
        <div>
          <label className="mb-2 block font-medium">Desktop Banner</label>
          <ImageUploader
            value={desktopImage}
            onChange={setDesktopImage}
            label="Desktop image"
          />
          <input type="hidden" name="desktopImageUrl" value={desktopImage.url} />
          <input type="hidden" name="desktopImagePublicId" value={desktopImage.publicId ?? ""} />
          {state.errors?.desktopImageUrl && (
            <p className="mt-1 text-sm text-red-600">
              {state.errors.desktopImageUrl[0]}
            </p>
          )}
        </div>

        <div>
          <label className="mb-2 block font-medium">Tablet Banner</label>
          <ImageUploader
            value={tabletImage}
            onChange={setTabletImage}
            label="Tablet image"
          />
          <input type="hidden" name="tabletImageUrl" value={tabletImage.url} />
          <input type="hidden" name="tabletImagePublicId" value={tabletImage.publicId ?? ""} />
          {state.errors?.tabletImageUrl && (
            <p className="mt-1 text-sm text-red-600">
              {state.errors.tabletImageUrl[0]}
            </p>
          )}
        </div>

        <div>
          <label className="mb-2 block font-medium">Mobile Banner</label>
          <ImageUploader
            value={mobileImage}
            onChange={setMobileImage}
            label="Mobile image"
          />
          <input type="hidden" name="mobileImageUrl" value={mobileImage.url} />
          <input type="hidden" name="mobileImagePublicId" value={mobileImage.publicId ?? ""} />
          {state.errors?.mobileImageUrl && (
            <p className="mt-1 text-sm text-red-600">
              {state.errors.mobileImageUrl[0]}
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
        {pending ? "Saving..." : "Save Banner"}
      </button>
    </form>
  );
}
