<script lang="ts">
  import { invalidateAll } from '$app/navigation';
  import Ask from '$lib/components/Ask.svelte';
  import type { PageData } from './$types';

  export let data: PageData;
</script>

<svelte:head>
  <title>Ask | chientrm.com</title>
</svelte:head>

<div class="appbar">
  <a href="/ask/new">ask something</a>
  <button on:click={() => invalidateAll()}>refresh</button>
</div>
<hr />

<div>
  {#each data.asks as { id, username, content, fromNow }, index}
    <Ask {index} {id} {username} {content} {fromNow} />
  {/each}
</div>

<style>
  div.appbar {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    padding: 0 8pt;
  }
</style>
