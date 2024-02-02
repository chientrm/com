<script>
  import { enhance } from '$app/forms';
  import { page } from '$app/stores';
  import Error from '$lib/components/Error.svelte';
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
  import {
    Tabs,
    TabsContent,
    TabsList,
    TabsTrigger
  } from '$lib/components/ui/tabs';

  export let form;
  $: redirectTo = $page.url.searchParams.get('redirectTo') ?? '/';
</script>

<div class="flex flex-row justify-center">
  <Tabs value="login" class="w-[400px]">
    <TabsList class="grid w-full grid-cols-2">
      <TabsTrigger value="login">login</TabsTrigger>
      <TabsTrigger value="register">register</TabsTrigger>
    </TabsList>
    <TabsContent value="login">
      <form
        method="POST"
        action={`?/login&redirectTo=${redirectTo}`}
        use:enhance
      >
        <Card>
          <CardHeader>
            <CardTitle>login</CardTitle>
            <CardDescription>login to existing account.</CardDescription>
            <Error error={form?.loginMessage} />
          </CardHeader>
          <CardContent class="space-y-2">
            <div class="space-y-1">
              <Label for="username">username</Label>
              <Input id="username" name="username" />
            </div>
            <div class="space-y-1">
              <Label for="password">password</Label>
              <Input id="password" name="password" type="password" />
            </div>
          </CardContent>
          <CardFooter>
            <Button type="submit">login</Button>
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
            <CardTitle>register</CardTitle>
            <CardDescription>register new account.</CardDescription>
            <Error error={form?.registerMessage} />
          </CardHeader>
          <CardContent class="space-y-2">
            <div class="space-y-1">
              <Label for="username">username</Label>
              <Input id="username" name="username" type="text" />
            </div>
            <div class="space-y-1">
              <Label for="password">password</Label>
              <Input id="password" name="password" type="password" />
            </div>
            <div class="space-y-1">
              <Label for="confirmPassword">confirm password</Label>
              <Input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
              />
            </div>
          </CardContent>
          <CardFooter>
            <Button type="submit">register</Button>
          </CardFooter>
        </Card>
      </form>
    </TabsContent>
  </Tabs>
</div>
