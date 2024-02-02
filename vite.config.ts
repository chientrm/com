import { sveltekit } from '@sveltejs/kit/vite';
import Icons from 'unplugin-icons/vite';
import { defineConfig } from 'vitest/config';
import { geograticule } from './plugins/geograticule';
import { geojson } from './plugins/geojson';
import { geoprop } from './plugins/geoprop';

export default defineConfig({
  plugins: [
    sveltekit(),
    geograticule(),
    geojson(),
    geoprop(),
    Icons({
      compiler: 'svelte'
    })
  ],
  test: {
    include: ['src/**/*.{test,spec}.{js,ts}']
  }
});
