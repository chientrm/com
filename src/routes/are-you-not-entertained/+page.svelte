<script lang="ts">
  import { enhance } from '$app/forms';
  import Error from '$lib/components/Error.svelte';
  import type { ActionData, PageData } from './$types';
  export let data: PageData;
  export let form: ActionData;
</script>

{#if data.isAdmin}
  <a href="are-you-not-entertained/review">Review</a>
{/if}

<form method="POST" action="?/submit" use:enhance>
  <table>
    <tr>
      <td>Tweet url:</td>
      <td>
        <input type="text" name="url" />
      </td>
    </tr>
    <tr>
      <td />
      <td>
        <Error message={form?.message} />
      </td>
    </tr>
  </table>
  <button>submit</button>
</form>

{#each data.tweets as { html }}
  {@html html}
{/each}
