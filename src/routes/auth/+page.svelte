<script>
  import { enhance } from '$app/forms';
  import { page } from '$app/stores';
  import Error from '$lib/components/Error.svelte';
  import { Button } from '$lib/components/ui/button';
  import * as Card from '$lib/components/ui/card';
  import { Input } from '$lib/components/ui/input';
  import { Label } from '$lib/components/ui/label';
  import * as Tab from '$lib/components/ui/tabs';

  export let form;
  $: redirectTo = $page.url.searchParams.get('redirectTo') ?? '/';
</script>

<div class="flex flex-row justify-center">
  <Tab.Root value="login" class="w-[400px]">
    <Tab.TabsList class="grid w-full grid-cols-2">
      <Tab.TabsTrigger value="login">login</Tab.TabsTrigger>
      <Tab.TabsTrigger value="register">register</Tab.TabsTrigger>
    </Tab.TabsList>
    <Tab.TabsContent value="login">
      <form
        method="POST"
        action={`?/login&redirectTo=${redirectTo}`}
        use:enhance
      >
        <Card.Root>
          <Card.CardHeader>
            <Card.CardTitle>login</Card.CardTitle>
            <Card.CardDescription
              >login to existing account.</Card.CardDescription
            >
            <Error error={form?.loginMessage} />
          </Card.CardHeader>
          <Card.CardContent class="space-y-2">
            <div class="space-y-1">
              <Label for="username">username</Label>
              <Input id="username" name="username" />
            </div>
            <div class="space-y-1">
              <Label for="password">password</Label>
              <Input id="password" name="password" type="password" />
            </div>
          </Card.CardContent>
          <Card.CardFooter>
            <Button type="submit">login</Button>
          </Card.CardFooter>
        </Card.Root>
      </form>
    </Tab.TabsContent>
    <Tab.TabsContent value="register">
      <form
        method="POST"
        action={`?/register&redirectTo=${redirectTo}`}
        use:enhance
      >
        <Card.Root>
          <Card.CardHeader>
            <Card.CardTitle>register</Card.CardTitle>
            <Card.CardDescription>register new account.</Card.CardDescription>
            <Error error={form?.registerMessage} />
          </Card.CardHeader>
          <Card.CardContent class="space-y-2">
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
          </Card.CardContent>
          <Card.CardFooter>
            <Button type="submit">register</Button>
          </Card.CardFooter>
        </Card.Root>
      </form>
    </Tab.TabsContent>
  </Tab.Root>
</div>
