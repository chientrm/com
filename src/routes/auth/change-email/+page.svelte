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
  import { Input } from '$components/ui/input';
  import { Label } from '$components/ui/label';
  import Error from '$lib/components/Error.svelte';
  import Result from '$lib/components/Result.svelte';
  import type { ActionData } from './$types';
  export let form: ActionData;
</script>

<form method="POST" use:enhance>
  <Card class="w-[400px]">
    <CardHeader>
      <CardTitle>Change email</CardTitle>
      <CardDescription>
        Email is used for password reset and notifications.
      </CardDescription>
      <Error error={form?.message} />
    </CardHeader>
    {#if form?.result}
      <CardContent class="space-y-2">
        <Result result={form?.result} />
      </CardContent>
    {:else}
      <CardContent class="space-y-2">
        <div class="space-y-1">
          <Label for="email">Email</Label>
          <Input id="email" name="email" />
        </div>
      </CardContent>
      <CardFooter>
        <Button>Verify</Button>
      </CardFooter>
    {/if}
  </Card>
</form>
