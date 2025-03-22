import { defineConfig } from 'vite';
import dotenv from 'dotenv';
import tailwindcss from '@tailwindcss/vite'

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
    plugins: [
        tailwindcss()
    ]
});
