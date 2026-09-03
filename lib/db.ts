import { PrismaClient } from "@prisma/client";
import { neonConfig } from "@neondatabase/serverless";
import { PrismaNeon } from "@prisma/adapter-neon";
import ws from "ws";

neonConfig.webSocketConstructor = ws;

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
  dbAvailable: boolean | undefined;
};

export function isDatabaseConfigured(): boolean {
  const cs = process.env.DATABASE_URL;
  return !!cs && cs.length > 0 && !cs.startsWith("postgresql://user:pass") && !cs.includes("your-");
}

export function getDbStatus(): { available: boolean; reason: string } {
  const cs = process.env.DATABASE_URL;
  if (!cs) return { available: false, reason: "DATABASE_URL tidak diatur di .env" };
  if (cs.includes("your-") || cs.startsWith("postgresql://user:pass"))
    return { available: false, reason: "DATABASE_URL masih placeholder" };
  if (cs.length < 20) return { available: false, reason: "DATABASE_URL terlalu pendek" };
  return { available: true, reason: "DATABASE_URL tersedia" };
}

type ErrorAdapter = {
  queryRaw: () => Promise<never>;
  queryCallback: () => Promise<never>;
  close: () => Promise<void>;
};

type PrismaClientCtor = new (opts: {
  adapter: ErrorAdapter;
  log: ("error" | "warn" | "info" | "query")[];
}) => PrismaClient;

type PrismaClientNormalCtor = new (opts: {
  adapter: PrismaNeon;
  log: ("error" | "warn" | "info" | "query")[];
}) => PrismaClient;

function createPrismaClient() {
  const dbStatus = getDbStatus();
  if (!dbStatus.available) {
    globalForPrisma.dbAvailable = false;
    const errorAdapter: ErrorAdapter = {
      queryRaw: () => Promise.reject(new Error("DB not configured: " + dbStatus.reason)),
      queryCallback: () => Promise.reject(new Error("DB not configured: " + dbStatus.reason)),
      close: async () => {},
    };
    const client = new (PrismaClient as unknown as PrismaClientCtor)({
      adapter: errorAdapter,
      log: process.env.NODE_ENV === "development" ? ["error", "warn"] : ["error"],
    });
    return client;
  }
  globalForPrisma.dbAvailable = true;
  const connectionString = process.env.DATABASE_URL!;
  const adapter = new PrismaNeon({ connectionString });
  return new (PrismaClient as unknown as PrismaClientNormalCtor)({
    adapter,
    log: process.env.NODE_ENV === "development" ? ["error", "warn"] : ["error"],
  });
}

export const db =
  globalForPrisma.prisma ?? createPrismaClient();

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = db;
}
