import { sqliteTable, text } from 'drizzle-orm/sqlite-core';

export const user = sqliteTable('user', {
	username: text('username').primaryKey().notNull(),
	password: text('password').notNull()
});
