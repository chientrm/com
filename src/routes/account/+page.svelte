<script>
  import { enhance } from '$app/forms';
  import Ask from '$lib/components/Ask.svelte';
  import H2 from '$lib/components/typo/H2.svelte';
  import { Button } from '$lib/components/ui/button';
  import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle
  } from '$lib/components/ui/card';
  import MaterialSymbolsCalendarClockOutline from '~icons/material-symbols/calendar-clock-outline';

  export let data;
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
      <MaterialSymbolsCalendarClockOutline />
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
