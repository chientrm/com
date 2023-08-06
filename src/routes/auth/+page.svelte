<script lang="ts">
  import { enhance } from '$app/forms';
  import { page } from '$app/stores';
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

<form method="POST" action={`?/login&redirectTo=${redirectTo}`} use:enhance>
  <h3>login</h3>
  <Error error={form?.loginMessage} />
  <table>
    <tr>
      <td>username:</td>
      <td>
        <input
          type="text"
          name="username"
          size="20"
          autocorrect="off"
          spellcheck="false"
          autocapitalize="off"
        />
      </td>
    </tr>
    <tr>
      <td>password:</td>
      <td>
        <input type="password" name="password" size="20" />
      </td>
    </tr>
  </table>
  <button>login</button>
</form>

<a href="/forgot-password">forgot your password?</a>

<form method="POST" action={`?/register&redirectTo=${redirectTo}`} use:enhance>
  <h3>create account</h3>
  <Error error={form?.registerMessage} />
  <table>
    <tr>
      <td>username:</td>
      <td>
        <input
          type="text"
          name="username"
          size="20"
          autocorrect="off"
          spellcheck="false"
          autocapitalize="off"
        />
      </td>
    </tr>
    <tr>
      <td>password:</td>
      <td>
        <input type="password" name="password" size="20" />
      </td>
    </tr>
  </table>
  <button>create account</button>
</form>
