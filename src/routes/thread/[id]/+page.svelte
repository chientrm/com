<script lang="ts">
  import { enhance } from '$app/forms';
  import Ask from '$lib/components/Thread.svelte';
  import Error from '$lib/components/Error.svelte';
  import { Button } from '$lib/components/ui/button';
  import { Card, CardContent, CardFooter } from '$lib/components/ui/card';
  import { Label } from '$lib/components/ui/label';
  import { Textarea } from '$lib/components/ui/textarea';
  import { autoSubmit } from '$lib/helpers/form';
  export let data;
  export let form;

  let formEl: HTMLFormElement;
</script>

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
  <ul class="flex flex-col gap-4">
    {#each data.replies as { id, content, username, fromNow }, index}
      <Ask {index} {id} {content} {username} {fromNow} />
    {/each}
    <form method="POST" action="?/reply" use:enhance bind:this={formEl}>
      <Card>
        <CardContent class="space-y-2">
          <Error error={form?.message} />
          <div class="space-y-1">
            <Label for="reply">reply</Label>
            <Textarea
              name="reply"
              value={data.reply}
              maxlength={5000}
              on:keydown={(e) => autoSubmit(formEl, e)}
            />
          </div>
        </CardContent>
        <CardFooter>
          <Button type="submit">submit</Button>
        </CardFooter>
      </Card>
    </form>
  </ul>
</div>
