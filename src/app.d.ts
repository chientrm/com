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
      tz: string;
      user?: User;
      colorMode: 'os' | 'dark' | 'white';
    }
    interface Platform {
      env: {
        D1: D1Database;
      };
    }
    interface User extends JWTPayload {
      username: string;
      createdAt: Date;
    }
  }
}

export { languages };
