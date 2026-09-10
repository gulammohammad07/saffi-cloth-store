import "server-only";

import { cookies } from "next/headers";
import { SignJWT, jwtVerify } from "jose";
import type { Role } from "@/lib/auth/config";
import {
  SESSION_COOKIE_NAME,
  SESSION_DURATION_MS,
  SESSION_DURATION_SECONDS,
  getAuthSecret,
} from "@/lib/auth/config";

export type SessionUser = {
  id: string;
  name: string;
  email: string;
  image: string | null;
  role: Role;
  provider: string;
};

export type SessionPayload = SessionUser & {
  expiresAt: Date;
};

function getEncodedKey(): Uint8Array {
  return new TextEncoder().encode(getAuthSecret());
}

export async function encryptSession(
  payload: Omit<SessionPayload, "expiresAt">,
  expiresAt: Date,
) {
  return new SignJWT({ ...payload })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(expiresAt)
    .sign(getEncodedKey());
}

export async function decryptSession(token: string | undefined | null) {
  if (!token) return null;
  try {
    const { payload } = await jwtVerify(token, getEncodedKey(), {
      algorithms: ["HS256"],
    });
    if (!payload || typeof payload.id !== "string") return null;
    return payload as unknown as SessionPayload;
  } catch {
    return null;
  }
}

export async function createSession(user: SessionUser) {
  const expiresAt = new Date(Date.now() + SESSION_DURATION_MS);
  const token = await encryptSession(user, expiresAt);
  const cookieStore = await cookies();
  cookieStore.set(SESSION_COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    expires: expiresAt,
    maxAge: SESSION_DURATION_SECONDS,
  });
}

export async function updateSession() {
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE_NAME)?.value;
  const session = await decryptSession(token);
  if (!session) return null;

  const expiresAt = new Date(Date.now() + SESSION_DURATION_MS);
  const refreshed = await encryptSession(
    {
      id: session.id,
      name: session.name,
      email: session.email,
      image: session.image,
      role: session.role,
      provider: session.provider,
    },
    expiresAt,
  );

  cookieStore.set(SESSION_COOKIE_NAME, refreshed, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    expires: expiresAt,
    maxAge: SESSION_DURATION_SECONDS,
  });

  return { ...session, expiresAt };
}

export async function deleteSession() {
  const cookieStore = await cookies();
  cookieStore.set(SESSION_COOKIE_NAME, "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 0,
  });
}

export async function getSession() {
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE_NAME)?.value;
  const session = await decryptSession(token);
  if (!session) return null;

  const expiresAt = new Date(session.expiresAt);
  if (expiresAt.getTime() < Date.now()) return null;

  return {
    ...session,
    expiresAt,
  } as SessionPayload;
}
