/// <reference types="@sveltejs/adapter-cloudflare"/>
/// <reference types="@cloudflare/workers-types"/>

declare global {
  namespace App {
    interface Locals {
      country: 'US' | 'VN';
    }
  }
}

export {};
