import "dotenv/config";
import prisma from "../config/prisma";

const sanitizeDatabaseUrl = (url?: string): string => {
  if (!url) {
    return "<missing>";
  }

  try {
    const parsed = new URL(url);
    const userPart = parsed.username ? `${parsed.username}:****@` : "";
    const portPart = parsed.port ? `:${parsed.port}` : "";
    return `${parsed.protocol}//${userPart}${parsed.hostname}${portPart}${parsed.pathname}`;
  } catch {
    return "<invalid DATABASE_URL format>";
  }
};

const main = async () => {
  const databaseUrl = process.env.DATABASE_URL;

  if (!databaseUrl) {
    console.error("DATABASE_URL is not set in environment variables.");
    process.exitCode = 1;
    return;
  }

  console.log("Checking database connectivity...");
  console.log(`Target: ${sanitizeDatabaseUrl(databaseUrl)}`);

  await prisma.$queryRaw`SELECT 1`;

  console.log("Database connectivity check successful.");
};

main()
  .catch((error) => {
    console.error("Database connectivity check failed.");
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
