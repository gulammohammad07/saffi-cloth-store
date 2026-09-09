"use client";

import Link from "next/link";
import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

function GoogleMark() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true">
      <path
        fill="#4285F4"
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.27-4.74 3.27-8.1Z"
      />
      <path
        fill="#34A853"
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23Z"
      />
      <path
        fill="#FBBC05"
        d="M5.84 14.1a7.06 7.06 0 0 1 0-4.2V7.06H2.18a11 11 0 0 0 0 9.88l3.66-2.84Z"
      />
      <path
        fill="#EA4335"
        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52Z"
      />
    </svg>
  );
}

export function GoogleButton({
  next,
  className,
  label = "Continue with Google",
}: {
  next?: string;
  className?: string;
  label?: string;
}) {
  const query = next ? `?next=${encodeURIComponent(next)}` : "";
  return (
    <Link
      href={`/api/auth/google/start${query}`}
      className={cn(
        "group flex h-12 w-full items-center justify-center gap-3 rounded-xl border border-ink/12 bg-white text-sm font-semibold text-ink transition-all hover:border-ink/25 hover:bg-cream active:translate-y-px focus-visible:ring-4 focus-visible:ring-gold/20 focus-visible:outline-none",
        className,
      )}
    >
      <GoogleMark />
      {label}
    </Link>
  );
}

export function AuthSubmitButton({
  pending,
  children,
}: {
  pending: boolean;
  children: React.ReactNode;
}) {
  return (
    <button
      type="submit"
      disabled={pending}
      className="group relative flex h-12 w-full items-center justify-center gap-2 overflow-hidden rounded-xl bg-gradient-to-r from-gold via-gold-light to-gold text-sm font-semibold text-ink shadow-[0_12px_30px_-12px_rgb(201_169_110/0.8)] transition-all hover:shadow-[0_16px_36px_-12px_rgb(201_169_110/0.9)] focus-visible:ring-4 focus-visible:ring-gold/30 focus-visible:outline-none active:translate-y-px disabled:pointer-events-none disabled:opacity-70"
    >
      <span className="relative z-10 inline-flex items-center gap-2">
        {pending ? (
          <>
            <Loader2 size={16} className="animate-spin" />
            Please wait…
          </>
        ) : (
          children
        )}
      </span>
      <span className="absolute inset-0 -translate-x-full bg-gradient-to-r from-gold-light via-[#DBA381] to-gold-light transition-transform duration-500 group-hover:translate-x-0" />
    </button>
  );
}

export function OrDivider({ label = "or" }: { label?: string }) {
  return (
    <div className="my-6 flex items-center gap-4">
      <span className="h-px flex-1 bg-ink/10" />
      <span className="text-xs font-medium tracking-[0.2em] text-ink/30 uppercase">
        {label}
      </span>
      <span className="h-px flex-1 bg-ink/10" />
    </div>
  );
}

export function FormError({
  message,
  id,
}: {
  message?: string;
  id?: string;
}) {
  if (!message) return null;
  return (
    <div
      id={id}
      role="alert"
      className="flex items-start gap-2.5 rounded-xl border border-destructive/25 bg-destructive/5 px-4 py-3 text-sm text-destructive"
    >
      <span className="mt-0.5 block h-1.5 w-1.5 shrink-0 rounded-full bg-destructive" />
      <span className="leading-snug">{message}</span>
    </div>
  );
}
