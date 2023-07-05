<script lang="ts">
  export let index: number;
  export let id: number | string;
  export let content: string;
  export let username: string;
  export let fromNow: string;
</script>

<div class="row">
  <span class="id">{index + 1}.</span>
  <div class="col">
    <a href={`/ask/${id}`}>{content}</a>
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
</style>
