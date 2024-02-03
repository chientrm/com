<script>
  import Ask from '$lib/components/Thread.svelte';
  import { Button } from '$lib/components/ui/button';
  export let data;
</script>

<ul class="flex flex-col gap-4">
  {#each data.threads as { id, content, username, fromNow }, index}
    <Ask {index} {id} {content} {username} {fromNow} />
  {/each}
</ul>

<Button href="/account/logout" variant="outline">logout</Button>
