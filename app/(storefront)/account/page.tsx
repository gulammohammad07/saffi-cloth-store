"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { m as motion } from "framer-motion";
import { toast } from "sonner";
import {
  Heart,
  LogOut,
  Mail,
  MapPin,
  Package,
  ShieldCheck,
  ShoppingBag,
  User as UserIcon,
} from "lucide-react";
import { signOutAction } from "@/lib/actions/auth.actions";
import { useAuth } from "@/lib/store/auth-context";

export default function AccountPage() {
  const router = useRouter();
  const { user, status, refresh } = useAuth();

  const handleSignOut = async () => {
    const result = await signOutAction();
    toast.success(result.message);
    await refresh();
    router.push("/");
    router.refresh();
  };

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
            Your session expired. Please sign in again.
          </p>
          <Link
            href="/sign-in"
            className="mt-6 inline-block rounded-full bg-[#1C1A17] px-8 py-3 text-sm font-semibold text-white transition-colors hover:bg-gold"
          >
            Sign in
          </Link>
        </div>
      </div>
    );
  }

  const initials = user.name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  const joined = new Intl.DateTimeFormat("en-GB", {
    month: "long",
    year: "numeric",
  }).format(new Date(user.createdAt));

  const cards = [
    {
      icon: Package,
      title: "Orders",
      description: "Track purchases & reorder favourites.",
      href: "/account/orders",
    },
    {
      icon: Heart,
      title: "Wishlist",
      description: "Your saved products.",
      href: "/wishlist",
    },
    {
      icon: MapPin,
      title: "Addresses",
      description: "Manage your delivery addresses.",
      href: "/account/addresses",
    },
    {
      icon: ShoppingBag,
      title: "Browse the collection",
      description: "Discover new styles and new-season drops.",
      href: "/shop",
    },
  ];

  return (
    <div className="min-h-screen bg-[#F4EFE6] px-4 py-14 sm:px-8">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mx-auto max-w-4xl"
      >
        {/* Header */}
        <div className="flex flex-col items-start gap-6 rounded-3xl border border-[#1C1A17]/10 bg-white p-8 shadow-xl sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-4">
            <div className="flex h-16 w-16 items-center justify-center overflow-hidden rounded-full bg-[#1C1A17] font-display text-xl font-semibold text-gold ring-2 ring-gold/30">
              {user.image ? (
                <Image
                  src={user.image}
                  alt={user.name}
                  width={64}
                  height={64}
                  className="h-16 w-16 object-cover"
                />
              ) : (
                initials
              )}
            </div>
            <div>
              <h1 className="font-display text-3xl font-medium text-ink">
                {user.name}
              </h1>
              <p className="mt-1 flex items-center gap-2 text-sm text-ink/60">
                <Mail size={14} className="text-gold" />
                {user.email}
              </p>
              <p className="mt-1 text-xs text-ink/30">
                Member since {joined}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {user.role === "ADMIN" || user.role === "SUBADMIN" ? (
              <Link
                href="/admin"
                className="inline-flex items-center gap-2 rounded-full border border-[#1C1A17]/15 px-5 py-2.5 text-sm font-medium text-ink transition-colors hover:border-gold hover:text-gold"
              >
                <ShieldCheck size={16} className="text-gold" />
                Admin panel
              </Link>
            ) : null}

            <button
              type="button"
              onClick={handleSignOut}
              className="inline-flex items-center gap-2 rounded-full bg-[#1C1A17] px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-gold"
            >
              <LogOut size={16} />
              Sign out
            </button>
          </div>
        </div>

        {/* Cards */}
        <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {cards.map((card) => {
            const Icon = card.icon;
            return (
              <Link
                key={card.title}
                href={card.href}
                className="group rounded-3xl border border-[#1C1A17]/10 bg-white p-7 shadow-sm transition-all hover:-translate-y-1 hover:shadow-xl"
              >
                <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#1C1A17]">
                  <Icon size={20} className="text-gold" />
                </span>
                <h2 className="mt-5 font-display text-xl font-medium text-ink">
                  {card.title}
                </h2>
                <p className="mt-1.5 text-sm text-ink/60">
                  {card.description}
                </p>
              </Link>
            );
          })}
        </div>

        {/* Account info */}
        <div className="mt-8 rounded-3xl border border-[#1C1A17]/10 bg-white p-8 shadow-xl">
          <h2 className="flex items-center gap-2 font-display text-2xl font-medium text-ink">
            <UserIcon size={20} className="text-gold" />
            Account details
          </h2>

          <dl className="mt-6 grid gap-6 sm:grid-cols-2">
            <div className="rounded-2xl bg-[#F4EFE6] p-5">
              <dt className="text-xs font-semibold tracking-wider text-ink/60 uppercase">
                Name
              </dt>
              <dd className="mt-1.5 font-medium text-ink">{user.name}</dd>
            </div>
            <div className="rounded-2xl bg-[#F4EFE6] p-5">
              <dt className="text-xs font-semibold tracking-wider text-ink/60 uppercase">
                Email
              </dt>
              <dd className="mt-1.5 font-medium text-ink">{user.email}</dd>
            </div>
            <div className="rounded-2xl bg-[#F4EFE6] p-5">
              <dt className="text-xs font-semibold tracking-wider text-ink/60 uppercase">
                Sign-in method
              </dt>
              <dd className="mt-1.5 font-medium text-ink capitalize">
                {user.provider}
              </dd>
            </div>
            <div className="rounded-2xl bg-[#F4EFE6] p-5">
              <dt className="text-xs font-semibold tracking-wider text-ink/60 uppercase">
                Account status
              </dt>
              <dd className="mt-1.5 font-medium text-ink">
                {user.emailVerified ? "Verified" : "Active"}
              </dd>
            </div>
          </dl>
        </div>
      </motion.div>
    </div>
  );
}
