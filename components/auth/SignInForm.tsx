"use client";

import { useEffect, useState, useTransition } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Lock, Mail } from "lucide-react";
import { signInAction } from "@/lib/actions/auth.actions";
import {
  signInSchema,
  type SignInInput,
} from "@/lib/validations/auth";
import { useAuth } from "@/lib/store/auth-context";
import { AuthShell } from "@/components/auth/AuthShell";
import { AuthField } from "@/components/auth/AuthField";
import {
  AuthSubmitButton,
  FormError,
  GoogleButton,
  OrDivider,
} from "@/components/auth/auth-buttons";

function getSafeNext(raw: string | null): string {
  if (!raw) return "/";
  return raw.startsWith("/") && !raw.startsWith("//") && !raw.includes(":")
    ? raw
    : "/";
}

export function SignInForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { refresh } = useAuth();

  const [formError, setFormError] = useState<string | undefined>(undefined);
  const [isPending, startTransition] = useTransition();

  const next = getSafeNext(searchParams.get("next"));
  const oauthError = searchParams.get("error");

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignInInput>({
    resolver: zodResolver(signInSchema),
    defaultValues: { email: "", password: "" },
  });

  useEffect(() => {
    if (oauthError === "google") {
      toast.error("Google sign-in didn't complete. Please try again.");
    } else if (oauthError === "google-not-configured") {
      toast.error(
        "Google sign-in isn't configured yet. Use your email instead.",
      );
    }
  }, [oauthError]);

  const onSubmit = handleSubmit((values) => {
    setFormError(undefined);
    startTransition(async () => {
      const result = await signInAction(values);
      if (!result.success) {
        setFormError(result.message);
        return;
      }
      toast.success(result.message);
      await refresh();
      router.push(next);
      router.refresh();
    });
  });

  return (
    <AuthShell
      eyebrow="Welcome back"
      title="Sign in to your account"
      subtitle="Track your orders, manage your wishlist and enjoy member-only privileges."
    >
      <form onSubmit={onSubmit} className="space-y-5" noValidate>
        {formError ? <FormError message={formError} /> : null}

        <AuthField
          id="email"
          label="Email address"
          type="email"
          icon={Mail}
          autoComplete="email"
          placeholder="you@example.com"
          error={errors.email?.message}
          {...register("email")}
        />

        <AuthField
          id="password"
          label="Password"
          type="password"
          icon={Lock}
          autoComplete="current-password"
          placeholder="••••••••"
          error={errors.password?.message}
          {...register("password")}
        />

        <div className="flex items-center justify-between">
          <label className="flex items-center gap-2 text-sm text-ink/60">
            <input
              type="checkbox"
              className="h-4 w-4 rounded border-ink/20 accent-gold"
            />
            Remember me
          </label>
          <Link
            href="/forgot-password"
            className="text-sm font-medium text-gold transition-colors hover:text-gold hover:underline"
          >
            Forgot password?
          </Link>
        </div>

        <AuthSubmitButton pending={isPending}>
          Sign In
        </AuthSubmitButton>
      </form>

      <OrDivider />

      <GoogleButton next={next} label="Sign in with Google" />

      <p className="mt-8 text-center text-sm text-ink/60">
        New to Libaas?{" "}
        <Link
          href={`/sign-up${next !== "/" ? `?next=${encodeURIComponent(next)}` : ""}`}
          className="font-semibold text-gold transition-colors hover:text-gold hover:underline"
        >
          Create an account
        </Link>
      </p>
    </AuthShell>
  );
}
