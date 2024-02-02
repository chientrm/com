<script lang="ts">
  import { enhance } from '$app/forms';
  import Error from '$lib/components/Error.svelte';
  import Result from '$lib/components/Result.svelte';
  import { Button } from '$lib/components/ui/button';
  import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle
  } from '$lib/components/ui/card';
  import { Input } from '$lib/components/ui/input';
  import { Label } from '$lib/components/ui/label';
  import dayjs from 'dayjs';
  import InfiniteLoading from 'svelte-infinite-loading';
  export let data;
  export let form;
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
  <Card class="w-[400px]">
    <CardHeader>
      <CardTitle>Submit tweet</CardTitle>
      <CardDescription>
        Submit your favorite tweet here to share with other.
      </CardDescription>
      {#if form?.result}
        <Result result={form?.result} />
      {:else}
        <Error error={form?.message} />
      {/if}
    </CardHeader>
    <CardContent class="space-y-2">
      <div class="space-y-1">
        <Label for="url">Tweet url</Label>
        <Input id="url" name="url" value={data.url} />
      </div>
    </CardContent>
    <CardFooter>
      <Button>Submit</Button>
    </CardFooter>
  </Card>
</form>

<div bind:this={tweetsDiv}>
  {#each tweets as { html }}
    {@html html}
  {/each}
  <InfiniteLoading on:infinite={infiniteHandler} />
</div>
