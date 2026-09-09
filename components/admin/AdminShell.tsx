"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Menu, ExternalLink } from "lucide-react";
import Sidebar from "./Sidebar";

export default function AdminShell({
  children,
}: {
  children: React.ReactNode;
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    if (sidebarOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [sidebarOpen]);

  return (
    <div className="flex min-h-screen bg-[#F4EFE6]">
      <Sidebar isOpen={sidebarOpen} onOpenChange={setSidebarOpen} />

      <div className="flex flex-1 flex-col min-w-0">
        <header className="flex h-14 sm:h-16 items-center justify-between border-b border-[#1C1A17]/10 bg-white px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setSidebarOpen(true)}
              className="rounded-lg p-2 text-ink hover:bg-[#1C1A17]/10 lg:hidden"
            >
              <Menu size={22} />
            </button>

            <h2 className="text-base sm:text-xl lg:text-2xl font-bold text-ink">
              Admin Panel
            </h2>
          </div>

          <Link
            href="/"
            className="inline-flex items-center gap-2 rounded-full border border-[#1C1A17]/15 bg-white px-4 py-2 text-xs font-semibold tracking-[0.12em] text-ink/60 uppercase transition-all duration-300 hover:border-gold hover:text-gold"
            title="Open the customer storefront in a new view"
          >
            <ExternalLink size={14} />
            <span className="hidden sm:inline">View Store</span>
            <span className="sm:hidden">Store</span>
          </Link>
        </header>

        <main className="flex-1 p-4 sm:p-6 lg:p-8">{children}</main>
      </div>
    </div>
  );
}
