<script lang="ts">
  import { enhance } from '$app/forms';
  import Error from '$lib/components/Error.svelte';
  import type { ActionData } from './$types';
  export let form: ActionData;
</script>

<form method="POST" use:enhance>
  <Error message={form?.message} />
  <table>
    <tr>
      <td>question:</td>
      <td>
        <textarea name="content" />
      </td>
    </tr>
  </table>
  <button>submit</button>
</form>
