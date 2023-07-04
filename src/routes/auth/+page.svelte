<script lang="ts">
  import Error from '$lib/components/Error.svelte';
  import type { ActionData } from './$types';
  export let form: ActionData;
</script>

<form method="POST" action="?/login">
  <h3>Login</h3>
  <Error message={form?.loginMessage} />
  <table>
    <tr>
      <td>Username</td>
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
      <td>Password</td>
      <td>
        <input type="password" name="password" size="20" />
      </td>
    </tr>
  </table>
  <button>Login</button>
</form>

<a href="/reset_password">Forgot your password?</a>

<form method="POST" action="?/register">
  <h3>Create Account</h3>
  <Error message={form?.registerMessage} />
  <table>
    <tr>
      <td>Username</td>
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
      <td>Password</td>
      <td>
        <input type="password" name="password" size="20" />
      </td>
    </tr>
  </table>
  <button>Create account</button>
</form>
