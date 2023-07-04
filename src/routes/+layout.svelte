<script lang="ts">
  import '$lib/app.css';
  import favicon from '$lib/assets/favicon.png';
  import 'modern-normalize/modern-normalize.css';
  import logo from '$lib/assets/logo.svg';
  import type { LayoutData } from './$types';
  export let data: LayoutData;
</script>

<svelte:head>
  <link rel="icon" href={favicon} />
</svelte:head>

<content>
  <header>
    <a href="/">
      <img src={logo} alt="Logo" />
      chientrm
    </a>
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

<style>
  header {
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
    gap: 4pt;
    background-color: #00ff00;
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
