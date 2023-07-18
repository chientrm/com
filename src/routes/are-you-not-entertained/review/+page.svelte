<script lang="ts">
  import { enhance } from '$app/forms';
  import type { PageData } from './$types';
  export let data: PageData;
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
