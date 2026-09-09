import { Suspense } from "react";
import type { Metadata } from "next";
import { SignInForm } from "@/components/auth/SignInForm";

export const metadata: Metadata = {
  title: "Sign In",
  description: "Sign in to your Libaas account to track orders, manage your wishlist and unlock member offers.",
};

export default function SignInPage() {
  return (
    <Suspense fallback={null}>
      <SignInForm />
    </Suspense>
  );
}
