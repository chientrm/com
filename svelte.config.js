import adapter from '@chientrm/adapter-cloudflare';
import { vitePreprocess } from '@sveltejs/kit/vite';
import { mdsvex } from 'mdsvex'

/** @type {import('@sveltejs/kit').Config} */
const config = {
	extensions: [
		'.svelte', '.svx',
	],
	preprocess: [mdsvex({ extension: '.svx' }), vitePreprocess()],
	kit: { adapter: adapter() }
};

export default config;
