<script lang="ts">
  import { enhance } from '$app/forms';
  import { invalidateAll } from '$app/navigation';
  import Ask from '$lib/components/Ask.svelte';
  import Error from '$lib/components/Error.svelte';
  import type { ActionData, PageData } from './$types';
  export let data: PageData;
  export let form: ActionData;
</script>

<div class="appbar">
  <Ask
    index={0}
    id={data.id}
    content={data.content}
    username={data.username}
    fromNow={data.fromNow}
  />
  <div>
    <button on:click={() => invalidateAll()}>refresh</button>
  </div>
</div>

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
  div.replies {
    padding: 8pt;
  }
  div.appbar {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    padding: 0 8pt;
  }
</style>
