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
  import type { ActionData } from './$types';
  export let form: ActionData;
</script>

<form method="POST" use:enhance>
  <Card class="w-[400px]">
    <CardHeader>
      <CardTitle>Reset password</CardTitle>
      <CardDescription>Enter new credentials.</CardDescription>
      <Error error={form?.message} />
    </CardHeader>
    <CardContent class="space-y-2">
      <div class="space-y-1">
        <Label for="password">Password</Label>
        <Input id="password" name="password" type="password" />
      </div>
      <div class="space-y-1">
        <Label for="confirmPassword">Confirm password</Label>
        <Input id="confirmPassword" name="confirmPassword" type="password" />
      </div>
    </CardContent>
    <CardFooter>
      <Button>Reset</Button>
    </CardFooter>
  </Card>
</form>
