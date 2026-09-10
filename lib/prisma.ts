import "server-only";

import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

function getConnectionString(): string {
  const raw = process.env.DATABASE_URL;
  if (!raw || raw === "undefined") {
    // Provide a safe dummy connection string at build time so module evaluation doesn't crash
    return "postgresql://postgres:postgres@localhost:5432/postgres";
  }

  try {
    const databaseUrl = new URL(raw);
    const sslMode = databaseUrl.searchParams.get("sslmode");

    // pg will soon change the meaning of these aliases. Keep the current,
    // certificate-verifying behavior explicitly and avoid the deprecation warning.
    if (["prefer", "require", "verify-ca"].includes(sslMode ?? "")) {
      databaseUrl.searchParams.set("sslmode", "verify-full");
    }

    return databaseUrl.toString();
  } catch {
    return raw;
  }
}

const connectionString = getConnectionString();

const adapter = new PrismaPg({
  connectionString,
});

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    adapter,
  });

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}
