"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Pencil, Trash2, Search, ImageOff } from "lucide-react";
import { toast } from "sonner";
import { deleteCategory } from "@/app/admin/categories/actions";

interface Category {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  imageUrl: string | null;
  isActive: boolean;
  productCount: number;
  productTypes: string[];
}

interface Props {
  categories: Category[];
}

type TypeFilter = "ALL" | "MEN" | "WOMEN" | "KIDS";

const TYPE_BADGES: Record<string, { label: string; className: string }> = {
  MEN: {
    label: "Men",
    className: "bg-[#1C1A17] text-cream",
  },
  WOMEN: {
    label: "Women",
    className: "bg-[#BC4E22] text-white",
  },
  KIDS: {
    label: "Kids",
    className: "bg-[#E6D9C3] text-ink",
  },
};

const TYPE_FILTERS: { key: TypeFilter; label: string }[] = [
  { key: "ALL", label: "All" },
  { key: "MEN", label: "Men" },
  { key: "WOMEN", label: "Women" },
  { key: "KIDS", label: "Kids" },
];

function CategoryImage({ src, alt }: { src: string; alt: string }) {
  const [failed, setFailed] = useState(false);

  if (failed || !src) {
    return (
      <div className="flex h-full w-full items-center justify-center">
        <ImageOff size={16} className="text-gray-400" />
      </div>
    );
  }

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={src}
      alt={alt}
      className="h-full w-full object-contain"
      onError={() => setFailed(true)}
    />
  );
}

function ProductTypeBadges({ types }: { types: string[] }) {
  if (types.length === 0) return null;
  const unique = [...new Set(types)];
  return (
    <span className="flex flex-wrap gap-1">
      {unique.map((type) => {
        const meta = TYPE_BADGES[type] ?? {
          label: type,
          className: "bg-zinc-200 text-zinc-700",
        };
        return (
          <span
            key={type}
            className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-semibold uppercase tracking-wide ${meta.className}`}
          >
            {meta.label}
          </span>
        );
      })}
    </span>
  );
}

export default function CategoryTable({ categories }: Props) {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [typeFilter, setTypeFilter] = useState<TypeFilter>("ALL");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return categories.filter((category) => {
      const matchesQuery =
        !q ||
        category.name.toLowerCase().includes(q) ||
        category.slug.toLowerCase().includes(q) ||
        (category.description ?? "").toLowerCase().includes(q);
      const matchesType =
        typeFilter === "ALL" || category.productTypes.includes(typeFilter);
      return matchesQuery && matchesType;
    });
  }, [categories, query, typeFilter]);

  const handleDelete = async (category: Category) => {
    if (
      !window.confirm(
        `Delete "${category.name}"? Its image will also be removed from Cloudinary.`,
      )
    ) {
      return;
    }

    const result = await deleteCategory(category.id);
    if (result.success) {
      toast.success(result.message ?? "Category deleted successfully.");
      router.refresh();
    } else {
      toast.error(result.message ?? "Failed to delete category.");
    }
  };

  const noRows =
    categories.length === 0
      ? "No categories found."
      : "No categories match your search or filter.";

  return (
    <div className="space-y-4">
      {/* Search + gender filter — essential once a clothing store grows many
          categories (Men's and Women's versions of every style). */}
      <div className="flex flex-col gap-3 rounded-2xl border border-[#1C1A17]/10 bg-white p-4 shadow-sm sm:flex-row sm:items-center sm:justify-between">
        <label className="relative block w-full sm:max-w-xs">
          <Search
            size={16}
            className="pointer-events-none absolute top-1/2 left-4 -translate-y-1/2 text-ink/60"
          />
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search categories…"
            className="w-full rounded-full border border-[#1C1A17]/15 bg-[#F4EFE6] py-2.5 pr-4 pl-10 text-sm text-ink focus:border-gold focus:outline-none"
          />
        </label>

        <div className="flex flex-wrap items-center gap-2">
          {TYPE_FILTERS.map((filter) => {
            const isActive = typeFilter === filter.key;
            return (
              <button
                key={filter.key}
                type="button"
                onClick={() => setTypeFilter(filter.key)}
                className={`rounded-full border px-4 py-2 text-xs font-semibold tracking-wide uppercase transition-colors ${
                  isActive
                    ? "border-[#131110] bg-[#131110] text-white"
                    : "border-[#1C1A17]/15 bg-white text-ink/60 hover:border-gold hover:text-ink"
                }`}
              >
                {filter.label}
              </button>
            );
          })}
        </div>
      </div>

      <div className="overflow-hidden rounded-2xl border border-[#1C1A17]/10 bg-white shadow-sm">
        {/* Desktop Table */}
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full">
            <thead className="bg-[#F4EFE6]">
              <tr>
                <th className="p-4 text-left text-xs font-semibold uppercase tracking-wider text-ink/60">Image</th>
                <th className="p-4 text-left text-xs font-semibold uppercase tracking-wider text-ink/60">Name</th>
                <th className="p-4 text-left text-xs font-semibold uppercase tracking-wider text-ink/60">Products</th>
                <th className="p-4 text-left text-xs font-semibold uppercase tracking-wider text-ink/60">Slug</th>
                <th className="p-4 text-left text-xs font-semibold uppercase tracking-wider text-ink/60">Status</th>
                <th className="p-4 text-right text-xs font-semibold uppercase tracking-wider text-ink/60">Actions</th>
              </tr>
            </thead>

            <tbody>
              {filtered.map((category) => (
                <tr key={category.id} className="border-t border-[#1C1A17]/10 hover:bg-[#F4EFE6]">
                  <td className="p-4">
                    <div className="relative h-12 w-12 overflow-hidden rounded-lg border border-[#1C1A17]/10 bg-[#F4EFE6]">
                      <CategoryImage src={category.imageUrl ?? ""} alt={category.name} />
                    </div>
                  </td>
                  <td className="p-4">
                    <p className="text-sm font-medium text-ink">{category.name}</p>
                    {category.description && (
                      <p className="mt-1 max-w-xs truncate text-xs text-ink/60">
                        {category.description}
                      </p>
                    )}
                  </td>
                  <td className="p-4">
                    <div className="flex items-center gap-2.5">
                      <span className="inline-flex min-w-8 items-center justify-center rounded-full bg-[#F4EFE6] px-2 py-1 text-xs font-bold text-ink">
                        {category.productCount}
                      </span>
                      <ProductTypeBadges types={category.productTypes} />
                    </div>
                  </td>
                  <td className="p-4 text-sm text-ink/60">{category.slug}</td>
                  <td className="p-4">
                    {category.isActive ? (
                      <span className="font-medium text-green-700">Active</span>
                    ) : (
                      <span className="font-medium text-red-600">Inactive</span>
                    )}
                  </td>

                  <td className="p-4 text-right space-x-2">
                    <Link
                      href={`/admin/categories/${category.id}`}
                      className="inline-flex items-center gap-1.5 rounded-lg bg-[#1C1A17] px-3 py-2 text-sm text-white transition-colors hover:bg-gold"
                    >
                      <Pencil size={14} />
                      Edit
                    </Link>

                    <button
                      onClick={() => handleDelete(category)}
                      className="inline-flex items-center gap-1.5 rounded-lg bg-red-600 px-3 py-2 text-sm text-white transition-colors hover:bg-red-700"
                    >
                      <Trash2 size={14} />
                      Delete
                    </button>
                  </td>
                </tr>
              ))}

              {filtered.length === 0 && (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-ink/60">
                    {noRows}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Mobile Cards */}
        <div className="md:hidden divide-y divide-[#1C1A17]/10">
          {filtered.length === 0 ? (
            <div className="p-8 text-center text-ink/60">{noRows}</div>
          ) : (
            filtered.map((category) => (
              <div
                key={category.id}
                className="p-4 hover:bg-[#F4EFE6] transition-colors"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-lg border border-[#1C1A17]/10 bg-[#F4EFE6]">
                      <CategoryImage src={category.imageUrl ?? ""} alt={category.name} />
                    </div>
                    <div className="min-w-0">
                      <h3 className="font-medium text-ink">{category.name}</h3>
                      <p className="mt-1 truncate text-xs text-ink/60">
                        {category.slug}
                      </p>
                      <div className="mt-2 flex flex-wrap items-center gap-2">
                        <span className="inline-flex items-center rounded-full bg-[#F4EFE6] px-2 py-0.5 text-xs font-bold text-ink">
                          {category.productCount} item{category.productCount === 1 ? "" : "s"}
                        </span>
                        <ProductTypeBadges types={category.productTypes} />
                      </div>
                      <p className="mt-2">
                        {category.isActive ? (
                          <span className="font-medium text-green-700 text-xs">Active</span>
                        ) : (
                          <span className="font-medium text-red-600 text-xs">Inactive</span>
                        )}
                      </p>
                    </div>
                  </div>

                  <div className="flex flex-shrink-0 gap-2">
                    <Link
                      href={`/admin/categories/${category.id}`}
                      className="inline-flex h-9 w-9 items-center justify-center rounded-lg bg-[#1C1A17] text-white transition-colors hover:bg-gold"
                      aria-label="Edit"
                    >
                      <Pencil size={14} />
                    </Link>
                    <button
                      onClick={() => handleDelete(category)}
                      className="inline-flex h-9 w-9 items-center justify-center rounded-lg bg-red-600 text-white transition-colors hover:bg-red-700"
                      aria-label="Delete"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
