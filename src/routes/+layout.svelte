<script lang="ts">
  import '$lib/app.css';
  import logo from '$lib/assets/logo.png';
  import 'modern-normalize/modern-normalize.css';
  import type { LayoutData } from './$types';
  export let data: LayoutData;
</script>

<svelte:head>
  <link rel="icon" href={logo} />
</svelte:head>

<content>
  <header>
    <div>
      <a href="/">
        <img src={logo} alt="Logo" />
        chientrm
      </a>
      <a href="/ask">ask</a>
    </div>
    {#if data.user}
      <div>
        <a href={`/user/${data.user.username}`}>{data.user.username}</a>
        <form method="POST" action="/?/logout">
          <button>logout</button>
        </form>
      </div>
    {:else}
      <a href="/auth">Login</a>
    {/if}
  </header>
  <slot />
</content>

{#if data.colorMode === 'os'}
  <style>
    @media (prefers-color-scheme: dark) {
      body {
        background: black;
        color: white;
      }
    }
    @media (prefers-color-scheme: light) {
      body {
        background: white;
        color: dark;
      }
    }
  </style>
{:else if data.colorMode === 'dark'}
  <style>
    body {
      background: black;
      color: white;
    }
  </style>
{/if}

<style>
  header {
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
    gap: 4pt;
    background-color: darkgreen;
  }
  a,
  div {
    display: flex;
    flex-direction: row;
    align-items: center;
    padding-right: 8pt;
  }
  img {
    padding: 2pt;
  }
</style>
