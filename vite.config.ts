import { sveltekit } from '@sveltejs/kit/vite';
import Icons from 'unplugin-icons/vite';
import { imagetools } from 'vite-imagetools';
import { defineConfig } from 'vitest/config';
import { geograticule } from './plugins/geograticule';
import { geojson } from './plugins/geojson';
import { geoprop } from './plugins/geoprop';  

export default defineConfig({ 
  plugins: [sveltekit(), imagetools(), geograticule(), geojson(), geoprop(), 
    Icons({
    compiler: 'svelte',
  })],
  test: {
    include: ['src/**/*.{test,spec}.{js,ts}']
  }
});
