import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core';

export const usersTable = sqliteTable('users_table', {
    username: text().primaryKey(),
    passwordHash: text().notNull(),
    role: text(),
});

export const galleryTable = sqliteTable('gallery', {
    id: integer('id', { primaryKey: true, autoIncrement: true }),
    filename: text('filename').notNull(),
    uploadedBy: text('uploaded_by').notNull(),
    uploadedAt: integer('uploaded_at').notNull(), // Unix timestamp
});
