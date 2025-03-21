import { sql } from 'drizzle-orm';

export const up = async (db) => {
	await db.execute(sql`
		CREATE TABLE user (
			username TEXT PRIMARY KEY NOT NULL,
			password TEXT NOT NULL
		)
	`);
};

export const down = async (db) => {
	await db.execute(sql`DROP TABLE IF EXISTS user`);
};
