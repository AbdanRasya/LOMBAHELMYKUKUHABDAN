import { defineConfig } from "prisma/config";
import * as dotenv from "dotenv";
import * as path from "path";

dotenv.config({ path: path.resolve(__dirname, ".env") });

export default defineConfig({
  migrations: {
    seed: "tsx ./prisma/seed.ts",
  },
  datasource: {
    url: process.env.DATABASE_URL || "postgresql://username:password@ep-example.us-east-1.aws.neon.tech/sourcehub?sslmode=require",
  },
});
