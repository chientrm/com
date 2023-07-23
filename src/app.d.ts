/// <reference types="@sveltejs/adapter-cloudflare"/>
/// <reference types="@cloudflare/workers-types"/>

import type { JWTPayload } from 'jose';

declare global {
  namespace App {
    type LanguageTuple = typeof languages;
    type Language = LanguageTuple[number];
    type ColorModeTuple = typeof colorModes;
    type ColorMode = ColorModeTuple[number];
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
}

export { languages };
