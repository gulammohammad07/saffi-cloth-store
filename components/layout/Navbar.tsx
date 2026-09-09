"use client";

import dynamic from "next/dynamic";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { m as motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import {
  Heart,
  Search,
  ShoppingBag,
  User,
  Menu,
  X,
  LogOut,
  LayoutDashboard,
  ChevronDown,
  ArrowRight,
} from "lucide-react";
import { useCart } from "@/lib/store/cart-context";
import { useWishlist } from "@/lib/store/wishlist-context";
import { useAuth } from "@/lib/store/auth-context";
import { signOutAction } from "@/lib/actions/auth.actions";

const CartDrawer = dynamic(() => import("@/components/cart/CartDrawer"), {
  ssr: false,
  loading: () => null,
});

const SearchOverlay = dynamic(
  () => import("@/components/layout/SearchOverlay"),
  {
    ssr: false,
    loading: () => null,
  },
);

export type NavCategory = {
  slug: string;
  name: string;
  count: number;
};

export type Department = {
  key: "men" | "women" | "kids";
  title: string;
  tagline: string;
  totalCount: number;
  categories: NavCategory[];
};

const MAIN_LINKS = [
  { label: "Shop All", href: "/shop", type: null as Department["key"] | null },
  { label: "Men", href: "/shop?type=men", type: "men" as const },
  { label: "Women", href: "/shop?type=women", type: "women" as const },
  { label: "Kids", href: "/shop?type=kids", type: "kids" as const },
  { label: "New Arrivals", href: "/shop?sort=newest", type: null },
];

function shopUrl(type: Department["key"], categorySlug?: string) {
  const params = new URLSearchParams();
  params.set("type", type);
  if (categorySlug) params.set("category", categorySlug);
  return `/shop?${params.toString()}`;
}

export default function Navbar({
  departments,
  branding,
}: {
  departments: Department[];
  branding: {
    title: string;
    titleColor: string;
    logoUrl: string | null;
    displayMode: "TEXT" | "IMAGE";
  };
}) {
  const [scrolled, setScrolled] = useState(false);
  const [activeMenu, setActiveMenu] = useState<Department["key"] | null>(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const { totalItems, isOpen: isCartOpen, openCart } = useCart();
  const { items: wishlistItems } = useWishlist();
  const { user, isAdmin, refresh } = useAuth();
  const router = useRouter();
  const showLogo = Boolean(branding.logoUrl);
  const showTitle = Boolean(branding.title);

  const activeDepartment =
    departments.find((d) => d.key === activeMenu) ?? null;

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Lock the page behind while the full-screen mobile menu is open so the
  // body never scrolls underneath — only the menu itself scrolls.
  useEffect(() => {
    if (!mobileOpen) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [mobileOpen]);

  // Same rule for desktop department dropdowns: while one is open the page
  // behind stays put, so scrolling can never drift under an open overlay.
  useEffect(() => {
    if (!activeMenu) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [activeMenu]);

  const handleSignOut = async () => {
    const result = await signOutAction();
    toast.success(result.message);
    await refresh();
    router.push("/");
    router.refresh();
  };

  return (
    <>
      <div
        className="sticky top-0 z-50"
        onMouseLeave={() => setActiveMenu(null)}
      >
        <header
          className={`transition-all duration-700 ${
            scrolled
              ? "glass-premium shadow-[0_4px_30px_rgba(19,17,16,0.08)]"
              : "bg-white/80 backdrop-blur-xl"
          }`}
        >
          <div className="mx-auto flex h-20 items-center justify-start gap-3 px-4 sm:gap-8 sm:px-8 lg:4 lg:justify-between">
            <button
              type="button"
              className="text-ink lg:hidden transition-colors hover:text-gold"
              onClick={() => setMobileOpen(true)}
              aria-label="Open menu"
            >
              <Menu size={24} />
            </button>

            <Link
              href="/"
              className="-ml-2 flex min-w-0 flex-1 shrink items-center gap-2 sm:-ml-4 sm:gap-3 lg:flex-none lg:-ml-6"
              onClick={() => setActiveMenu(null)}
            >
              {showLogo && (
                <Image
                  src={branding.logoUrl!}
                  alt={branding.title || "Store logo"}
                  width={180}
                  height={48}
                  className="h-12 w-auto max-w-[24vw] object-contain sm:h-10 sm:max-w-[180px]"
                  priority
                />
              )}
              {showTitle && (
                <span
                  className="min-w-0 max-w-[42vw] truncate font-display text-base font-semibold uppercase tracking-[0.35em] sm:max-w-[260px] sm:text-xl sm:tracking-[0.4em]"
                  style={{ color: branding.titleColor }}
                >
                  {branding.title}
                </span>
              )}
            </Link>

            <nav className="hidden items-center gap-9 lg:flex">
              {MAIN_LINKS.map((item) => {
                const isOpen = item.type !== null && activeMenu === item.type;
                return (
                  <div key={item.label} className="relative py-2">
                    <Link
                      href={item.href}
                      onMouseEnter={() =>
                        item.type ? setActiveMenu(item.type) : null
                      }
                      onClick={() => setActiveMenu(null)}
                      aria-expanded={item.type ? isOpen : undefined}
                      className={`flex items-center gap-1.5 text-xs font-medium tracking-[0.16em] uppercase transition-colors duration-500 ${
                        isOpen
                          ? "text-gold"
                          : "text-ink/60 hover:text-gold"
                      }`}
                    >
                      {item.label}
                      {item.type && (
                        <ChevronDown
                          size={13}
                          className={`transition-transform duration-300 ${
                            isOpen ? "rotate-180 text-gold" : "text-ink/30"
                          }`}
                        />
                      )}
                      {isOpen && (
                        <span className="animate-underline absolute -bottom-0.5 left-0 h-px w-full origin-left bg-gradient-to-r from-gold to-gold-light" />
                      )}
                    </Link>

                    {/* Compact department panel — the sub-categories of the
                        hovered main category. Small by design: it never covers
                        the whole page. */}
                    <AnimatePresence>
                      {isOpen && activeDepartment && (
                        <motion.div
                          key={activeDepartment.key}
                          initial={{ opacity: 0, y: 10, scale: 0.98 }}
                          animate={{ opacity: 1, y: 0, scale: 1 }}
                          exit={{ opacity: 0, y: 6, scale: 0.98 }}
                          transition={{
                            duration: 0.28,
                            ease: [0.22, 1, 0.36, 1],
                          }}
                          onMouseEnter={() =>
                            setActiveMenu(activeDepartment.key)
                          }
                          className="absolute left-1/2 top-full z-50 mt-4 w-[27rem] -translate-x-1/2 rounded-3xl border border-[#E3DACB] bg-white/98 p-6 shadow-[0_30px_80px_-20px_rgba(19,17,16,0.25)] backdrop-blur-2xl"
                        >
                          <div className="flex items-center justify-between gap-4">
                            <div>
                              <p className="text-xs font-semibold tracking-[0.3em] text-gold uppercase">
                                Shop {activeDepartment.title}
                              </p>
                              <h3 className="mt-1.5 font-display text-3xl font-medium text-ink">
                                {activeDepartment.title}
                              </h3>
                            </div>
                            <span className="rounded-full bg-[#F4EFE6] px-3 py-1 text-xs font-semibold text-ink/60">
                              {activeDepartment.totalCount} styles
                            </span>
                          </div>

                          <p className="mt-2 text-xs text-mute">
                            {activeDepartment.tagline}
                          </p>

                          <div className="mt-5 grid max-h-72 grid-cols-2 gap-x-3 gap-y-1 overflow-y-auto pr-1">
                            {activeDepartment.categories.map((category) => (
                              <Link
                                key={category.slug}
                                href={shopUrl(
                                  activeDepartment.key,
                                  category.slug,
                                )}
                                onClick={() => setActiveMenu(null)}
                                className="group flex items-center justify-between gap-2 rounded-xl px-3 py-2.5 text-sm text-ink/60 transition-all duration-300 hover:bg-[#F4EFE6] hover:text-gold"
                              >
                                <span className="truncate">{category.name}</span>
                                <span className="shrink-0 text-xs font-semibold text-mute transition-colors group-hover:text-gold">
                                  {category.count}
                                </span>
                              </Link>
                            ))}
                            {activeDepartment.categories.length === 0 && (
                              <p className="col-span-2 px-3 py-4 text-sm text-mute">
                                New styles landing soon.
                              </p>
                            )}
                          </div>

                          <Link
                            href={shopUrl(activeDepartment.key)}
                            onClick={() => setActiveMenu(null)}
                            className="mt-5 flex items-center justify-center gap-2 rounded-full bg-[#131110] px-5 py-3 text-xs font-bold tracking-[0.18em] text-white uppercase transition-all duration-300 hover:bg-gold hover:text-ink"
                          >
                            Explore All {activeDepartment.title}
                            <ArrowRight size={13} />
                          </Link>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                );
              })}
            </nav>

            <div className="ml-auto flex items-center gap-2 text-ink sm:gap-5 lg:ml-0">
              <button
                type="button"
                onClick={() => setSearchOpen(true)}
                className="transition-colors duration-300 hover:text-gold"
                aria-label="Search"
              >
                <Search size={20} />
              </button>

              <Link
                href="/wishlist"
                prefetch={false}
                className="relative transition-colors duration-300 hover:text-gold"
                aria-label="Wishlist"
              >
                <Heart size={20} />
                {wishlistItems.length > 0 && (
                  <motion.span
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute -top-2 -right-2 flex h-4.5 w-4.5 items-center justify-center rounded-full bg-gradient-to-r from-gold to-gold-light text-xs font-bold text-ink"
                  >
                    {wishlistItems.length}
                  </motion.span>
                )}
              </Link>

              <button
                type="button"
                onClick={openCart}
                className="relative transition-colors duration-300 hover:text-gold"
                aria-label="Cart"
              >
                <ShoppingBag size={20} />
                {totalItems > 0 && (
                  <motion.span
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute -top-2 -right-2 flex h-4.5 w-4.5 items-center justify-center rounded-full bg-gradient-to-r from-gold to-gold-light text-xs font-bold text-ink"
                  >
                    {totalItems}
                  </motion.span>
                )}
              </button>

              {isAdmin && (
                <Link
                  href="/admin"
                  prefetch={false}
                  title="Switch to admin panel"
                  className="hidden items-center gap-2 rounded-full border border-gold/40 bg-white/60 px-4 py-2 text-xs font-bold tracking-[0.18em] text-gold uppercase transition-all duration-300 hover:border-gold hover:bg-gold hover:text-ink hover:shadow-[0_0_24px_rgba(188,78,34,0.35)] sm:inline-flex"
                >
                  <LayoutDashboard size={14} />
                  Admin
                </Link>
              )}

              {user ? (
                <Link
                  href="/account"
                  prefetch={false}
                  className="hidden h-9 w-9 items-center justify-center overflow-hidden rounded-full bg-gradient-to-r from-gold to-gold-light text-xs font-bold text-ink ring-1 ring-gold/30 transition-all duration-500 hover:shadow-[0_0_20px_rgba(188,78,34,0.4)] sm:flex"
                  aria-label="Account"
                  title={user.email || user.name}
                >
                  {user.image ? (
                    <Image
                      src={user.image}
                      alt={user.name}
                      width={36}
                      height={36}
                      className="h-9 w-9 object-cover"
                    />
                  ) : (
                    user.name.charAt(0).toUpperCase()
                  )}
                </Link>
              ) : (
                <Link
                  href="/sign-in"
                  prefetch={false}
                  className="hidden transition-colors duration-300 hover:text-gold sm:block"
                  aria-label="Sign in"
                >
                  <User size={20} />
                </Link>
              )}
            </div>
          </div>
        </header>
      </div>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            className="fixed inset-0 z-[60] bg-white/[0.97] backdrop-blur-2xl lg:hidden"
          >
            <div className="flex h-full flex-col">
              <div className="flex h-20 shrink-0 items-center justify-between px-6">
                <Link
                  href="/"
                  className="-ml-2 flex min-w-0 items-center gap-2 sm:-ml-4"
                  onClick={() => setMobileOpen(false)}
                >
                  {showLogo && (
                    <Image
                      src={branding.logoUrl!}
                      alt={branding.title || "Store logo"}
                      width={160}
                      height={48}
                      className="h-8 w-auto max-w-[30vw] object-contain"
                    />
                  )}
                  {showTitle && (
                    <span
                      className="min-w-0 max-w-[42vw] truncate font-display text-sm font-semibold uppercase tracking-[0.35em]"
                      style={{ color: branding.titleColor }}
                    >
                      {branding.title}
                    </span>
                  )}
                </Link>
                <button
                  type="button"
                  onClick={() => setMobileOpen(false)}
                  className="text-ink transition-colors duration-300 hover:text-gold"
                  aria-label="Close menu"
                >
                  <X size={26} />
                </button>
              </div>

              <nav className="min-h-0 flex-1 overflow-y-auto px-6 pt-8 pb-8">
                <ul className="space-y-6">
                  {MAIN_LINKS.filter((l) => l.type === null).map((item) => (
                    <li key={item.label}>
                      <Link
                        href={item.href}
                        onClick={() => setMobileOpen(false)}
                        className="text-2xl font-medium text-ink transition-colors duration-300 hover:text-gold"
                      >
                        {item.label}
                      </Link>
                    </li>
                  ))}
                  <li>
                    <Link
                      href="/wishlist"
                      onClick={() => setMobileOpen(false)}
                      className="text-2xl font-medium text-ink/60 transition-colors duration-300 hover:text-gold"
                    >
                      Wishlist
                    </Link>
                  </li>
                </ul>

                {/* Shop by department — main category first, its
                    sub-categories grouped underneath. */}
                <div className="mt-10 space-y-9">
                  {departments.map((dept) => (
                    <div key={dept.key}>
                      <div className="flex items-center justify-between gap-3 border-b border-[#E3DACB] pb-3">
                        <Link
                          href={shopUrl(dept.key)}
                          onClick={() => setMobileOpen(false)}
                          className="group flex items-baseline gap-2"
                        >
                          <span className="font-display text-2xl font-semibold text-ink transition-colors duration-300 group-hover:text-gold">
                            {dept.title}
                          </span>
                          <ArrowRight
                            size={16}
                            className="text-gold transition-transform duration-300 group-hover:translate-x-1"
                          />
                        </Link>
                        <span className="text-xs font-semibold tracking-[0.18em] text-mute uppercase">
                          {dept.totalCount} styles
                        </span>
                      </div>

                      <div className="mt-4 grid grid-cols-2 gap-2">
                        {dept.categories.map((category) => (
                          <Link
                            key={category.slug}
                            href={shopUrl(dept.key, category.slug)}
                            onClick={() => setMobileOpen(false)}
                            className="flex items-center justify-between gap-2 rounded-xl border border-[#E3DACB] bg-white px-3.5 py-3 text-sm text-ink/60 transition-all duration-300 hover:border-gold/40 hover:text-gold"
                          >
                            <span className="truncate">{category.name}</span>
                            <span className="shrink-0 text-xs font-semibold text-mute">
                              {category.count}
                            </span>
                          </Link>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </nav>

              {/* Pinned footer — always visible, never lost below the fold. */}
              <div className="shrink-0 border-t border-[#E3DACB] bg-[#F4EFE6] px-6 pt-5 pb-6">
                {user ? (
                  <>
                    <div className="flex items-center gap-3">
                      <div className="flex h-11 w-11 shrink-0 items-center justify-center overflow-hidden rounded-full bg-gradient-to-r from-gold to-gold-light font-display text-base font-semibold text-ink ring-1 ring-gold/30">
                        {user.image ? (
                          <Image
                            src={user.image}
                            alt={user.name}
                            width={44}
                            height={44}
                            className="h-11 w-11 object-cover"
                          />
                        ) : (
                          user.name.charAt(0).toUpperCase()
                        )}
                      </div>
                      <div className="min-w-0">
                        <p className="truncate text-sm font-semibold text-ink">
                          {user.name}
                        </p>
                        <p className="truncate text-xs text-mute">
                          {user.email}
                        </p>
                      </div>
                    </div>
                    <div className="mt-4 flex gap-3">
                      <Link
                        href="/account"
                        onClick={() => setMobileOpen(false)}
                        className="flex h-11 flex-1 items-center justify-center rounded-xl bg-[#131110] text-sm font-medium text-white transition-colors duration-300 hover:bg-gold"
                      >
                        Account
                      </Link>
                      {isAdmin && (
                        <Link
                          href="/admin"
                          onClick={() => setMobileOpen(false)}
                          className="flex h-11 flex-1 items-center justify-center rounded-xl border border-[#1C1A17]/15 bg-white text-sm font-medium text-ink transition-colors duration-300 hover:border-gold/50 hover:text-gold"
                        >
                          Admin
                        </Link>
                      )}
                      <button
                        type="button"
                        onClick={() => {
                          setMobileOpen(false);
                          void handleSignOut();
                        }}
                        className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-[#1C1A17]/15 bg-white text-ink transition-colors duration-300 hover:border-red-300 hover:text-red-600"
                        aria-label="Sign out"
                      >
                        <LogOut size={17} />
                      </button>
                    </div>
                  </>
                ) : (
                  <div className="flex gap-3">
                    <Link
                      href="/sign-in"
                      onClick={() => setMobileOpen(false)}
                      className="flex h-12 flex-1 items-center justify-center rounded-xl bg-gradient-to-r from-gold to-gold-light text-sm font-semibold text-ink transition-transform duration-300 hover:scale-[1.02]"
                    >
                      Sign in
                    </Link>
                    <Link
                      href="/sign-up"
                      onClick={() => setMobileOpen(false)}
                      className="flex h-12 flex-1 items-center justify-center rounded-xl border border-[#1C1A17]/20 bg-white text-sm font-semibold text-ink transition-colors duration-300 hover:border-gold/60 hover:text-gold"
                    >
                      Create account
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {isCartOpen && <CartDrawer />}
      {searchOpen && (
        <SearchOverlay open={searchOpen} onClose={() => setSearchOpen(false)} />
      )}
    </>
  );
}
