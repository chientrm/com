<script lang="ts">
  import '$lib/app.css';
  import favicon from '$lib/assets/favicon.png';
  import 'modern-normalize/modern-normalize.css';
  import type { LayoutData } from './$types';
  export let data: LayoutData;
</script>

<svelte:head>
  <link rel="icon" href={favicon} />
</svelte:head>

<div>
  <h2>
    <a href="/">chientrm.com</a>
  </h2>
  <slot />
</div>

{#if data.c === 'dark'}
  <style>
    div {
      color: white;
      background-color: black;
    }
  </style>
{:else}
  <style>
    div {
      color: black;
      background-color: white;
    }
  </style>
{/if}

<style>
  div {
    display: flex;
    flex-direction: column;
    gap: 8pt;
    min-height: 100vh;
  }
  h2 {
    padding: 0 8pt;
  }
</style>
