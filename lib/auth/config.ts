import "server-only";

export const SESSION_COOKIE_NAME = "session";
export const SESSION_DURATION_SECONDS = 60 * 60 * 24 * 7;
export const SESSION_DURATION_MS = SESSION_DURATION_SECONDS * 1000;

export const GOOGLE_OAUTH_COOKIE_NAME = "google_oauth_state";

export const RESET_TOKEN_TTL_MS = 60 * 60 * 1000;

export const ROLES = {
  USER: "USER",
  ADMIN: "ADMIN",
  SUBADMIN: "SUBADMIN",
} as const;

export type Role = (typeof ROLES)[keyof typeof ROLES];

export function getAuthSecret(): string {
  const secret = process.env.AUTH_SECRET;
  if (!secret || secret === "undefined") {
    if (process.env.NODE_ENV === "production") {
      if (process.env.NEXT_PHASE === "phase-production-build") {
        return "build-time-secret-placeholder-do-not-use-in-production";
      }
      throw new Error(
        "AUTH_SECRET is not set. Generate one with `openssl rand -base64 32`.",
      );
    }
    return "dev-only-insecure-secret-change-me-in-production";
  }
  return secret;
}

export function getAppUrl(): string {
  const envUrl = (
    process.env.AUTH_URL ||
    process.env.NEXT_PUBLIC_APP_URL ||
    (process.env.VERCEL_PROJECT_PRODUCTION_URL
      ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
      : null) ||
    (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : null) ||
    "http://localhost:3000"
  ).trim();

  if (!envUrl || envUrl === "undefined") {
    return "http://localhost:3000";
  }

  const withProtocol =
    envUrl.startsWith("http://") || envUrl.startsWith("https://")
      ? envUrl
      : `https://${envUrl}`;

  return withProtocol.replace(/\/+$/, "");
}

export function isGoogleOAuthConfigured(): boolean {
  return Boolean(
    process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET,
  );
}

export function getGoogleClientId(): string {
  return process.env.GOOGLE_CLIENT_ID ?? "";
}

export function getGoogleClientSecret(): string {
  return process.env.GOOGLE_CLIENT_SECRET ?? "";
}

export function getGoogleRedirectUri(): string {
  return `${getAppUrl()}/api/auth/google/callback`;
}
