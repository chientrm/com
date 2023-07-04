<script lang="ts">
  import Error from '$lib/components/Error.svelte';
  import type { ActionData } from './$types';
  export let form: ActionData;
</script>

<form method="POST" action="?/login">
  <h3>login</h3>
  <Error message={form?.loginMessage} />
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

<a href="/reset_password">forgot your password?</a>

<form method="POST" action="?/register">
  <h3>create account</h3>
  <Error message={form?.registerMessage} />
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
