import { Download, Users } from "lucide-react";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export default async function UsersPage() {
  const users = await prisma.user.findMany({
    select: { id: true, name: true, email: true, role: true, provider: true, emailVerified: true, createdAt: true, _count: { select: { orders: true } } },
    orderBy: { createdAt: "desc" },
  });

  return (
    <section className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div><p className="text-xs font-semibold tracking-[0.2em] text-gold uppercase">Customer directory</p><h1 className="mt-1 text-3xl font-bold text-ink">Users</h1><p className="mt-2 text-sm text-ink/60">Read-only customer records. No passwords or account tokens are displayed.</p></div>
        <a href="/api/admin/users/export" className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#1C1A17] px-4 py-3 text-sm font-semibold text-white transition-colors hover:bg-gold"><Download size={16} />Download CSV</a>
      </div>
      <div className="overflow-hidden rounded-2xl border border-[#1C1A17]/10 bg-white shadow-sm">
        <div className="flex items-center gap-3 border-b border-[#1C1A17]/10 p-4 text-sm text-ink/60"><Users size={18} className="text-gold" />{users.length} registered users</div>
        <div className="overflow-x-auto"><table className="min-w-[720px] w-full text-left text-sm"><thead className="bg-[#F4EFE6] text-xs tracking-wider text-ink/60 uppercase"><tr><th className="px-5 py-4">User</th><th className="px-5 py-4">Role</th><th className="px-5 py-4">Provider</th><th className="px-5 py-4">Orders</th><th className="px-5 py-4">Joined</th></tr></thead><tbody className="divide-y divide-[#1C1A17]/10">{users.map((user) => <tr key={user.id} className="hover:bg-[#F4EFE6]"><td className="px-5 py-4"><p className="font-semibold text-ink">{user.name}</p><p className="mt-1 text-ink/60">{user.email}</p></td><td className="px-5 py-4"><span className="rounded-full bg-gold/15 px-2.5 py-1 text-xs font-semibold text-gold-dark">{user.role}</span></td><td className="px-5 py-4 capitalize text-ink/60">{user.provider}</td><td className="px-5 py-4 text-ink/60">{user._count.orders}</td><td className="px-5 py-4 text-ink/60">{user.createdAt.toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" })}</td></tr>)}</tbody></table></div>
      </div>
    </section>
  );
}
