"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { m as motion } from "framer-motion";
import { toast } from "sonner";
import {
  Home,
  Loader2,
  MapPin,
  Pencil,
  Plus,
  Trash2,
} from "lucide-react";
import PlaceAutocomplete from "@/components/checkout/PlaceAutocomplete";
import {
  COUNTRIES,
  citiesForCountry,
  statesForCountry,
} from "@/lib/data/geo";
import {
  deleteAddressAction,
  getAddressesAction,
  saveAddressAction,
  setDefaultAddressAction,
  type AddressDTO,
} from "@/lib/actions/address.actions";
import { useAuth } from "@/lib/store/auth-context";
import { cn } from "@/lib/utils";

type FormState = {
  id?: string;
  name: string;
  phone: string;
  street: string;
  country: string;
  city: string;
  state: string;
  pincode: string;
};

const EMPTY_FORM: FormState = {
  name: "",
  phone: "",
  street: "",
  country: "India",
  city: "",
  state: "",
  pincode: "",
};

export default function AddressesPage() {
  const { user, status } = useAuth();
  const [addresses, setAddresses] = useState<AddressDTO[] | null>(null);
  const [formOpen, setFormOpen] = useState(false);
  const [form, setForm] = useState<FormState>(EMPTY_FORM);
  const [saving, setSaving] = useState(false);
  const [busyId, setBusyId] = useState<string | null>(null);

  const load = async () => {
    setAddresses(await getAddressesAction());
  };

  useEffect(() => {
    if (status !== "authenticated") return;
    let active = true;
    getAddressesAction()
      .then((list) => {
        if (active) setAddresses(list);
      })
      .catch(() => {
        if (active) setAddresses([]);
      });
    return () => {
      active = false;
    };
  }, [status]);

  const startAdd = () => {
    setForm(EMPTY_FORM);
    setFormOpen(true);
  };

  const startEdit = (address: AddressDTO) => {
    setForm({
      id: address.id,
      name: address.name,
      phone: address.phone,
      street: address.street,
      country: address.country,
      city: address.city,
      state: address.state,
      pincode: address.pincode,
    });
    setFormOpen(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleSave = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (saving) return;
    setSaving(true);
    const result = await saveAddressAction(form);
    setSaving(false);

    if (!result.success) {
      toast.error(result.message ?? "Could not save the address.");
      return;
    }

    toast.success(result.message);
    setFormOpen(false);
    setForm(EMPTY_FORM);
    await load();
  };

  const handleDelete = async (address: AddressDTO) => {
    if (!window.confirm(`Delete the address for ${address.name}?`)) return;
    setBusyId(address.id);
    const result = await deleteAddressAction(address.id);
    setBusyId(null);
    toast.success(result.message);
    await load();
  };

  const handleSetDefault = async (address: AddressDTO) => {
    setBusyId(address.id);
    const result = await setDefaultAddressAction(address.id);
    setBusyId(null);
    toast.success(result.message);
    await load();
  };

  const inputClass =
    "w-full rounded-xl border border-[#1C1A17]/15 px-4 py-3 text-sm focus:border-gold focus:outline-none";

  if (status === "loading") {
    return (
      <div className="flex min-h-[60vh] items-center justify-center bg-[#F4EFE6] px-4">
        <div className="h-10 w-10 animate-spin rounded-full border-2 border-[#1C1A17]/15 border-t-gold" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center bg-[#F4EFE6] px-4 py-16">
        <div className="w-full max-w-md rounded-3xl border border-[#1C1A17]/10 bg-white p-8 text-center shadow-xl">
          <p className="text-sm text-ink/60">
            Please sign in to manage your addresses.
          </p>
          <Link
            href="/sign-in?next=/account/addresses"
            className="mt-6 inline-block rounded-full bg-[#1C1A17] px-8 py-3 text-sm font-semibold text-white transition-colors hover:bg-gold"
          >
            Sign in
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F4EFE6] px-4 py-14 sm:px-8">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mx-auto max-w-4xl"
      >
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <Link
              href="/account"
              className="text-xs font-medium tracking-wide text-ink/60 uppercase transition-colors hover:text-gold"
            >
              ← Back to account
            </Link>
            <h1 className="mt-3 flex items-center gap-3 font-display text-3xl font-medium text-ink">
              <MapPin size={28} className="text-gold" />
              Addresses
            </h1>
            <p className="mt-2 text-sm text-ink/60">
              Save your delivery addresses for a faster checkout.
            </p>
          </div>
          <button
            type="button"
            onClick={startAdd}
            className="inline-flex items-center justify-center gap-2 rounded-full bg-[#1C1A17] px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-gold"
          >
            <Plus size={16} />
            Add Address
          </button>
        </div>

        {/* Add / edit form */}
        {formOpen && (
          <motion.form
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            onSubmit={handleSave}
            className="mt-8 rounded-3xl border border-[#1C1A17]/10 bg-white p-8 shadow-xl"
          >
            <h2 className="font-display text-2xl font-medium text-ink">
              {form.id ? "Edit address" : "New address"}
            </h2>
            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              <input
                required
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                placeholder="Full name"
                className={inputClass}
              />
              <input
                required
                type="tel"
                value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
                placeholder="Phone number"
                className={inputClass}
              />
              <input
                required
                value={form.street}
                onChange={(e) => setForm({ ...form, street: e.target.value })}
                placeholder="Street address (house, building, area)"
                className={cn(inputClass, "sm:col-span-2")}
              />
              <div className="sm:col-span-2">
                <PlaceAutocomplete
                  name="country"
                  value={form.country}
                  onChange={(next) => {
                    setForm({ ...form, country: next, city: "", state: "" });
                  }}
                  options={COUNTRIES}
                  placeholder="Country"
                  required
                />
              </div>
              <PlaceAutocomplete
                name="city"
                value={form.city}
                onChange={(next) => setForm({ ...form, city: next })}
                options={citiesForCountry(form.country)}
                placeholder="City"
                required
              />
              <PlaceAutocomplete
                name="state"
                value={form.state}
                onChange={(next) => setForm({ ...form, state: next })}
                options={statesForCountry(form.country)}
                placeholder="State"
                required
              />
              <input
                required
                inputMode="numeric"
                pattern="[0-9]{4,10}"
                title="Enter a valid PIN code"
                value={form.pincode}
                onChange={(e) => setForm({ ...form, pincode: e.target.value })}
                placeholder="PIN code"
                className={cn(inputClass, "sm:col-span-2")}
              />
            </div>
            <div className="mt-6 flex flex-wrap gap-3">
              <button
                type="submit"
                disabled={saving}
                className="inline-flex items-center gap-2 rounded-full bg-[#1C1A17] px-7 py-3 text-sm font-semibold text-white transition-colors hover:bg-gold disabled:cursor-not-allowed disabled:opacity-60"
              >
                {saving && <Loader2 size={15} className="animate-spin" />}
                {saving ? "Saving…" : "Save address"}
              </button>
              <button
                type="button"
                onClick={() => setFormOpen(false)}
                className="rounded-full border border-[#1C1A17]/20 px-7 py-3 text-sm font-medium text-ink transition-colors hover:border-gold hover:text-gold"
              >
                Cancel
              </button>
            </div>
          </motion.form>
        )}

        {/* Address list */}
        <div className="mt-8 grid gap-6 sm:grid-cols-2">
          {addresses === null ? (
            <div className="flex items-center justify-center gap-3 rounded-3xl border border-[#1C1A17]/10 bg-white p-10 text-sm text-ink/60 sm:col-span-2">
              <Loader2 size={16} className="animate-spin text-gold" />
              Loading your addresses…
            </div>
          ) : addresses.length === 0 ? (
            <div className="rounded-3xl border border-dashed border-[#1C1A17]/20 bg-white p-10 text-center sm:col-span-2">
              <Home size={28} className="mx-auto text-gold" />
              <p className="mt-4 font-display text-xl font-medium text-ink">
                No saved addresses yet
              </p>
              <p className="mt-1.5 text-sm text-ink/60">
                Add one now and it will be ready at checkout.
              </p>
              <button
                type="button"
                onClick={startAdd}
                className="mt-6 inline-flex items-center gap-2 rounded-full bg-[#1C1A17] px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-gold"
              >
                <Plus size={16} />
                Add your first address
              </button>
            </div>
          ) : (
            addresses.map((address) => (
              <div
                key={address.id}
                className={cn(
                  "relative flex flex-col rounded-3xl border bg-white p-7 shadow-sm transition-all",
                  address.isDefault
                    ? "border-gold/50 shadow-[0_10px_30px_-12px_rgba(188,78,34,0.35)]"
                    : "border-[#1C1A17]/10 hover:shadow-md",
                )}
              >
                {address.isDefault && (
                  <span className="absolute -top-2.5 left-6 rounded-full bg-gold px-3 py-1 text-xs font-bold tracking-[0.14em] text-ink uppercase">
                    Default
                  </span>
                )}
                <p className="font-display text-base font-semibold text-ink">
                  {address.name}
                </p>
                <p className="mt-1 text-xs text-ink/60">{address.phone}</p>
                <p className="mt-3 text-sm leading-relaxed text-ink/60">
                  {address.street}
                  <br />
                  {address.city}, {address.state} — {address.pincode}
                  <br />
                  {address.country}
                </p>

                <div className="mt-5 flex flex-wrap gap-2 border-t border-[#1C1A17]/10 pt-4">
                  {!address.isDefault && (
                    <button
                      type="button"
                      disabled={busyId === address.id}
                      onClick={() => handleSetDefault(address)}
                      className="rounded-full bg-[#1C1A17] px-4 py-2 text-xs font-semibold text-white transition-colors hover:bg-gold disabled:opacity-60"
                    >
                      Set as default
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={() => startEdit(address)}
                    className="inline-flex items-center gap-1.5 rounded-full border border-[#1C1A17]/20 px-4 py-2 text-xs font-medium text-ink transition-colors hover:border-gold hover:text-gold"
                  >
                    <Pencil size={12} />
                    Edit
                  </button>
                  <button
                    type="button"
                    disabled={busyId === address.id}
                    onClick={() => handleDelete(address)}
                    className="inline-flex items-center gap-1.5 rounded-full border border-red-200 px-4 py-2 text-xs font-medium text-red-500 transition-colors hover:bg-red-50 disabled:opacity-60"
                  >
                    <Trash2 size={12} />
                    Delete
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </motion.div>
    </div>
  );
}