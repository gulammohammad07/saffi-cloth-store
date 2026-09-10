/**
 * Canonical public origin for the storefront.
 *
 * Set NEXT_PUBLIC_APP_URL in the deploy environment. The localhost fallback is
 * only here so `next build` and local runs do not crash — if a deployed
 * robots.txt or sitemap.xml ever shows localhost URLs, that env var is missing.
 */
function resolveSiteUrl(): string {
  const raw =
    process.env.NEXT_PUBLIC_APP_URL ||
    (process.env.VERCEL_PROJECT_PRODUCTION_URL
      ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
      : null) ||
    (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : null) ||
    "http://localhost:3000";

  const trimmed = raw.trim();
  if (!trimmed || trimmed === "undefined") {
    return "http://localhost:3000";
  }

  const withProtocol =
    trimmed.startsWith("http://") || trimmed.startsWith("https://")
      ? trimmed
      : `https://${trimmed}`;

  try {
    new URL(withProtocol);
    return withProtocol.replace(/\/+$/, "");
  } catch {
    return "http://localhost:3000";
  }
}

export const siteUrl = resolveSiteUrl();
