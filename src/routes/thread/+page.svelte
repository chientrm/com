<script lang="ts">
  import Button from '$components/ui/button/Button.svelte';
  import Ask from '$lib/components/Ask.svelte';
  import type { PageData } from './$types';
  export let data: PageData;
  const text = 'Thread on chientrm.com';
</script>

<svelte:head>
  <title>{text}</title>
  <meta name="description" content={text} />
  <meta property="og:title" content={text} />
  <meta property="og:description" content={text} />
</svelte:head>

<Button href="/thread/new">New thread</Button>

<ul class="flex flex-col gap-4 mt-4">
  {#each data.threads as { id, username, content, fromNow }, index}
    <Ask {index} {id} {username} {content} {fromNow} elipsis={true} />
  {/each}
</ul>
