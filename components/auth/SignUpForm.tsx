"use client";

import { useEffect, useState, useTransition } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Lock, Mail, User } from "lucide-react";
import { signUpAction } from "@/lib/actions/auth.actions";
import { signUpSchema, type SignUpInput } from "@/lib/validations/auth";
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

export function SignUpForm() {
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
  } = useForm<SignUpInput>({
    resolver: zodResolver(signUpSchema),
    defaultValues: { name: "", email: "", password: "", confirmPassword: "" },
  });

  useEffect(() => {
    if (oauthError === "google") {
      toast.error("Google sign-up didn't complete. Please try again.");
    } else if (oauthError === "google-not-configured") {
      toast.error(
        "Google sign-up isn't configured yet. Use your email instead.",
      );
    }
  }, [oauthError]);

  const onSubmit = handleSubmit((values) => {
    setFormError(undefined);
    startTransition(async () => {
      const result = await signUpAction(values);
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
      eyebrow="Join the house"
      title="Create your account"
      subtitle="Save your favourites, check out faster and be first to know about new drops."
    >
      <form onSubmit={onSubmit} className="space-y-5" noValidate>
        {formError ? <FormError message={formError} /> : null}

        <AuthField
          id="name"
          label="Full name"
          type="text"
          icon={User}
          autoComplete="name"
          placeholder="Your name"
          error={errors.name?.message}
          {...register("name")}
        />

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
          autoComplete="new-password"
          placeholder="8+ characters"
          error={errors.password?.message}
          {...register("password")}
        />

        <AuthField
          id="confirmPassword"
          label="Confirm password"
          type="password"
          icon={Lock}
          autoComplete="new-password"
          placeholder="Repeat your password"
          error={errors.confirmPassword?.message}
          {...register("confirmPassword")}
        />

        <AuthSubmitButton pending={isPending}>
          Create Account
        </AuthSubmitButton>
      </form>

      <OrDivider />

      <GoogleButton next={next} label="Sign up with Google" />

      <p className="mt-8 text-center text-sm text-ink/60">
        Already have an account?{" "}
        <Link
          href={`/sign-in${next !== "/" ? `?next=${encodeURIComponent(next)}` : ""}`}
          className="font-semibold text-gold transition-colors hover:text-gold hover:underline"
        >
          Sign in
        </Link>
      </p>
    </AuthShell>
  );
}
