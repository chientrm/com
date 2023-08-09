<script lang="ts">
  import { enhance } from '$app/forms';
  import { page } from '$app/stores';
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
  import {
    Tabs,
    TabsContent,
    TabsList,
    TabsTrigger
  } from '$components/ui/tabs';
  import Error from '$lib/components/Error.svelte';
  import type { ActionData } from './$types';
  export let form: ActionData;
  $: redirectTo = $page.url.searchParams.get('redirectTo') ?? '/';
  const text = 'Create account or login at chientrm.com';
</script>

<svelte:head>
  <title>{text}</title>
  <meta name="description" content={text} />
  <meta property="og:title" content={text} />
  <meta property="og:description" content={text} />
</svelte:head>

<div class="flex flex-row justify-center">
  <Tabs value="login" class="w-[400px]">
    <TabsList class="grid w-full grid-cols-2">
      <TabsTrigger value="login">Login</TabsTrigger>
      <TabsTrigger value="register">Register</TabsTrigger>
    </TabsList>
    <TabsContent value="login">
      <form
        method="POST"
        action={`?/login&redirectTo=${redirectTo}`}
        use:enhance
      >
        <Card>
          <CardHeader>
            <CardTitle>Login</CardTitle>
            <CardDescription>Login to existing account.</CardDescription>
            <Error error={form?.loginMessage} />
          </CardHeader>
          <CardContent class="space-y-2">
            <div class="space-y-1">
              <Label for="username">Username</Label>
              <Input id="username" name="username" />
            </div>
            <div class="space-y-1">
              <Label for="password">Password</Label>
              <Input id="password" name="password" type="password" />
            </div>
          </CardContent>
          <CardFooter>
            <Button>Login</Button>
            <Button href="/auth/forgot-password" variant="link">
              Forgot password?
            </Button>
          </CardFooter>
        </Card>
      </form>
    </TabsContent>
    <TabsContent value="register">
      <form
        method="POST"
        action={`?/register&redirectTo=${redirectTo}`}
        use:enhance
      >
        <Card>
          <CardHeader>
            <CardTitle>Register</CardTitle>
            <CardDescription>Sign up new account.</CardDescription>
            <Error error={form?.registerMessage} />
          </CardHeader>
          <CardContent class="space-y-2">
            <div class="space-y-1">
              <Label for="username">Username</Label>
              <Input id="username" name="username" type="text" />
            </div>
            <div class="space-y-1">
              <Label for="password">Password</Label>
              <Input id="password" name="password" type="password" />
            </div>
            <div class="space-y-1">
              <Label for="confirmPassword">Confirm Password</Label>
              <Input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
              />
            </div>
          </CardContent>
          <CardFooter>
            <Button>Register</Button>
          </CardFooter>
        </Card>
      </form>
    </TabsContent>
  </Tabs>
</div>
