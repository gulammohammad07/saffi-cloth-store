"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { CheckCircle2, Mail } from "lucide-react";
import { requestPasswordResetAction } from "@/lib/actions/auth.actions";
import {
  forgotPasswordSchema,
  type ForgotPasswordInput,
} from "@/lib/validations/auth";
import { AuthShell } from "@/components/auth/AuthShell";
import { AuthField } from "@/components/auth/AuthField";
import {
  AuthSubmitButton,
  FormError,
} from "@/components/auth/auth-buttons";

export function ForgotPasswordForm() {
  const router = useRouter();
  const [formError, setFormError] = useState<string | undefined>(undefined);
  const [sent, setSent] = useState(false);
  const [isPending, startTransition] = useTransition();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ForgotPasswordInput>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: { email: "" },
  });

  const onSubmit = handleSubmit((values) => {
    setFormError(undefined);
    startTransition(async () => {
      const result = await requestPasswordResetAction(values);
      if (!result.success) {
        setFormError(result.message);
        return;
      }
      setSent(true);
    });
  });

  return (
    <AuthShell
      eyebrow="Account recovery"
      title="Forgot your password?"
      subtitle="Enter the email linked to your account and we'll send you a secure link to reset it."
    >
      {sent ? (
        <div className="flex flex-col items-start gap-4 rounded-2xl border border-emerald-200 bg-emerald-50 p-6">
          <span className="flex h-11 w-11 items-center justify-center rounded-full bg-emerald-100">
            <CheckCircle2 size={22} className="text-emerald-600" />
          </span>
          <div>
            <h2 className="font-display text-base font-medium text-ink">
              Check your inbox
            </h2>
            <p className="mt-1.5 text-sm leading-relaxed text-ink/60">
              If an account exists for that email, a password reset link is on
              its way. The link expires in one hour.
            </p>
          </div>
          <button
            type="button"
            onClick={() => {
              setSent(false);
              router.push("/sign-in");
            }}
            className="text-sm font-semibold text-gold transition-colors hover:text-gold hover:underline"
          >
            Back to sign in
          </button>
        </div>
      ) : (
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

          <AuthSubmitButton pending={isPending}>
            Send reset link
          </AuthSubmitButton>
        </form>
      )}

      <p className="mt-8 text-center text-sm text-ink/60">
        Remembered your password?{" "}
        <Link
          href="/sign-in"
          className="font-semibold text-gold transition-colors hover:text-gold hover:underline"
        >
          Sign in
        </Link>
      </p>
    </AuthShell>
  );
}
