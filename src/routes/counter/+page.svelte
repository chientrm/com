<script>
  import { enhance } from '$app/forms';
  import Counter from '$lib/components/Counter.svelte';
  export let data;
</script>

<svelte:head>
  <title>Counter | chientrm.com</title>
  <meta name="description" content="simple counter" />
  <meta property="og:title" content="chientrm.com | Simple counter" />
  <meta property="og:description" content="simple counter" />
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
