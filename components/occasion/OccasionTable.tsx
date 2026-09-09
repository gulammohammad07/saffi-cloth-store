"use client";

import { useRouter } from "next/navigation";
import { Trash2 } from "lucide-react";
import { deleteOccasionAction } from "@/app/admin/occasions/actions";

interface Occasion {
  id: string;
  name: string;
  slug: string;
  isActive: boolean;
}

export default function OccasionTable({ occasions }: { occasions: Occasion[] }) {
  const router = useRouter();

  const handleDelete = async (id: string, name: string) => {
    if (!window.confirm(`Delete occasion "${name}"?`)) return;
    await deleteOccasionAction(id);
    router.refresh();
  };

  return (
    <div className="overflow-hidden rounded-2xl border border-[#1C1A17]/10 bg-white shadow-sm">
      {/* Desktop Table */}
      <div className="hidden md:block overflow-x-auto">
        <table className="w-full">
          <thead className="bg-[#F4EFE6]">
            <tr>
              <th className="p-4 text-left text-xs font-semibold uppercase tracking-wider text-ink/60">Name</th>
              <th className="p-4 text-left text-xs font-semibold uppercase tracking-wider text-ink/60">Slug</th>
              <th className="p-4 text-left text-xs font-semibold uppercase tracking-wider text-ink/60">Status</th>
              <th className="p-4 text-right text-xs font-semibold uppercase tracking-wider text-ink/60">Actions</th>
            </tr>
          </thead>

          <tbody>
            {occasions.map((occasion) => (
              <tr key={occasion.id} className="border-t border-[#1C1A17]/10 hover:bg-[#F4EFE6]">
                <td className="p-4 text-sm font-medium text-ink">{occasion.name}</td>
                <td className="p-4 text-sm text-ink/60">{occasion.slug}</td>
                <td className="p-4">
                  {occasion.isActive ? (
                    <span className="font-medium text-green-700">Active</span>
                  ) : (
                    <span className="font-medium text-red-600">Inactive</span>
                  )}
                </td>

                <td className="p-4 text-right">
                  <button
                    type="button"
                    onClick={() => handleDelete(occasion.id, occasion.name)}
                    className="inline-flex items-center gap-1.5 rounded-lg bg-red-600 px-3 py-2 text-sm text-white transition-colors hover:bg-red-700"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}

            {occasions.length === 0 && (
              <tr>
                <td colSpan={4} className="p-8 text-center text-ink/60">
                  No occasions yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Mobile Cards */}
      <div className="md:hidden divide-y divide-[#1C1A17]/10">
        {occasions.length === 0 ? (
          <div className="p-8 text-center text-ink/60">
            No occasions yet.
          </div>
        ) : (
          occasions.map((occasion) => (
            <div
              key={occasion.id}
              className="p-4 hover:bg-[#F4EFE6] transition-colors"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <h3 className="font-medium text-ink">{occasion.name}</h3>
                  <p className="mt-1 text-xs text-ink/60">{occasion.slug}</p>
                  <p className="mt-2">
                    {occasion.isActive ? (
                      <span className="font-medium text-green-700 text-xs">Active</span>
                    ) : (
                      <span className="font-medium text-red-600 text-xs">Inactive</span>
                    )}
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => handleDelete(occasion.id, occasion.name)}
                  className="inline-flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-lg bg-red-600 text-white transition-colors hover:bg-red-700"
                  aria-label="Delete"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}