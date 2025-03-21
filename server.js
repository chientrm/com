import express from 'express';
import path from 'path';
import { drizzle } from 'drizzle-orm/libsql';
import { int, sqliteTable, text } from "drizzle-orm/sqlite-core";

const app = express();
const PORT = 3000;

const db = drizzle();

export const usersTable = sqliteTable("users_table", {
    username: text().primaryKey(),
    passwordHash: text().notNull(),
});

// Serve static files from the "dist" directory
app.use(express.static(path.join(path.dirname(new URL(import.meta.url).pathname), 'dist')));

app.listen(PORT, () => {
    console.log(`Server is running at http://localhost:${PORT}`);
});
