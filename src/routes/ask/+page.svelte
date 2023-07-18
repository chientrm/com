<script lang="ts">
  import Ask from '$lib/components/Ask.svelte';
  import type { PageData } from './$types';
  export let data: PageData;
  const text = 'Ask something at chientrm.com';
</script>

<svelte:head>
  <title>{text}</title>
  <meta name="description" content={text} />
  <meta property="og:title" content={text} />
  <meta property="og:description" content={text} />
</svelte:head>

<a href="/ask/new">ask something</a>
<hr />

<div>
  {#each data.asks as { id, username, content, fromNow }, index}
    <Ask {index} {id} {username} {content} {fromNow} />
  {/each}
</div>
