<script>
  import Ask from '$lib/components/Ask.svelte';
  export let data;
</script>

<ul class="flex flex-col gap-4">
  {#each data.threads as { id, content, username, fromNow }, index}
    <Ask {index} {id} {content} {username} {fromNow} />
  {/each}
</ul>
