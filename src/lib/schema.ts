import { sql } from 'drizzle-orm';
import { integer, sqliteTable, text } from 'drizzle-orm/sqlite-core';

export const Users = sqliteTable('users', {
  username: text('username').primaryKey().notNull(),
  passwordHash: text('passwordHash').notNull(),
  createdAt: text('createdAt')
    .notNull()
    .default(sql`CURRENT_TIMESTAMP`)
});

export const Threads = sqliteTable('threads', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  parentId: integer('parentId'),
  username: text('username').notNull(),
  content: text('content').notNull(),
  createdAt: text('createdAt')
    .notNull()
    .default(sql`CURRENT_TIMESTAMP`)
});

export const Ents = sqliteTable('ents', {
  url: text('url').primaryKey().notNull(),
  username: text('username').notNull(),
  createdAt: text('createdAt')
    .notNull()
    .default(sql`CURRENT_TIMESTAMP`),
  approvedAt: text('approvedAt')
});
