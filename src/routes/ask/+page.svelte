<script lang="ts">
  import type { PageData } from './$types';

  export let data: PageData;
</script>

<svelte:head>
  <title>Ask | chientrm.com</title>
</svelte:head>

<content>
  <a href="/ask/new">ask</a>
  {#each data.asks as { id, username, content, fromNow }}
    <div>
      <a href={`/ask/${id}`}>{content}</a>
      <span>by <a href={`/user/${username}`}>{username}</a> {fromNow}</span>
    </div>
  {/each}
</content>

<style>
  content,
  div {
    display: flex;
    flex-direction: column;
  }
  content {
    gap: 8pt;
  }
  span {
    font-style: italic;
  }
</style>
