/// <reference types="@sveltejs/adapter-cloudflare"/>
/// <reference types="@cloudflare/workers-types"/>

import * as schema from '$lib/schema';
import type { DrizzleD1Database } from 'drizzle-orm/d1';
import type { Feature, FeatureCollection, Point } from 'geojson';
import type { JWTPayload } from 'jose';
import 'unplugin-icons/types/svelte';

declare global {
  namespace App {
    interface Locals {
      db: DrizzleD1Database<typeof schema>;
      user: User;
    }
    interface Platform {
      env: {
        D1: D1Database;
      };
    }
    interface User extends JWTPayload {
      username: string;
    }
    interface Post {
      slug: string;
      title: string;
      description: string;
      date: string;
      published: boolean;
      authors: string;
      tags: string[];
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
