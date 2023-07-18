<script lang="ts">
  import { enhance } from '$app/forms';
  import Ask from '$lib/components/Ask.svelte';
  import Error from '$lib/components/Error.svelte';
  import { autoSubmit } from '$lib/helpers/form';
  import type { ActionData, PageData } from './$types';
  export let data: PageData;
  export let form: ActionData;
  let f: HTMLFormElement;
  $: text = data.content;
</script>

<svelte:head>
  <title>{text}</title>
  <meta name="description" content={text} />
  <meta property="og:title" content={text} />
  <meta property="og:description" content={text} />
</svelte:head>

<div class="col">
  {#if data.parentId}
    <a href={`/ask/${data.parentId}`}>← parent</a>
  {/if}

  <Ask
    id={data.id}
    content={data.content}
    username={data.username}
    fromNow={data.fromNow}
  />

  <div class="replies">
    {#each data.replies as { id, content, username, fromNow }, index}
      <Ask {index} {id} {content} {username} {fromNow} />
    {/each}
  </div>

  <form method="POST" action="?/reply" use:enhance bind:this={f}>
    <Error message={form?.message} />
    <table>
      <tr>
        <td>reply:</td>
        <td>
          <textarea
            name="reply"
            value={data.reply}
            maxlength="5000"
            on:keydown={(e) => autoSubmit(f, e)}
          />
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
</div>

<style>
  div.col {
    display: flex;
    flex-direction: column;
  }
  div.replies {
    padding: 8pt;
    padding-left: 16pt;
  }
</style>
