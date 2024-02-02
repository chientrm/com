import adapter from '@sveltejs/adapter-cloudflare';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';
import { mdsvex } from 'mdsvex';

/** @type {import('@sveltejs/kit').Config}*/
const config = {
  extensions: ['.svelte', '.svx', '.md'],
  preprocess: [mdsvex({ extension: '.svx' }), vitePreprocess({})],
  kit: { adapter: adapter() }
};
export default config;
