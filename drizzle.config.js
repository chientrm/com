import 'dotenv/config';
import { defineConfig } from 'drizzle-kit';

export default defineConfig({
    out: './drizzle',
    schema: './schema.js',
    dialect: 'sqlite',
    dbCredentials: {
        url: 'local.db',
    },
});
