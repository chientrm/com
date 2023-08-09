<script lang="ts">
  import H2 from '$components/typo/H2.svelte';
  import { Button } from '$components/ui/button';
  import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle
  } from '$components/ui/card';
  import Ask from '$lib/components/Ask.svelte';
  import { Calendar, Mail } from 'lucide-svelte';
  import type { PageData } from './$types';
  import { enhance } from '$app/forms';
  export let data: PageData;
  const text = 'You account at chientrm.com';
</script>

<svelte:head>
  <title>{text}</title>
  <meta name="description" content={text} />
  <meta property="og:title" content={text} />
  <meta property="og:description" content={text} />
</svelte:head>

<Card class="w-[380px]">
  <CardHeader>
    <CardTitle>Account information</CardTitle>
    <CardDescription>{data.username}</CardDescription>
  </CardHeader>
  <CardContent class="grid gap-4">
    <div class="flex items-center space-x-4 rounded-md border p-4">
      <Mail />
      <div class="flex-1 space-y-1">
        <p class="text-sm font-medium leading-none">Email</p>
        <p class="text-sm text-muted-foreground">
          {data.user?.email ?? ''}
        </p>
      </div>
      <Button href="/auth/change-email" variant="link">
        {data.email ? 'Change' : 'Add'}
      </Button>
    </div>
    <div class="flex items-center space-x-4 rounded-md border p-4">
      <Calendar />
      <div class="flex-1 space-y-1">
        <p class="text-sm font-medium leading-none">Joined at</p>
        <p class="text-sm text-muted-foreground">
          {data.user?.createdAt}
        </p>
      </div>
    </div>
  </CardContent>
  <CardFooter>
    <form method="POST" action="?/logout" use:enhance>
      <Button>Logout</Button>
    </form>
  </CardFooter>
</Card>

<H2>Inbox</H2>
<ul class="flex flex-col gap-4">
  {#each data.threads as { id, content, username, fromNow }, index}
    <Ask {index} {id} {content} {username} {fromNow} />
  {/each}
</ul>
