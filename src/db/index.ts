import { createClient } from "@libsql/client";
import { drizzle } from "drizzle-orm/libsql";
import fs from "fs";
import os from "os";
import path from "path";
import * as schema from "./schema";

const homeDir = os.homedir();
const dbDir = path.join(homeDir, ".ulabs", "home");
const dbPath = path.join(dbDir, "drizzle.db");

fs.mkdirSync(dbDir, { recursive: true });
const client = createClient({ url: `file:${dbPath}` });
export const db = drizzle({ client, schema });
