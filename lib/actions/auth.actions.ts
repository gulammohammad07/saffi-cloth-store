"use server";

import {
  forgotPasswordSchema,
  resetPasswordSchema,
  signInSchema,
  signUpSchema,
  type ForgotPasswordInput,
  type ResetPasswordInput,
  type SignInInput,
  type SignUpInput,
} from "@/lib/validations/auth";
import { prisma } from "@/lib/prisma";
import { hashPassword, verifyPassword } from "@/lib/auth/password";
import { createSession, deleteSession } from "@/lib/auth/session";
import { ROLES } from "@/lib/auth/config";
import { isRateLimited } from "@/lib/auth/rate-limit";
import {
  createPasswordResetToken,
  findValidResetToken,
  invalidatePasswordResetTokens,
} from "@/lib/auth/tokens";
import { sendPasswordResetEmail } from "@/lib/auth/email";
import { getAppUrl } from "@/lib/auth/config";

export type AuthActionState = {
  success: boolean;
  message?: string;
  errors?: Record<string, string[] | undefined>;
};

const LOGIN_LIMIT = 10;
const LOGIN_WINDOW_MS = 15 * 60 * 1000;

function normalizeEmail(email: string): string {
  return email.trim().toLowerCase();
}

async function getClientKey(prefix: string): Promise<string> {
  const { headers } = await import("next/headers");
  const headersList = await headers();
  const ip =
    headersList.get("x-forwarded-for")?.split(",")[0]?.trim() ??
    headersList.get("x-real-ip") ??
    "unknown";
  return `${prefix}:${ip}`;
}

export async function signUpAction(
  input: SignUpInput,
): Promise<AuthActionState> {
  const validated = signUpSchema.safeParse(input);
  if (!validated.success) {
    return {
      success: false,
      message: "Please fix the highlighted fields.",
      errors: validated.error.flatten().fieldErrors,
    };
  }

  const { name, email } = validated.data;
  const normalizedEmail = normalizeEmail(email);

  if (
    isRateLimited(
      await getClientKey("signup"),
      20,
      LOGIN_WINDOW_MS,
    )
  ) {
    return {
      success: false,
      message: "Too many attempts. Please try again later.",
    };
  }

  const existing = await prisma.user.findUnique({
    where: { email: normalizedEmail },
    select: { id: true },
  });

  if (existing) {
    return {
      success: false,
      message: "An account with this email already exists. Please sign in.",
    };
  }

  const passwordHash = await hashPassword(validated.data.password);

  try {
    const user = await prisma.user.create({
      data: {
        name: name.trim(),
        email: normalizedEmail,
        passwordHash,
        provider: "credentials",
        role: ROLES.USER,
      },
      select: {
        id: true,
        name: true,
        email: true,
        image: true,
        role: true,
        provider: true,
      },
    });

    await createSession({
      id: user.id,
      name: user.name,
      email: user.email,
      image: user.image,
      role:
        user.role === ROLES.ADMIN || user.role === ROLES.SUBADMIN
          ? user.role
          : ROLES.USER,
      provider: user.provider,
    });
  } catch {
    return {
      success: false,
      message: "We couldn't create your account. Please try again.",
    };
  }

  return {
    success: true,
    message: "Account created successfully. Welcome to Libaas!",
  };
}

export async function signInAction(input: SignInInput): Promise<AuthActionState> {
  const validated = signInSchema.safeParse(input);
  if (!validated.success) {
    return {
      success: false,
      message: "Please fix the highlighted fields.",
      errors: validated.error.flatten().fieldErrors,
    };
  }

  const normalizedEmail = normalizeEmail(validated.data.email);

  if (isRateLimited(await getClientKey("login"), LOGIN_LIMIT, LOGIN_WINDOW_MS)) {
    return {
      success: false,
      message: "Too many sign-in attempts. Please try again later.",
    };
  }

  const user = await prisma.user.findUnique({
    where: { email: normalizedEmail },
    select: {
      id: true,
      name: true,
      email: true,
      image: true,
      role: true,
      provider: true,
      passwordHash: true,
    },
  });

  if (!user || !user.passwordHash) {
    return {
      success: false,
      message: "Invalid email or password.",
    };
  }

  const valid = await verifyPassword(validated.data.password, user.passwordHash);
  if (!valid) {
    return {
      success: false,
      message: "Invalid email or password.",
    };
  }

  await createSession({
    id: user.id,
    name: user.name,
    email: user.email,
    image: user.image,
    role:
      user.role === ROLES.ADMIN || user.role === ROLES.SUBADMIN
        ? user.role
        : ROLES.USER,
    provider: user.provider,
  });

  return {
    success: true,
    message: "Welcome back. You're signed in.",
  };
}

export async function signOutAction(): Promise<AuthActionState> {
  await deleteSession();
  return { success: true, message: "You've been signed out." };
}

export async function requestPasswordResetAction(
  input: ForgotPasswordInput,
): Promise<AuthActionState> {
  const validated = forgotPasswordSchema.safeParse(input);
  if (!validated.success) {
    return {
      success: false,
      message: "Please fix the highlighted fields.",
      errors: validated.error.flatten().fieldErrors,
    };
  }

  if (
    isRateLimited(await getClientKey("forgot"), 5, LOGIN_WINDOW_MS)
  ) {
    return {
      success: false,
      message: "Too many requests. Please try again later.",
    };
  }

  const normalizedEmail = normalizeEmail(validated.data.email);

  const user = await prisma.user.findUnique({
    where: { email: normalizedEmail },
    select: { id: true, name: true, email: true, passwordHash: true },
  });

  // Only issue reset tokens for accounts that have a password (not Google-only).
  if (user && user.passwordHash) {
    const token = await createPasswordResetToken(user.id);
    const resetUrl = `${getAppUrl()}/reset-password?token=${encodeURIComponent(token)}`;
    await sendPasswordResetEmail({
      to: user.email,
      name: user.name.split(" ")[0],
      resetUrl,
    });
  }

  return {
    success: true,
    message:
      "If an account exists for this email, a password reset link has been sent.",
  };
}

export async function resetPasswordAction(
  input: ResetPasswordInput,
): Promise<AuthActionState> {
  const validated = resetPasswordSchema.safeParse(input);
  if (!validated.success) {
    return {
      success: false,
      message: "Please fix the highlighted fields.",
      errors: validated.error.flatten().fieldErrors,
    };
  }

  const record = await findValidResetToken(validated.data.token);
  if (!record) {
    return {
      success: false,
      message:
        "This reset link is invalid or has expired. Please request a new one.",
    };
  }

  const passwordHash = await hashPassword(validated.data.password);

  try {
    await prisma.$transaction([
      prisma.user.update({
        where: { id: record.userId },
        data: {
          passwordHash,
          emailVerified: record.user.emailVerified ?? new Date(),
        },
      }),
      prisma.passwordResetToken.update({
        where: { id: record.id },
        data: { usedAt: new Date() },
      }),
    ]);

    await invalidatePasswordResetTokens(record.userId);
  } catch {
    return {
      success: false,
      message: "We couldn't reset your password. Please try again.",
    };
  }

  await createSession({
    id: record.user.id,
    name: record.user.name,
    email: record.user.email,
    image: record.user.image,
    role:
      record.user.role === ROLES.ADMIN || record.user.role === ROLES.SUBADMIN
        ? record.user.role
        : ROLES.USER,
    provider: record.user.provider,
  });

  return {
    success: true,
    message: "Your password has been reset. You're now signed in.",
  };
}
