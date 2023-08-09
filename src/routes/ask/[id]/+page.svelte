<script lang="ts">
  import { enhance } from '$app/forms';
  import H3 from '$components/typo/H3.svelte';
  import { Button } from '$components/ui/button';
  import { Card, CardContent, CardFooter } from '$components/ui/card';
  import { Label } from '$components/ui/label';
  import { Textarea } from '$components/ui/textarea';
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

<H3>Ask</H3>
<div class="flex flex-col">
  {#if data.parentId}
    <a href={`/ask/${data.parentId}`}>← parent</a>
  {/if}

  <Ask
    id={data.id}
    content={data.content}
    username={data.username}
    fromNow={data.fromNow}
  />
  <H3>Replies</H3>
  <ul class="flex flex-col gap-4">
    {#each data.replies as { id, content, username, fromNow }, index}
      <Ask {index} {id} {content} {username} {fromNow} />
    {/each}
    <form method="POST" action="?/reply" use:enhance bind:this={f}>
      <Card>
        <CardContent class="space-y-2">
          <Error error={form?.message} />
          <div class="space-y-1">
            <Label for="reply">Reply</Label>
            <Textarea
              name="reply"
              value={data.reply}
              maxlength="5000"
              on:keydown={(e) => autoSubmit(f, e)}
            />
          </div>
        </CardContent>
        <CardFooter>
          <Button>Submit</Button>
        </CardFooter>
      </Card>
    </form>
  </ul>
</div>
