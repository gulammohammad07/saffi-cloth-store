"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { AlertTriangle, KeyRound, Lock } from "lucide-react";
import { resetPasswordAction } from "@/lib/actions/auth.actions";
import { resetPasswordSchema } from "@/lib/validations/auth";
import { useAuth } from "@/lib/store/auth-context";
import { AuthShell } from "@/components/auth/AuthShell";
import { AuthField } from "@/components/auth/AuthField";
import {
  AuthSubmitButton,
  FormError,
} from "@/components/auth/auth-buttons";

export function ResetPasswordForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { refresh } = useAuth();

  const token = searchParams.get("token") ?? "";
  const [formError, setFormError] = useState<string | undefined>(() =>
    token
      ? undefined
      : "This reset link is missing or incomplete. Please request a new one.",
  );
  const [isPending, startTransition] = useTransition();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<{ password: string; confirmPassword: string }>({
    resolver: zodResolver(
      resetPasswordSchema.pick({ password: true, confirmPassword: true }),
    ),
    defaultValues: { password: "", confirmPassword: "" },
  });

  const onSubmit = handleSubmit((values) => {
    if (!token) return;
    setFormError(undefined);
    startTransition(async () => {
      const result = await resetPasswordAction({
        token,
        password: values.password,
        confirmPassword: values.confirmPassword,
      });
      if (!result.success) {
        setFormError(result.message);
        return;
      }
      toast.success(result.message);
      await refresh();
      router.push("/");
      router.refresh();
    });
  });

  return (
    <AuthShell
      eyebrow="Set a new password"
      title="Reset your password"
      subtitle="Choose a strong password you haven't used for this account before."
    >
      {!token ? (
        <div className="flex flex-col items-start gap-4 rounded-2xl border border-amber-200 bg-amber-50 p-6">
          <span className="flex h-11 w-11 items-center justify-center rounded-full bg-amber-100">
            <AlertTriangle size={22} className="text-amber-600" />
          </span>
          <p className="text-sm leading-relaxed text-ink/60">
            {formError ?? "The reset link is invalid. Please request a new one."}
          </p>
          <Link
            href="/forgot-password"
            className="text-sm font-semibold text-gold transition-colors hover:text-gold hover:underline"
          >
            Request a new link
          </Link>
        </div>
      ) : (
        <form onSubmit={onSubmit} className="space-y-5" noValidate>
          {formError ? <FormError message={formError} /> : null}

          <div className="flex items-center gap-2.5 rounded-xl border border-ink/10 bg-cream px-4 py-3 text-xs text-ink/60">
            <KeyRound size={14} className="shrink-0 text-gold" />
            <span className="truncate">
              Reset link token: {token.slice(0, 18)}…
            </span>
          </div>

          <AuthField
            id="password"
            label="New password"
            type="password"
            icon={Lock}
            autoComplete="new-password"
            placeholder="8+ characters"
            error={errors.password?.message}
            {...register("password")}
          />

          <AuthField
            id="confirmPassword"
            label="Confirm new password"
            type="password"
            icon={Lock}
            autoComplete="new-password"
            placeholder="Repeat your password"
            error={errors.confirmPassword?.message}
            {...register("confirmPassword")}
          />

          <AuthSubmitButton pending={isPending}>
            Reset password
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
