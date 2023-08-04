<script lang="ts">
  import { enhance } from '$app/forms';
  import Error from '$lib/components/Error.svelte';
  import dayjs from 'dayjs';
  import InfiniteLoading from 'svelte-infinite-loading';
  import type { ActionData, PageData } from './$types';
  export let data: PageData;
  export let form: ActionData;
  const text = 'Are you not entertained? Visit chientrm.com';
  let tweetsDiv: HTMLDivElement;
  let approvedAt = new Date();
  interface Tweet {
    html: string;
    approvedAt: string;
  }
  let tweets: Tweet[] = [];

  function infiniteHandler({
    detail: { loaded, complete }
  }: {
    detail: { loaded: VoidFunction; complete: VoidFunction };
  }) {
    const date = dayjs(approvedAt).format('YYYY-MM-DD HH:MM:SS');
    fetch(`/are-you-not-entertained?approvedAt=${date}`)
      .then((response) => response.json<Tweet[]>())
      .then((newTweets) => {
        if (newTweets.length > 0) {
          approvedAt = new Date(newTweets[newTweets.length - 1].approvedAt);
          tweets = [...tweets, ...newTweets];
          // @ts-ignore
          twttr.widgets.load(tweetsDiv);
          loaded();
        } else {
          complete();
        }
      });
  }
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

<div bind:this={tweetsDiv}>
  {#each tweets as { html }}
    {@html html}
  {/each}
  <InfiniteLoading on:infinite={infiniteHandler} />
</div>
