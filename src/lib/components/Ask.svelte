<script lang="ts">
  export let index: number | null = null;
  export let id: number | string;
  export let content: string;
  export let username: string;
  export let fromNow: string;
  export let elipsis = false;

  function truncate(str: string, n: number) {
    return str.length > n ? str.slice(0, n - 1) + '... more' : str;
  }

  $: thread = elipsis ? truncate(content, 100) : content;
</script>

<div class="row">
  <span class="id">
    {#if index !== null}
      {index + 1}.
    {/if}
  </span>
  <div class="col">
    <a href={`/ask/${id}`}>
      {#each thread.split(/\r?\n/) as line}
        {line} <br />
      {/each}
    </a>
    <span class="ref">
      by <a href={`/user/${username}`}>{username}</a>
      {fromNow}
    </span>
  </div>
</div>

<style>
  div.row {
    display: flex;
    flex-direction: row;
    gap: 8pt;
    padding: 8pt;
  }
  div.col {
    display: flex;
    flex-direction: column;
    gap: 8pt;
  }
  span.id {
    width: 16pt;
  }
  span.ref {
    font-style: italic;
  }
  a {
    overflow-wrap: anywhere;
  }
</style>
