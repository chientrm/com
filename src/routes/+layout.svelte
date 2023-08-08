<script lang="ts">
  import { navigating } from '$app/stores';
  import { PUBLIC_HOST, PUBLIC_OG_URL } from '$env/static/public';
  import '$lib/app.css';
  import logo from '$lib/assets/chientrm.png';
  import Navigating from '$components/Navigating.svelte';
  import '../app.postcss';
  import type { LayoutData } from './$types';
  export let data: LayoutData;
</script>

<svelte:head>
  <link rel="icon" href={logo} />
  <title>chientrm.com | you may find something useful here</title>
  <meta name="keywords" content="chientrm, blogs, tools" />
  <meta name="author" content="chientrm" />
  <meta property="og:type" content="website" />
  <meta property="og:url" content={PUBLIC_HOST} />
  <meta property="og:image" content={`${PUBLIC_OG_URL}${logo}`} />
</svelte:head>

{#if $navigating}
  <Navigating />
{/if}

<content>
  <header>
    <div>
      <a href="/">
        <img src={logo} alt="Logo" />
        chientrm
      </a>
      <a href="/ask">ask ({data.totalCount})</a>
    </div>
    {#if data.user}
      <div>
        <a href={'/account'}>{data.user.username} ({data.count})</a>
        <form method="POST" action="/?/logout">
          <button>logout</button>
        </form>
      </div>
    {:else}
      <a href="/auth">Login</a>
    {/if}
  </header>
  <hr />
  <section>
    <slot />
  </section>
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
    width: 24pt;
  }
  section {
    padding: 8pt;
  }
</style>
