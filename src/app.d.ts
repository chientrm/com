/// <reference types="@sveltejs/adapter-cloudflare"/>
/// <reference types="@cloudflare/workers-types"/>

import type { colorModes } from '$lib/constants/color_modes';
import { languages } from '$lib/constants/languages';

declare global {
  namespace App {
    type LanguageTuple = typeof languages;
    type Language = LanguageTuple[number];
    type ColorModeTuple = typeof colorModes;
    type ColorMode = ColorModeTuple[number];
  }
}

export { languages };
