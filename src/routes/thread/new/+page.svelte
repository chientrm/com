<script lang="ts">
  import { enhance } from '$app/forms';
  import { Button } from '$components/ui/button';
  import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle
  } from '$components/ui/card';
  import { Label } from '$components/ui/label';
  import { Textarea } from '$components/ui/textarea';
  import { autoSubmit } from '$lib/helpers/form';
  import type { PageData } from './$types';
  export let data: PageData;
  let f: HTMLFormElement;
  const meta = 'Create new thread on chientrm.com';
</script>

<svelte:head>
  <title>{meta}</title>
  <meta name="description" content={meta} />
  <meta property="og:title" content={meta} />
  <meta property="og:description" content={meta} />
</svelte:head>

<form method="POST" use:enhance bind:this={f}>
  <Card>
    <CardHeader>
      <CardTitle>New thread</CardTitle>
      <CardDescription>Could be anything.</CardDescription>
    </CardHeader>
    <CardContent class="space-y-2">
      <div class="space-y-1">
        <Label for="content">Content</Label>
        <Textarea
          name="content"
          value={data.content}
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
