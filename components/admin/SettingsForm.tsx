"use client";

import { useState, useTransition } from "react";
import { toast } from "sonner";
import {
  updateStoreSettingsAction,
  type UpdateSettingsResult,
} from "@/lib/actions/settings.actions";
import type { StoreSettingsDTO } from "@/lib/services/settings.service";
import ImageUploader, { type ImageValue } from "@/components/admin/ImageUploader";

const initialState: UpdateSettingsResult = { success: false };

const inputClass =
  "w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm focus:border-gold focus:ring-2 focus:ring-gold/20 focus:outline-none";

export default function SettingsForm({
  settings,
}: {
  settings: StoreSettingsDTO;
}) {
  const [state, setState] = useState<UpdateSettingsResult>(initialState);
  const [pending, startTransition] = useTransition();
  const [navbarLogo, setNavbarLogo] = useState<ImageValue>({ url: settings.navbarLogoUrl ?? "", publicId: null });

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    startTransition(async () => {
      const result = await updateStoreSettingsAction(initialState, formData);
      setState(result);
      if (result.success) {
        toast.success(result.message ?? "Settings saved.");
      }
    });
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="w-full max-w-3xl rounded-2xl border bg-white p-4 shadow-sm sm:p-6"
      suppressHydrationWarning
    >
      <div className="grid gap-5 md:grid-cols-2">
        <div>
          <label htmlFor="navbarTitle" className="mb-2 block font-medium">
            Navbar Title <span className="text-sm font-normal text-gray-500">(optional)</span>
          </label>
          <input id="navbarTitle" name="navbarTitle" defaultValue={settings.navbarTitle} className={inputClass} placeholder="Libaas" />
          {state.errors?.navbarTitle && <p className="mt-1 text-sm text-red-600">{state.errors.navbarTitle}</p>}
        </div>
        <div>
          <label htmlFor="storeName" className="mb-2 block font-medium">
            Store Name <span className="text-red-500">*</span>
          </label>
          <input
            id="storeName"
            name="storeName"
            required
            defaultValue={settings.storeName}
            className={inputClass}
          />
          {state.errors?.storeName && (
            <p className="mt-1 text-sm text-red-600">{state.errors.storeName}</p>
          )}
        </div>

        <div>
          <label htmlFor="currency" className="mb-2 block font-medium">
            Currency <span className="text-red-500">*</span>
          </label>
          <input
            id="currency"
            name="currency"
            required
            defaultValue={settings.currency}
            className={inputClass}
            placeholder="INR"
          />
          {state.errors?.currency && (
            <p className="mt-1 text-sm text-red-600">{state.errors.currency}</p>
          )}
        </div>

        <div>
          <label htmlFor="supportEmail" className="mb-2 block font-medium">
            Support Email <span className="text-red-500">*</span>
          </label>
          <input
            id="supportEmail"
            name="supportEmail"
            type="email"
            required
            defaultValue={settings.supportEmail}
            className={inputClass}
          />
          {state.errors?.supportEmail && (
            <p className="mt-1 text-sm text-red-600">
              {state.errors.supportEmail}
            </p>
          )}
        </div>

        <div>
          <label htmlFor="supportPhone" className="mb-2 block font-medium">
            Support Phone <span className="text-red-500">*</span>
          </label>
          <input
            id="supportPhone"
            name="supportPhone"
            type="tel"
            required
            defaultValue={settings.supportPhone}
            className={inputClass}
            placeholder="+91 98765 43210"
          />
          {state.errors?.supportPhone && (
            <p className="mt-1 text-sm text-red-600">
              {state.errors.supportPhone}
            </p>
          )}
        </div>

        <div className="md:col-span-2">
          <label htmlFor="address" className="mb-2 block font-medium">
            Store Address
          </label>
          <textarea
            id="address"
            name="address"
            rows={2}
            defaultValue={settings.address}
            className={inputClass}
          />
        </div>

        <div>
          <label htmlFor="freeShippingThreshold" className="mb-2 block font-medium">
            Free Shipping Threshold <span className="text-red-500">*</span>
          </label>
          <input
            id="freeShippingThreshold"
            name="freeShippingThreshold"
            type="number"
            min="0"
            step="1"
            required
            defaultValue={settings.freeShippingThreshold}
            className={inputClass}
          />
          {state.errors?.freeShippingThreshold && (
            <p className="mt-1 text-sm text-red-600">
              {state.errors.freeShippingThreshold}
            </p>
          )}
        </div>

        <div>
          <label htmlFor="shippingFee" className="mb-2 block font-medium">
            Shipping Fee <span className="text-red-500">*</span>
          </label>
          <input
            id="shippingFee"
            name="shippingFee"
            type="number"
            min="0"
            step="1"
            required
            defaultValue={settings.shippingFee}
            className={inputClass}
          />
          {state.errors?.shippingFee && (
            <p className="mt-1 text-sm text-red-600">{state.errors.shippingFee}</p>
          )}
        </div>
      </div>

      <div className="mt-5">
        <ImageUploader value={navbarLogo} onChange={setNavbarLogo} label="Navbar Logo (optional)" />
        <input type="hidden" name="navbarLogoUrl" value={navbarLogo.url} />
        <p className="mt-2 text-xs text-gray-500">Upload a logo, or leave empty to show the navbar title as text.</p>
      </div>

      {state.message && (
        <p
          className={`mt-4 text-sm ${
            state.success ? "text-green-600" : "text-red-600"
          }`}
        >
          {state.message}
        </p>
      )}

      <button
        type="submit"
        disabled={pending}
        className="mt-6 rounded-xl bg-black px-6 py-3 text-white disabled:opacity-50"
      >
        {pending ? "Saving..." : "Save Settings"}
      </button>
    </form>
  );
}
