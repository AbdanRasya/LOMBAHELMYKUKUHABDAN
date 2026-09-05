import { PrismaClient } from "@prisma/client";
import { neonConfig } from "@neondatabase/serverless";
import { PrismaNeon } from "@prisma/adapter-neon";
import ws from "ws";

neonConfig.webSocketConstructor = ws;

type SqlQuery = {
  sql: string;
  args: Array<unknown>;
  argTypes: Array<unknown>;
};

type SqlResultSet = {
  columnTypes: Array<unknown>;
  columnNames: Array<string>;
  rows: Array<Array<unknown>>;
  lastInsertId?: string;
};

type IsolationLevel =
  | "ReadUncommitted"
  | "ReadCommitted"
  | "RepeatableRead"
  | "Snapshot"
  | "Serializable";

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

type PrismaClientAdapterOpts = {
  adapter: {
    provider: string;
    adapterName: string;
    connect: () => Promise<{
      provider: string;
      adapterName: string;
      queryRaw: (q: SqlQuery) => Promise<SqlResultSet>;
      executeRaw: (q: SqlQuery) => Promise<number>;
      executeScript: (s: string) => Promise<void>;
      startTransaction: (l?: IsolationLevel) => Promise<{
        provider: string;
        adapterName: string;
        queryRaw: (q: SqlQuery) => Promise<SqlResultSet>;
        executeRaw: (q: SqlQuery) => Promise<number>;
        commit: () => Promise<void>;
        rollback: () => Promise<void>;
      }>;
      getConnectionInfo?: () => { schemaName?: string };
      dispose: () => Promise<void>;
    }>;
  };
  log: ("error" | "warn" | "info" | "query")[];
};

type PrismaClientCtor = new (opts: PrismaClientAdapterOpts) => PrismaClient;

function makeDbError(reason: string): Error {
  return new Error("[PUSAKA] Database tidak tersedia: " + reason);
}

function createPrismaClient() {
  const dbStatus = getDbStatus();
  if (!dbStatus.available) {
    globalForPrisma.dbAvailable = false;
    const reason = dbStatus.reason;

    const errorTx = {
      provider: "postgres" as const,
      adapterName: "@PUSAKA/error-adapter",
      queryRaw: (): Promise<SqlResultSet> => Promise.reject(makeDbError(reason)),
      executeRaw: (): Promise<number> => Promise.reject(makeDbError(reason)),
      commit: (): Promise<void> => Promise.reject(makeDbError(reason)),
      rollback: (): Promise<void> => Promise.reject(makeDbError(reason)),
    };

    const errorAdapter = {
      provider: "postgres" as const,
      adapterName: "@PUSAKA/error-adapter",
      connect: async () => ({
        provider: "postgres" as const,
        adapterName: "@PUSAKA/error-adapter",
        queryRaw: (): Promise<SqlResultSet> => Promise.reject(makeDbError(reason)),
        executeRaw: (): Promise<number> => Promise.reject(makeDbError(reason)),
        executeScript: (): Promise<void> => Promise.reject(makeDbError(reason)),
        startTransaction: async () => errorTx,
        getConnectionInfo: () => ({ schemaName: "public" }),
        dispose: async () => {},
      }),
    };

    return new (PrismaClient as unknown as PrismaClientCtor)({
      adapter: errorAdapter,
      log: process.env.NODE_ENV === "development" ? ["error", "warn"] : ["error"],
    });
  }

  globalForPrisma.dbAvailable = true;
  const connectionString = process.env.DATABASE_URL!;
  const adapter = new PrismaNeon({ connectionString });

  return new (PrismaClient as unknown as PrismaClientCtor)({
    adapter: adapter as unknown as PrismaClientAdapterOpts["adapter"],
    log: process.env.NODE_ENV === "development" ? ["error", "warn"] : ["error"],
  });
}

export const db =
  globalForPrisma.prisma ?? createPrismaClient();

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = db;
}
