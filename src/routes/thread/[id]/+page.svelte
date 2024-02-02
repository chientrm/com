<script lang="ts">
  import { enhance } from '$app/forms';
  import Ask from '$lib/components/Ask.svelte';
  import Error from '$lib/components/Error.svelte';
  import H3 from '$lib/components/typo/H3.svelte';
  import { Button } from '$lib/components/ui/button';
  import { Card, CardContent, CardFooter } from '$lib/components/ui/card';
  import { Label } from '$lib/components/ui/label';
  import { Textarea } from '$lib/components/ui/textarea';
  import { autoSubmit } from '$lib/helpers/form';
  export let data;
  export let form;

  let formEl: HTMLFormElement;
  $: meta = data.content;
</script>

<svelte:head>
  <title>{meta}</title>
  <meta name="description" content={data.content} />
  <meta property="og:title" content={meta} />
  <meta property="og:description" content={meta} />
</svelte:head>

<H3>Thread</H3>
<div class="flex flex-col">
  {#if data.parentId}
    <Button href={`/thread/${data.parentId}`}>← Parent</Button>
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
    <form method="POST" action="?/reply" use:enhance bind:this={formEl}>
      <Card>
        <CardContent class="space-y-2">
          <Error error={form?.message} />
          <div class="space-y-1">
            <Label for="reply">Reply</Label>
            <Textarea
              name="reply"
              value={data.reply}
              maxlength="5000"
              on:keydown={(e) => autoSubmit(formEl, e)}
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
