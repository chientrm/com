import { sveltekit } from '@sveltejs/kit/vite';
import { imagetools } from 'vite-imagetools';
import { defineConfig } from 'vitest/config';
import { geoJson } from './plugins/geojson';
import { geomesh } from './plugins/geomesh';

export default defineConfig({
  plugins: [sveltekit(), imagetools(), geoJson(), geomesh()],
  test: {
    include: ['src/**/*.{test,spec}.{js,ts}']
  }
});
