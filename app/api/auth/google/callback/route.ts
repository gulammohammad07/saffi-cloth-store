import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { createSession } from "@/lib/auth/session";
import { ROLES, GOOGLE_OAUTH_COOKIE_NAME } from "@/lib/auth/config";
import { exchangeCodeForToken, fetchGoogleUser } from "@/lib/auth/google";
import { getGoogleRedirectUri } from "@/lib/auth/config";

export const dynamic = "force-dynamic";

type OAuthStatePayload = {
  state: string;
  codeVerifier: string;
  next: string;
};

function redirectToSignIn(request: NextRequest, next?: string) {
  const url = new URL("/sign-in", request.nextUrl);
  url.searchParams.set("error", "google");
  if (next && next.startsWith("/")) {
    url.searchParams.set("next", next);
  }
  const response = NextResponse.redirect(url);
  response.cookies.delete(GOOGLE_OAUTH_COOKIE_NAME);
  return response;
}

export async function GET(request: NextRequest) {
  const code = request.nextUrl.searchParams.get("code");
  const state = request.nextUrl.searchParams.get("state");
  const errorParam = request.nextUrl.searchParams.get("error");

  if (errorParam) {
    return redirectToSignIn(request);
  }

  const rawState = request.cookies.get(GOOGLE_OAUTH_COOKIE_NAME)?.value;

  if (!code || !state || !rawState) {
    return redirectToSignIn(request);
  }

  let oauthState: OAuthStatePayload;
  try {
    oauthState = JSON.parse(rawState) as OAuthStatePayload;
  } catch {
    return redirectToSignIn(request);
  }

  if (oauthState.state !== state) {
    return redirectToSignIn(request);
  }

  let googleUser;
  try {
    const tokens = await exchangeCodeForToken({
      code,
      codeVerifier: oauthState.codeVerifier,
      redirectUri: getGoogleRedirectUri(),
    });

    if (!tokens.access_token) {
      return redirectToSignIn(request);
    }

    googleUser = await fetchGoogleUser(tokens.access_token);

    const normalizedEmail = googleUser.email.trim().toLowerCase();
    const now = new Date();
    const expiresAt = tokens.expires_in
      ? Math.floor(now.getTime() / 1000) + tokens.expires_in
      : null;

    let user = await prisma.user.findUnique({
      where: { googleId: googleUser.sub },
    });

    if (!user) {
      user = await prisma.user.findUnique({
        where: { email: normalizedEmail },
      });
    }

    if (user) {
      user = await prisma.user.update({
        where: { id: user.id },
        data: {
          googleId: user.googleId ?? googleUser.sub,
          name: user.name || googleUser.name || user.email.split("@")[0],
          image: user.image ?? googleUser.picture ?? null,
          emailVerified: user.emailVerified ?? now,
        },
      });
    } else {
      user = await prisma.user.create({
        data: {
          name:
            googleUser.name?.trim() ||
            googleUser.email.split("@")[0] ||
            "Guest",
          email: normalizedEmail,
          emailVerified: now,
          image: googleUser.picture ?? null,
          provider: "google",
          googleId: googleUser.sub,
          role: ROLES.USER,
        },
      });
    }

    await prisma.account.upsert({
      where: {
        provider_providerAccountId: {
          provider: "google",
          providerAccountId: googleUser.sub,
        },
      },
      update: {
        accessToken: tokens.access_token,
        refreshToken: tokens.refresh_token,
        expiresAt,
        tokenType: tokens.token_type,
        scope: tokens.scope,
        idToken: tokens.id_token,
      },
      create: {
        userId: user.id,
        provider: "google",
        providerAccountId: googleUser.sub,
        accessToken: tokens.access_token,
        refreshToken: tokens.refresh_token,
        expiresAt,
        tokenType: tokens.token_type,
        scope: tokens.scope,
        idToken: tokens.id_token,
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

    const destination =
      typeof oauthState.next === "string" &&
      oauthState.next.startsWith("/") &&
      !oauthState.next.startsWith("//")
        ? oauthState.next
        : "/";

    const redirectResponse = NextResponse.redirect(new URL(destination, request.nextUrl));
    redirectResponse.cookies.delete(GOOGLE_OAUTH_COOKIE_NAME);
    return redirectResponse;
  } catch (error) {
    console.error("[Google OAuth Callback Error]:", error);
    return redirectToSignIn(request);
  }
}
