import { defineConfig } from 'vite';
import dotenv from 'dotenv';

dotenv.config();

export default defineConfig({
    server: {
        proxy: {
            '/api': {
                target: process.env.VITE_PROXY_TARGET,
                changeOrigin: true,
            },
        },
    },
});
