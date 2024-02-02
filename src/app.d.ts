/// <reference types="@sveltejs/adapter-cloudflare"/>
/// <reference types="@cloudflare/workers-types"/>

import type { Feature, FeatureCollection, Point } from 'geojson';
import type { JWTPayload } from 'jose';
import 'unplugin-icons/types/svelte';

declare global {
  namespace App {
    interface Locals {
      D1: D1Database;
      user?: User;
    }
    interface Platform {
      env: {
        D1: D1Database;
      };
    }
    interface User extends JWTPayload {
      username: string;
    }
  }

  declare module '*?webp' {
    const value: any;
    export default value;
  }

  declare module '*&webp' {
    const value: any;
    export default value;
  }

  interface Country {
    id: string;
    group: Group;
    properties: CountryProperties;
    centerOfMass: Feature<Point, Properties>;
  }

  interface CountryProperties {
    name: string;
  }

  interface Group {
    vertices: number[];
    indices: number[];
  }

  declare module '*.geojson' {
    const value: string;
    export default value;
  }

  declare module 'vite-geograticule:*' {
    const value: string;
    export default value;
  }

  declare module 'vite-geoprop:*' {
    const value: FeatureCollection;
    export default value;
  }
}

export { Group };
