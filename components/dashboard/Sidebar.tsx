"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import {
  LayoutDashboard,
  FolderTree,
  ShoppingBag,
  Package,
  ShoppingCart,
  CalendarDays,
} from "lucide-react";

const menuItems = [
  {
    name: "Dashboard",
    href: "/admin/dashboard",
    icon: LayoutDashboard,
  },
  {
    name: "Categories",
    href: "/admin/categories",
    icon: FolderTree,
  },
  {
    name: "Brands",
    href: "/admin/brands",
    icon: ShoppingBag,
  },
  {
    name: "Occasions",
    href: "/admin/occasions",
    icon: CalendarDays,
  },
  {
    name: "Products",
    href: "/admin/products",
    icon: Package,
  },
  {
    name: "Orders",
    href: "/admin/orders",
    icon: ShoppingCart,
  },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-72 min-h-screen bg-zinc-950 border-r border-zinc-800 text-white">
      {/* Logo */}
      <div className="border-b border-zinc-800 p-6">
        <h1 className="text-2xl font-bold tracking-wide">Libaas</h1>

        <p className="mt-1 text-sm text-zinc-400">Admin Panel</p>
      </div>

      {/* Menu */}
      <nav className="p-4 space-y-2">
        {menuItems.map((item) => {
          const Icon = item.icon;

          const active = pathname === item.href;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 rounded-xl px-4 py-3 transition-all ${
                active
                  ? "bg-white text-ink font-semibold shadow"
                  : "text-zinc-300 hover:bg-zinc-900 hover:text-white"
              }`}
            >
              <Icon size={20} />

              <span>{item.name}</span>
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
