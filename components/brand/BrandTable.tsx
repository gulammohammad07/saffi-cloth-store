interface Brand {
  id: string;
  name: string;
  slug: string;
}

export default function BrandTable({ brands }: { brands: Brand[] }) {
  return (
    <div className="overflow-hidden rounded-2xl border border-[#1C1A17]/10 bg-white shadow-sm">
      {/* Desktop Table */}
      <div className="hidden md:block overflow-x-auto">
        <table className="w-full">
          <thead className="bg-[#F4EFE6]">
            <tr>
              <th className="p-4 text-left text-xs font-semibold uppercase tracking-wider text-ink/60">Name</th>
              <th className="p-4 text-left text-xs font-semibold uppercase tracking-wider text-ink/60">Slug</th>
            </tr>
          </thead>

          <tbody>
            {brands.map((brand) => (
              <tr key={brand.id} className="border-t border-[#1C1A17]/10 hover:bg-[#F4EFE6]">
                <td className="p-4 text-sm font-medium text-ink">{brand.name}</td>
                <td className="p-4 text-sm text-ink/60">{brand.slug}</td>
              </tr>
            ))}

            {brands.length === 0 && (
              <tr>
                <td colSpan={2} className="p-8 text-center text-ink/60">
                  No Brands
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Mobile Cards */}
      <div className="md:hidden divide-y divide-[#1C1A17]/10">
        {brands.length === 0 ? (
          <div className="p-8 text-center text-ink/60">
            No Brands
          </div>
        ) : (
          brands.map((brand) => (
            <div
              key={brand.id}
              className="p-4 hover:bg-[#F4EFE6] transition-colors"
            >
              <div className="flex items-center justify-between gap-3">
                <div className="min-w-0">
                  <h3 className="font-medium text-ink">{brand.name}</h3>
                  <p className="mt-1 text-xs text-ink/60">{brand.slug}</p>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}