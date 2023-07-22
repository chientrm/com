import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';
import { imagetools } from 'vite-imagetools';
import { geoJson } from './geojson';

export default defineConfig({
  plugins: [sveltekit(), imagetools(), geoJson()]
});
