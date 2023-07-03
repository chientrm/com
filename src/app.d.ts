/// <reference types="@sveltejs/adapter-cloudflare"/>
/// <reference types="@cloudflare/workers-types"/>

import { languages } from '$lib/constants/languages';

declare global {
  namespace App {
    type LanguageTuple = typeof languages;
    type Language = LanguageTuple[number];
    interface Locals {
      preferences: {};
      lang: Language;
    }
  }
}

export { languages };
