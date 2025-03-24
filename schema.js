import {
    index,
    integer,
    sqliteTable,
    text,
    numeric,
} from 'drizzle-orm/sqlite-core';

export const usersTable = sqliteTable('users_table', {
    username: text().primaryKey(),
    passwordHash: text().notNull(),
    role: text(),
});

export const galleryTable = sqliteTable(
    'gallery_table',
    {
        id: integer('id').primaryKey({ autoIncrement: true }),
        filename: text('filename').notNull(),
        uploadedBy: text('uploaded_by').notNull(),
        uploadedAt: integer('uploaded_at').notNull(),
        classifiedAt: integer('classified_at'), // Replaced classified with classifiedAt
    },
    (table) => [index('uploadedByIndex').on(table.uploadedBy)]
);

export const imageClassesTable = sqliteTable(
    'image_classes_table',
    {
        id: integer('id').primaryKey({ autoIncrement: true }),
        imageId: integer('image_id').notNull(),
        className: text('class_name').notNull(),
        probability: numeric('probability').notNull(),
    },
    (table) => [
        index('imageIdIndex').on(table.imageId),
        index('classNameIndex').on(table.className),
    ]
);
