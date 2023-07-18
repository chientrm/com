<script lang="ts">
  import { enhance } from '$app/forms';
  import Error from '$lib/components/Error.svelte';
  import type { ActionData, PageData } from './$types';
  export let data: PageData;
  export let form: ActionData;
  const text = 'Are you not entertained? Visit chientrm.com';
</script>

<svelte:head>
  <title>{text}</title>
  <meta name="description" content={text} />
  <meta property="og:title" content={text} />
  <meta property="og:description" content={text} />
</svelte:head>

{#if data.reviewCount != null}
  <a href="are-you-not-entertained/review">Review ({data.reviewCount})</a>
{/if}

<form method="POST" action="?/submit" use:enhance>
  <table>
    <tr>
      <td>Tweet url:</td>
      <td>
        <input type="text" name="url" value={data.url} />
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

<div>
  {#each data.tweets as { html }}
    {@html html}
  {/each}
</div>
