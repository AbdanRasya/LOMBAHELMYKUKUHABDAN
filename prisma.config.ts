import { defineConfig } from "prisma/config";
import * as dotenv from "dotenv";
import * as path from "path";

const projectRoot = process.cwd();
dotenv.config({ path: path.resolve(projectRoot, ".env") });

export default defineConfig({
  migrations: {
    seed: "tsx ./prisma/seed.ts",
  },
  datasource: {
    url: process.env.DATABASE_URL!,
  },
});
