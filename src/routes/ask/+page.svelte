<script lang="ts">
  import Button from '$components/ui/button/Button.svelte';
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

<Button href="/ask/new" variant="link">Ask something</Button>

<ul class="flex flex-col gap-4">
  {#each data.asks as { id, username, content, fromNow }, index}
    <Ask {index} {id} {username} {content} {fromNow} elipsis={true} />
  {/each}
</ul>
