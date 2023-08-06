<script lang="ts">
  import { enhance } from '$app/forms';
  import Ask from '$lib/components/Ask.svelte';
  import type { PageData } from './$types';
  export let data: PageData;
  const text = 'You account at chientrm.com';
</script>

<svelte:head>
  <title>{text}</title>
  <meta name="description" content={text} />
  <meta property="og:title" content={text} />
  <meta property="og:description" content={text} />
</svelte:head>

<h3>settings</h3>
<form method="POST" action="?/update">
  <table>
    <tr>
      <td>username:</td>
      <td>{data.username}</td>
    </tr>
    <tr>
      <td>email:</td>
      <td>
        {data.email ?? ''}
        <a href="/change-email">
          {data.email ? 'change email' : `add email`}
        </a>
      </td>
    </tr>
    <tr>
      <td>created at:</td>
      <td>{data.createdAt}</td>
    </tr>
    {#if data.user?.username === data.username}
      <tr>
        <td>color theme:</td>
        <td>
          <select name="colorMode" value={data.colorMode}>
            <option value="os">os default</option>
            <option value="dark">dark</option>
            <option value="white">white</option>
          </select>
        </td>
      </tr>
    {/if}
  </table>
  {#if data.user?.username === data.username}
    <button>update</button>
  {/if}
</form>

<h3>inbox</h3>
{#each data.asks as { id, content, username, fromNow }, index}
  <Ask {index} {id} {content} {username} {fromNow} />
{/each}
