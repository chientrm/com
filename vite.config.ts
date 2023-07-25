import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vitest/config';
import { imagetools } from 'vite-imagetools';
import { geoJson } from './plugins/geojson';

export default defineConfig({
  plugins: [sveltekit(), imagetools(), geoJson()],
  test: {
    include: ['src/**/*.{test,spec}.{js,ts}']
  }
});
