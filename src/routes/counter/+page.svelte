<script lang="ts">
  import { enhance } from '$app/forms';
  import Counter from '$lib/components/Counter.svelte';
  import type { PageData } from './$types';
  export let data: PageData;
</script>

<svelte:head>
  <title>Counter | chientrm.com</title>
  <meta name="description" content="simple counter" />
</svelte:head>

<h3>clicked: {data.counters.length}</h3>
{#if !data.counter}
  <form method="POST" use:enhance>
    <button>click</button>
  </form>
{:else}
  <button>clicked</button>
{/if}

{#each data.counters as { username, fromNow }, index}
  <Counter {username} {fromNow} {index} />
{/each}
