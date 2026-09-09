"use client";

import { useState, useTransition, useRef } from "react";
import { useRouter } from "next/navigation";
import {
  createProductAction,
  type ProductActionState,
} from "@/lib/actions/product.actions";
import { createBrandAction } from "@/lib/actions/brand.actions";
import { toast } from "sonner";
import ImageUploader, {
  type ImageValue,
} from "@/components/admin/ImageUploader";
import GalleryUploader from "@/components/admin/GalleryUploader";
import VideoUploader, {
  type VideoValue,
} from "@/components/admin/VideoUploader";
import { generateSkuPreview, generateSlug } from "@/lib/utils";

const QUICK_NOTES = [
  "Cotton",
  "Linen",
  "Denim",
  "Silk",
  "Velvet",
  "Chiffon",
  "Jersey",
  "Satin",
  "Wool",
  "Georgette",
];

interface ProductFormProps {
  categories: {
    id: string;
    name: string;
  }[];

  brands: {
    id: string;
    name: string;
  }[];

  occasions: {
    id: string;
    name: string;
  }[];
}

const initialState: ProductActionState = {
  success: false,
};

export default function ProductForm({
  categories,
  brands,
  occasions,
}: ProductFormProps) {
  const router = useRouter();
  const [state, setState] = useState<ProductActionState>(initialState);
  const [pending, startTransition] = useTransition();
  const [notes, setNotes] = useState("");
  const [selectedOccasions, setSelectedOccasions] = useState<string[]>([]);
  const [image, setImage] = useState<ImageValue>({ url: "", publicId: null });
  const [video, setVideo] = useState<VideoValue>({ url: "", publicId: null });
  const [gallery, setGallery] = useState<ImageValue[]>([]);
  const [skuPreview, setSkuPreview] = useState("");
  const [showBrandForm, setShowBrandForm] = useState(false);
  const [newBrandName, setNewBrandName] = useState("");
  const [newBrandSlug, setNewBrandSlug] = useState("");
  const [brandPending, startBrandTransition] = useTransition();
  const formRef = useRef<HTMLFormElement>(null);
  const [productType, setProductType] = useState<"MEN" | "WOMEN" | "KIDS">("MEN");
  const [sizes, setSizes] = useState<{ size: string; price: string; salePrice: string; stock: string }[]>([]);

  const resetForm = () => {
    setState(initialState);
    setNotes("");
    setSelectedOccasions([]);
    setImage({ url: "", publicId: null });
    setVideo({ url: "", publicId: null });
    setGallery([]);
    setSkuPreview("");
    setShowBrandForm(false);
    setNewBrandName("");
    setNewBrandSlug("");
    setProductType("MEN");
    setSizes([]);
    formRef.current?.reset();
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    startTransition(async () => {
      const result = await createProductAction(initialState, formData);
      setState(result);
      if (result.success) {
        resetForm();
      }
    });
  };

  const handleCreateBrand = () => {
    if (!newBrandName.trim()) return;
    startBrandTransition(async () => {
      const fd = new FormData();
      fd.set("name", newBrandName.trim());
      fd.set("slug", newBrandSlug.trim() || generateSlug(newBrandName.trim()));
      const result = await createBrandAction(fd);
      if (result.success) {
        toast.success(result.message ?? "Brand created.");
        setNewBrandName("");
        setNewBrandSlug("");
        setShowBrandForm(false);
        router.refresh();
      } else {
        toast.error(result.message ?? "Failed to create brand.");
      }
    });
  };

  const updateSkuPreview = (name: string, brandId: string) => {
    const brand = brands.find((b) => b.id === brandId);
    const preview = generateSkuPreview(brand?.name ?? "", name);
    setSkuPreview(preview);
  };

  const toggleOccasion = (id: string) => {
    setSelectedOccasions((prev) =>
      prev.includes(id)
        ? prev.filter((occasionId) => occasionId !== id)
        : [...prev, id],
    );
  };

  const toggleNote = (note: string) => {
    setNotes((prev) => {
      const current = prev
        .split(",")
        .map((n) => n.trim())
        .filter(Boolean);
      const exists = current.some(
        (n) => n.toLowerCase() === note.toLowerCase(),
      );
      const next = exists
        ? current.filter((n) => n.toLowerCase() !== note.toLowerCase())
        : [...current, note];
      return next.join(", ");
    });
  };

  const addSize = () => {
    setSizes((prev) => [...prev, { size: "", price: "", salePrice: "", stock: "" }]);
  };

  const removeSize = (index: number) => {
    setSizes((prev) => prev.filter((_, i) => i !== index));
  };

  const updateSize = (index: number, field: "size" | "price" | "salePrice" | "stock", value: string) => {
    setSizes((prev) => prev.map((item, i) => (i === index ? { ...item, [field]: value } : item)));
  };

  return (
    <form
      ref={formRef}
      onSubmit={handleSubmit}
      className="rounded-2xl border bg-white p-6 shadow-sm"
    >
      <h2 className="mb-6 text-2xl font-semibold">Add Product</h2>

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
        {/* Product Name */}
        <div>
          <label className="mb-2 block font-medium">Product Name</label>

          <input
            name="name"
            className="w-full rounded-lg border p-3"
            placeholder="Signature Kurta"
            onChange={(e) => {
              const brandId = (e.currentTarget.form?.elements.namedItem("brandId") as HTMLSelectElement)?.value;
              updateSkuPreview(e.target.value, brandId || "");
            }}
          />

          {state.errors?.name && (
            <p className="mt-1 text-sm text-red-600">{state.errors.name[0]}</p>
          )}
        </div>

        {/* SKU */}
        <div>
          <label className="mb-2 block font-medium">SKU</label>
          <input
            type="text"
            value={skuPreview}
            readOnly
            placeholder="Auto-generated from brand + product name"
            className="w-full rounded-lg border border-dashed p-3 text-gray-500"
          />
          <p className="mt-1 text-xs text-gray-400">
            Auto-generated on save as BRAND-PRODUCT-01
          </p>
          <input type="hidden" name="sku" value={skuPreview} />
        </div>

        {/* Category */}
        <div>
          <label className="mb-2 block font-medium">Category</label>

          <select name="categoryId" className="w-full rounded-lg border p-3">
            <option value="">Select Category</option>

            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>

          {state.errors?.categoryId && (
            <p className="mt-1 text-sm text-red-600">
              {state.errors.categoryId[0]}
            </p>
          )}
        </div>

        {/* Brand */}
        <div>
          <label className="mb-2 block font-medium">Brand</label>

          <select
            name="brandId"
            className="w-full rounded-lg border p-3"
            onChange={(e) => {
              const name = (e.currentTarget.form?.elements.namedItem("name") as HTMLInputElement)?.value;
              updateSkuPreview(name, e.target.value);
            }}
          >
            <option value="">Select Brand</option>

            {brands.map((brand) => (
              <option key={brand.id} value={brand.id}>
                {brand.name}
              </option>
            ))}
          </select>

          {!showBrandForm ? (
            <button
              type="button"
              onClick={() => setShowBrandForm(true)}
              className="mt-2 text-sm font-medium text-ink underline underline-offset-4 hover:text-gold"
            >
              + Create new brand
            </button>
          ) : (
            <div className="mt-3 rounded-lg border border-dashed border-[#1C1A17]/20 bg-[#F4EFE6] p-3">
              <p className="mb-2 text-xs font-medium text-ink/60">
                Create a new brand and select it automatically.
              </p>
              <div className="flex flex-col gap-2 sm:flex-row">
                <input
                  value={newBrandName}
                  onChange={(e) => setNewBrandName(e.target.value)}
                  placeholder="Brand name"
                  className="flex-1 rounded-lg border border-[#1C1A17]/15 bg-white px-3 py-2 text-sm focus:border-gold focus:outline-none"
                />
                <input
                  value={newBrandSlug}
                  onChange={(e) => setNewBrandSlug(e.target.value)}
                  placeholder="slug (optional)"
                  className="flex-1 rounded-lg border border-[#1C1A17]/15 bg-white px-3 py-2 text-sm focus:border-gold focus:outline-none"
                />
                <button
                  type="button"
                  onClick={handleCreateBrand}
                  disabled={brandPending}
                  className="rounded-lg bg-[#1C1A17] px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-gold disabled:opacity-50"
                >
                  {brandPending ? "Creating..." : "Create"}
                </button>
              </div>
              <button
                type="button"
                onClick={() => setShowBrandForm(false)}
                className="mt-2 text-xs text-ink/60 hover:text-ink"
              >
                Cancel
              </button>
            </div>
          )}

          {state.errors?.brandId && (
            <p className="mt-1 text-sm text-red-600">
              {state.errors.brandId[0]}
            </p>
          )}
        </div>

        {/* Price */}
        <div>
          <label className="mb-2 block font-medium">Price</label>

          <input
            name="price"
            type="number"
            step="0.01"
            className="w-full rounded-lg border p-3"
          />

          {state.errors?.price && (
            <p className="mt-1 text-sm text-red-600">{state.errors.price[0]}</p>
          )}
        </div>

        {/* Sale Price */}
        <div>
          <label className="mb-2 block font-medium">Sale Price</label>

          <input
            name="salePrice"
            type="number"
            step="0.01"
            className="w-full rounded-lg border p-3"
          />

          {state.errors?.salePrice && (
            <p className="mt-1 text-sm text-red-600">
              {state.errors.salePrice[0]}
            </p>
          )}
        </div>

        {/* Stock */}
        <div>
          <label className="mb-2 block font-medium">Stock</label>

          <input
            name="stock"
            type="number"
            className="w-full rounded-lg border p-3"
          />

          {state.errors?.stock && (
            <p className="mt-1 text-sm text-red-600">{state.errors.stock[0]}</p>
          )}
        </div>

        {/* Colour */}
        <div>
          <label className="mb-2 block font-medium">Colour</label>

          <select name="volume" className="w-full rounded-lg border p-3">
            <option value="">Select Colour</option>
            <option value="Black">Black</option>
            <option value="White">White</option>
            <option value="Navy">Navy</option>
            <option value="Beige">Beige</option>
            <option value="Olive">Olive</option>
            <option value="Maroon">Maroon</option>
            <option value="Multi">Multi</option>
          </select>

          {state.errors?.volume && (
            <p className="mt-1 text-sm text-red-600">
              {state.errors.volume[0]}
            </p>
          )}
        </div>

        {/* Collection */}
        <div>
          <label className="mb-2 block font-medium">Collection</label>
          <select
            name="productType"
            value={productType}
            onChange={(e) => setProductType(e.target.value as "MEN" | "WOMEN" | "KIDS")}
            className="w-full rounded-lg border p-3"
          >
            <option value="MEN">Men</option>
            <option value="WOMEN">Women</option>
            <option value="KIDS">Kids</option>
          </select>
        </div>
      </div>

      {/* Sizes */}
      <div className="mt-6">
        <div className="mb-2 flex items-center justify-between">
          <label className="block font-medium">Sizes / Variants</label>
          <button
            type="button"
            onClick={addSize}
            className="text-sm font-medium text-ink underline underline-offset-4 hover:text-gold"
          >
            + Add Size
          </button>
        </div>
        <p className="mb-3 text-xs text-gray-500">
          Define custom sizes with their own regular price, sale price and stock.
        </p>

        {sizes.length === 0 ? (
          <p className="text-sm text-gray-500">No sizes added yet.</p>
        ) : (
          <div className="space-y-3">
            {sizes.map((sizeItem, index) => (
              <div key={index} className="grid gap-3 rounded-xl border border-[#1C1A17]/10 bg-[#F4EFE6] p-3 sm:grid-cols-[1.2fr_1fr_1fr_1fr_auto]">
                <div>
                  <input
                    type="text"
                    value={sizeItem.size}
                    onChange={(e) => updateSize(index, "size", e.target.value)}
                    placeholder="Size (e.g. M)"
                    className="w-full rounded-lg border p-2.5 text-sm"
                  />
                </div>
                <div>
                  <input
                    type="number"
                    value={sizeItem.price}
                    onChange={(e) => updateSize(index, "price", e.target.value)}
                    placeholder="Price"
                    step="0.01"
                    className="w-full rounded-lg border p-2.5 text-sm"
                  />
                </div>
                <div>
                  <input
                    type="number"
                    value={sizeItem.salePrice}
                    onChange={(e) => updateSize(index, "salePrice", e.target.value)}
                    placeholder="Sale price (optional)"
                    step="0.01"
                    className="w-full rounded-lg border p-2.5 text-sm"
                  />
                </div>
                <div>
                  <input
                    type="number"
                    value={sizeItem.stock}
                    onChange={(e) => updateSize(index, "stock", e.target.value)}
                    placeholder="Stock"
                    className="w-full rounded-lg border p-2.5 text-sm"
                  />
                </div>
                <div className="flex items-center justify-end">
                  <button
                    type="button"
                    onClick={() => removeSize(index)}
                    className="text-sm text-red-600 hover:text-red-700"
                  >
                    Remove
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
        <input
          type="hidden"
          name="sizes"
          value={JSON.stringify(
            sizes.map((s) => ({
              size: s.size,
              price: s.price === "" ? 0 : Number(s.price),
              salePrice: s.salePrice === "" ? null : Number(s.salePrice),
              stock: s.stock === "" ? 0 : Number(s.stock),
            })),
          )}
        />
      </div>

      {/* Notes */}
      <div className="mt-6">
        <label className="mb-2 block font-medium">
          Details / Tags{" "}
          <span className="text-sm font-normal text-gray-500">
            (comma separated — shown as key details on product pages)
          </span>
        </label>

        <input
          name="notes"
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          className="w-full rounded-lg border p-3"
          placeholder="Cotton, Denim, Silk, Velvet"
        />

        <div className="mt-3 flex flex-wrap gap-2">
          {QUICK_NOTES.map((note) => {
            const active = notes
              .toLowerCase()
              .split(",")
              .map((n) => n.trim())
              .includes(note.toLowerCase());

            return (
              <button
                key={note}
                type="button"
                onClick={() => toggleNote(note)}
                className={`rounded-full border px-3 py-1 text-sm transition-colors ${
                  active
                    ? "border-black bg-black text-white"
                    : "border-gray-300 text-gray-600 hover:border-black"
                }`}
              >
                {note}
              </button>
            );
          })}
        </div>
      </div>

      {/* Occasions */}
      <div className="mt-6">
        <label className="mb-2 block font-medium">
          Occasions{" "}
          <span className="text-sm font-normal text-gray-500">
            (select all that apply)
          </span>
        </label>

        {occasions.length === 0 ? (
          <p className="text-sm text-gray-500">
            No occasions yet. Create them in the{" "}
            <a href="/admin/occasions" className="underline">
              Occasions
            </a>{" "}
            section first.
          </p>
        ) : (
          <div className="flex flex-wrap gap-2">
            {occasions.map((occasion) => {
              const active = selectedOccasions.includes(occasion.id);

              return (
                <button
                  key={occasion.id}
                  type="button"
                  onClick={() => toggleOccasion(occasion.id)}
                  className={`rounded-full border px-3 py-1 text-sm transition-colors ${
                    active
                      ? "border-black bg-black text-white"
                      : "border-gray-300 text-gray-600 hover:border-black"
                  }`}
                >
                  {occasion.name}
                </button>
              );
            })}
          </div>
        )}

        {selectedOccasions.map((id) => (
          <input key={id} type="hidden" name="occasionIds" value={id} />
        ))}
      </div>

      {/* Description */}
      <div className="mt-6">
        <label className="mb-2 block font-medium">Description</label>

        <textarea
          name="description"
          rows={5}
          className="w-full rounded-lg border p-3"
        />

        {state.errors?.description && (
          <p className="mt-1 text-sm text-red-600">
            {state.errors.description[0]}
          </p>
        )}
      </div>

      {/* Product Image */}
      <div className="mt-6">
        <ImageUploader value={image} onChange={setImage} />
        <input type="hidden" name="imageUrl" value={image.url} />
        <input type="hidden" name="imagePublicId" value={image.publicId ?? ""} />
        {state.errors?.imageUrl && (
          <p className="mt-1 text-sm text-red-600">
            {state.errors.imageUrl[0]}
          </p>
        )}
      </div>

      {/* Gallery Images */}
      <div className="mt-6">
        <GalleryUploader value={gallery} onChange={setGallery} />
        <input
          type="hidden"
          name="galleryUrls"
          value={gallery.map((g) => g.url).join(",")}
        />
        <input
          type="hidden"
          name="galleryPublicIds"
          value={gallery.map((g) => g.publicId ?? "").join(",")}
        />
      </div>

      {/* Product Video */}
      <div className="mt-6">
        <VideoUploader
          value={video}
          onChange={setVideo}
          label="Product Video (optional)"
        />
        <input type="hidden" name="videoUrl" value={video.url} />
        <input type="hidden" name="videoPublicId" value={video.publicId ?? ""} />
      </div>

      {/* Save Button */}
      <button
        type="submit"
        disabled={pending}
        className="mt-6 rounded-xl bg-black px-8 py-3 text-white hover:bg-zinc-800 disabled:opacity-50"
      >
        {pending ? "Saving..." : "Save Product"}
      </button>
    </form>
  );
}
