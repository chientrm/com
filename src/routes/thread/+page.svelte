<script>
  import Ask from '$lib/components/Ask.svelte';
  import { Button } from '$lib/components/ui/button';

  export let data;
</script>

<Button href="/thread/new">new thread</Button>
<ul class="mt-4 flex flex-col gap-4">
  {#each data.threads as { id, username, content, fromNow }, index}
    <Ask {index} {id} {username} {content} {fromNow} elipsis={true} />
  {/each}
</ul>
