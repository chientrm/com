import { defineConfig } from "drizzle-kit";
import fs from "fs";
import os from "os";
import path from "path";

const homeDir = os.homedir();
const dbDir = path.join(homeDir, ".ulabs", "home");
const dbPath = path.join(dbDir, "drizzle.db");

fs.mkdirSync(dbDir, { recursive: true });

export default defineConfig({
  schema: "./src/db/schema.ts",
  dialect: "sqlite",
  dbCredentials: {
    url: `file:${dbPath}`,
  },
});
