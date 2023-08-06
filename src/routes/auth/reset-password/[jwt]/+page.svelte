<script lang="ts">
  import { enhance } from '$app/forms';
  import Error from '$lib/components/Error.svelte';
  import type { ActionData } from './$types';
  export let form: ActionData;
</script>

<h3>reset password</h3>
<form method="POST" use:enhance>
  <Error error={form?.message} />
  <table>
    <tr>
      <td>new password:</td>
      <td>
        <input type="password" name="password" />
      </td>
    </tr>
    <tr>
      <td />
      <td>
        <button>reset</button>
      </td>
    </tr>
  </table>
</form>
