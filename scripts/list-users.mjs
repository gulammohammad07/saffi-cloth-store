import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

function getConnectionString() {
  const raw = process.env.DATABASE_URL;
  if (!raw) throw new Error("DATABASE_URL is not set");
  const url = new URL(raw);
  const sslMode = url.searchParams.get("sslmode");
  if (["prefer", "require", "verify-ca"].includes(sslMode ?? "")) {
    url.searchParams.set("sslmode", "verify-full");
  }
  return url.toString();
}

const prisma = new PrismaClient({
  adapter: new PrismaPg({ connectionString: getConnectionString() }),
});

try {
  const users = await prisma.user.findMany({
    select: {
      id: true,
      email: true,
      role: true,
      provider: true,
      googleId: true,
      passwordHash: true,
      createdAt: true,
    },
    orderBy: { createdAt: "desc" },
    take: 20,
  });

  console.table(
    users.map(({ passwordHash, ...u }) => ({
      email: u.email,
      role: u.role,
      provider: u.provider,
      googleLinked: u.googleId ? "yes" : "no",
      hasPassword: passwordHash ? "yes" : "no",
      createdAt: u.createdAt.toISOString(),
      id: u.id,
    })),
  );
} catch (error) {
  console.error("Failed:", error.message);
  process.exitCode = 1;
} finally {
  await prisma.$disconnect();
}
