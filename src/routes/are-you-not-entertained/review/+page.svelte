<script>
  import { enhance } from '$app/forms';
  export let data;
</script>

<div>
  {#each data.tweets as { url, html }}
    <form method="POST" use:enhance action="?/approve">
      <input name="url" type="hidden" value={url} />
      <button>approve</button>
    </form>
    {@html html}
  {/each}
</div>
