import { registerSchema, loginSchema } from "./lib/validations/index.ts";
import "dotenv/config";
import bcrypt from "bcryptjs";

console.log("=== ENV CHECK ===");
console.log("DATABASE_URL set:", !!process.env.DATABASE_URL);
console.log("AUTH_SECRET set:", !!process.env.AUTH_SECRET);
if (process.env.DATABASE_URL) {
  const m = process.env.DATABASE_URL.match(/@([^/]+)/);
  console.log("DB host:", m ? m[1] : "unknown");
}

console.log("\n=== BCRYPT CHECK ===");
try {
  const hash = await bcrypt.hash("testpassword123", 10);
  console.log("bcrypt.hash works:", typeof hash === "string" && hash.length > 0);
  const ok = await bcrypt.compare("testpassword123", hash);
  console.log("bcrypt.compare works:", ok);
  const bad = await bcrypt.compare("wrong", hash);
  console.log("bcrypt.compare (wrong):", bad === false);
} catch (e) {
  console.error("BCRYPT ERROR:", e.message);
}

console.log("\n=== ZOD VALIDATION CHECK ===");
try {
  const reg = registerSchema.safeParse({
    name: "Test Perusahaan",
    email: "test@example.com",
    password: "password123",
    confirmPassword: "password123",
    role: "COMPANY",
    agreeToTerms: true,
  });
  console.log("registerSchema valid:", reg.success);
  if (!reg.success) console.log("  errors:", JSON.stringify(reg.error.flatten()));

  const log = loginSchema.safeParse({
    email: "test@example.com",
    password: "password123",
  });
  console.log("loginSchema valid:", log.success);
  if (!log.success) console.log("  errors:", JSON.stringify(log.error.flatten()));
} catch (e) {
  console.error("ZOD ERROR:", e.message);
}

console.log("\n=== PRISMA CLIENT INIT ===");
try {
  const { db, getDbStatus, isDatabaseConfigured } = await import("./lib/db.ts");
  const status = getDbStatus();
  console.log("getDbStatus:", status);
  console.log("isDatabaseConfigured:", isDatabaseConfigured());
  if (status.available) {
    try {
      console.log("\n--- Attempting user query (might fail if no tables) ---");
      const user = await db.user.findFirst({ take: 1 });
      console.log("findFirst success, got:", user ? `user: ${user.email}` : "no users");
    } catch (qErr) {
      console.log("QUERY ERROR (expected if no tables yet):", qErr.message.split("\n")[0]);
    }
  }
} catch (e) {
  console.error("PRISMA INIT ERROR:", e.message, e.stack?.split("\n")[0]);
}
