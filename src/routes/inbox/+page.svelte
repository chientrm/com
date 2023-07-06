<script lang="ts">
  import Ask from '$lib/components/Ask.svelte';
  import type { PageData } from './$types';
  export let data: PageData;
</script>

<h3>inbox</h3>
{#each data.asks as { id, content, username, fromNow }, index}
  <Ask {index} {id} {content} {username} {fromNow} />
{/each}
