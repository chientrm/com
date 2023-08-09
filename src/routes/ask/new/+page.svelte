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
  import Error from '$lib/components/Error.svelte';
  import { autoSubmit } from '$lib/helpers/form';
  import type { ActionData, PageData } from './$types';
  export let form: ActionData;
  export let data: PageData;
  let f: HTMLFormElement;
  const text = 'Ask something at chientrm.com';
</script>

<svelte:head>
  <title>{text}</title>
  <meta name="description" content={text} />
  <meta property="og:title" content={text} />
  <meta property="og:description" content={text} />
</svelte:head>

<form method="POST" use:enhance bind:this={f}>
  <Card>
    <CardHeader>
      <CardTitle>New question</CardTitle>
      <CardDescription>Ask anything.</CardDescription>
      <Error error={form?.message} />
    </CardHeader>
    <CardContent class="space-y-2">
      <div class="space-y-1">
        <Label for="content">Question</Label>
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
