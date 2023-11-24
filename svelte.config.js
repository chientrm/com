import adapter from '@sveltejs/adapter-cloudflare';
import { vitePreprocess } from '@sveltejs/kit/vite';
import { mdsvex } from 'mdsvex';
/** @type {import('@sveltejs/kit').Config}*/
const config = {
  extensions: ['.svelte', '.svx', '.md'],
  preprocess: [
    mdsvex({
      extension: '.svx'
    }),
    vitePreprocess({})
  ],
  kit: {
    adapter: adapter(),
    alias: {
      $components: 'src/lib/components',
      '$components/*': 'src/lib/components/*'
    }
  },
  shadcn: {
    componentPath: './src/lib/components/ui'
  }
};
export default config;
