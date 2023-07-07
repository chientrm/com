<script lang="ts">
  export let index: number | null = null;
  export let username: string;
  export let fromNow: string;
</script>

<div class="row">
  <span class="id">
    {#if index !== null}
      {index + 1}.
    {/if}
  </span>
  <span class="ref">
    clicked by <a href={`/user/${username}`}>{username}</a>
    {fromNow}
  </span>
</div>

<style>
  div.row {
    display: flex;
    flex-direction: row;
    gap: 8pt;
    padding: 8pt;
  }
  span.id {
    width: 16pt;
  }
  span.ref {
    font-style: italic;
  }
</style>
