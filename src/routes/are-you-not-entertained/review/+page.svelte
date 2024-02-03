<script>
  import { enhance } from '$app/forms';
  import { adminUsername } from '$lib/constants/string';
  export let data;
</script>

<div>
  {#each data.tweets as { url, html }}
    {#if data.user.username === adminUsername}
      <form method="POST" use:enhance action="?/approve">
        <input name="url" type="hidden" value={url} />
        <button>approve</button>
      </form>
    {/if}
    {@html html}
  {/each}
</div>
