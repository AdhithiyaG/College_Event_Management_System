import "dotenv/config";
import { PrismaClient } from "@prisma/client";
import { PrismaMariaDb } from "@prisma/adapter-mariadb";

const databaseUrl = process.env.DATABASE_URL;

if (!databaseUrl) {
  throw new Error("DATABASE_URL is not set in environment variables.");
}

const parsedDatabaseUrl = new URL(databaseUrl);
const adapter = new PrismaMariaDb({
  host: parsedDatabaseUrl.hostname,
  port: parsedDatabaseUrl.port ? Number(parsedDatabaseUrl.port) : 3306,
  user: decodeURIComponent(parsedDatabaseUrl.username),
  password: decodeURIComponent(parsedDatabaseUrl.password),
  database: parsedDatabaseUrl.pathname.replace(/^\//, ""),
  // Required by some managed MySQL providers that use caching_sha2_password.
  allowPublicKeyRetrieval: true,
  connectTimeout: 10000,
});

const prisma = new PrismaClient({
  adapter,
});

export default prisma;
