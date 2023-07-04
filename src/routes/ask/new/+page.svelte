<script lang="ts">
  import Error from '$lib/components/Error.svelte';
  import type { ActionData } from './$types';
  export let form: ActionData;
</script>

<form method="POST">
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
