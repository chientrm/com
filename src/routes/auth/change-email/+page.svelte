<script>
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

  export let form;
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
