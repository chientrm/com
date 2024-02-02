<script lang="ts">
  import { Badge } from '$lib/components/ui/badge';
  import { Button } from '$lib/components/ui/button';

  export let index: number | null = null;
  export let id: number | string;
  export let content: string;
  export let username: string;
  export let fromNow: string;
  export let elipsis = false;

  function truncate(str: string, n: number) {
    return str.length > n ? str.slice(0, n - 1) + '... more' : str;
  }

  $: thread = elipsis ? truncate(content, 100) : content;
</script>

<div class="flex flex-row items-start rounded-md border p-4">
  <div class="flex flex-col items-start">
    <span>
      <Button href={`/user/${username}`} variant="link" class="italic">
        {username}
      </Button>
      <Badge variant="outline">{fromNow}</Badge>
    </span>
    {#if elipsis}
      <Button href={`/thread/${id}`} variant="link">{thread}</Button>
    {:else}
      <p
        class="leading-7 [&:not(:first-child)]:mt-6"
        style="overflow-wrap: anywhere"
      >
        {thread}
      </p>
    {/if}
  </div>
  <div class="grow" />
  <span>
    {#if index !== null}
      #{index + 1}
    {/if}
  </span>
</div>
