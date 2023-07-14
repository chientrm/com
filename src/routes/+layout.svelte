<script lang="ts">
  import '$lib/app.css';
  import logo from '$lib/assets/chientrm.png';
  import 'modern-normalize/modern-normalize.css';
  import type { LayoutData } from './$types';
  export let data: LayoutData;
</script>

<svelte:head>
  <link rel="icon" href={logo} />
  <title>chientrm.com | you may find something useful here</title>
  <meta name="description" content="just a bunch of random stuffs" />
  <meta name="keywords" content="chientrm, blogs, tools" />
  <meta name="author" content="chientrm" />
  <meta property="og:title" content="chientrm.com" />
  <meta property="og:description" content="just a bunch of random stuffs" />
  <meta property="og:type" content="website" />
  <meta property="og:url" content="https://chientrm.com/" />
  <meta property="og:image" content={`https://chientrm.com${logo}`} />
</svelte:head>

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
    width: 24pt;
  }
</style>
