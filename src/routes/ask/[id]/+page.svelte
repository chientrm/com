<script lang="ts">
  import { enhance } from '$app/forms';
  import { invalidateAll } from '$app/navigation';
  import Ask from '$lib/components/Ask.svelte';
  import Error from '$lib/components/Error.svelte';
  import type { ActionData, PageData } from './$types';
  export let data: PageData;
  export let form: ActionData;
</script>

<Ask
  index={0}
  id={data.id}
  content={data.content}
  username={data.username}
  fromNow={data.fromNow}
/>
<button on:click={() => invalidateAll()}>refresh</button>

<hr />

<div class="replies">
  {#each data.replies as { id, content, username, fromNow }, index}
    <Ask {index} {id} {content} {username} {fromNow} />
  {/each}
</div>

<form method="POST" action="?/reply" use:enhance>
  <Error message={form?.message} />
  <table>
    <tr>
      <td>reply:</td>
      <td>
        <textarea name="reply" value={data.reply} maxlength="5000" />
      </td>
    </tr>
    <tr>
      <td>
        <button>submit</button>
      </td>
      <td />
    </tr>
  </table>
</form>

<style>
  .replies {
    padding-left: 16pt;
    gap: 16pt;
  }
  div {
    display: flex;
    flex-direction: column;
  }
</style>
