import { config as loadEnv } from "dotenv";
import { defineConfig, type Config } from "drizzle-kit";

// Drizzle CLI は Next.js の `.env.local` を自動で読み込まないため、ここで明示的に読む
loadEnv({ path: ".env" });
loadEnv({ path: ".env.local", override: true });

const databaseUrl = process.env.DATABASE_URL;

if (!databaseUrl) {
  throw new Error(
    "DATABASE_URL が設定されていません。.env.local を確認してください。"
  );
}

export default defineConfig({
  schema: "./db/schema.ts",
  out: "./drizzle",
  dialect: "postgresql",
  dbCredentials: {
    url: databaseUrl,
  },
}) satisfies Config;
