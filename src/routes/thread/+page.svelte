<script>
  import Ask from '$lib/components/Ask.svelte';
  import { Button } from '$lib/components/ui/button';

  export let data;
  const text = 'Thread on chientrm.com';
</script>

<svelte:head>
  <title>{text}</title>
  <meta name="description" content={text} />
  <meta property="og:title" content={text} />
  <meta property="og:description" content={text} />
</svelte:head>

<Button href="/thread/new">New thread</Button>

<ul class="mt-4 flex flex-col gap-4">
  {#each data.threads as { id, username, content, fromNow }, index}
    <Ask {index} {id} {username} {content} {fromNow} elipsis={true} />
  {/each}
</ul>
