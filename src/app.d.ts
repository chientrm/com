/// <reference types="@sveltejs/adapter-cloudflare"/>
/// <reference types="@cloudflare/workers-types"/>

import type { FeatureCollection } from 'geojson';
import type { JWTPayload } from 'jose';

declare global {
  namespace App {
    interface Locals {
      D1: D1Database;
      WORKER: Fetcher;
      tz: string;
      user?: User;
      colorMode: 'os' | 'dark' | 'white';
    }
    interface Platform {
      env: {
        D1: D1Database;
        WORKER: Fetcher;
      };
    }
    interface User extends JWTPayload {
      username: string;
      createdAt: Date;
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
