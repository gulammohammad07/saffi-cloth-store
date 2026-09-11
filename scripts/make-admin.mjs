import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

const EMAIL = (process.argv[2] ?? "").trim().toLowerCase();
if (!EMAIL || !EMAIL.includes("@")) {
  console.error("Usage: node --env-file=.env scripts/make-admin.mjs <email>");
  process.exit(1);
}
const ADMIN_ROLE = "ADMIN";

function getConnectionString() {
  const raw = process.env.DATABASE_URL;
  if (!raw) throw new Error("DATABASE_URL is not set — run with: node --env-file=.env scripts/make-admin.mjs <email>");

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
  const user = await prisma.user.findUnique({ where: { email: EMAIL } });

  if (user) {
    if (user.role === ADMIN_ROLE) {
      console.log(`✔ ${EMAIL} is already an ADMIN (nothing to do).`);
    } else {
      await prisma.user.update({
        where: { email: EMAIL },
        data: { role: ADMIN_ROLE },
      });
      console.log(`✔ Promoted ${EMAIL} from ${user.role} to ${ADMIN_ROLE}.`);
    }
    console.log(`  (existing user, id: ${user.id})`);
  } else {
    await prisma.user.create({
      data: {
        email: EMAIL,
        name: EMAIL.split("@")[0],
        role: ADMIN_ROLE,
        provider: "credentials",
      },
    });
    console.log(`✔ Created ${EMAIL} with role ${ADMIN_ROLE}.`);
    console.log("  Note: no password set yet — sign up with this email first,");
    console.log("  or the promotion above applies to the row this just created.");
  }
} catch (error) {
  console.error("✖ Failed:", error.message);
  process.exitCode = 1;
} finally {
  await prisma.$disconnect();
}
