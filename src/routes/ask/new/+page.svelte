<script lang="ts">
  import { enhance } from '$app/forms';
  import Error from '$lib/components/Error.svelte';
  import type { ActionData, PageData } from './$types';
  export let form: ActionData;
  export let data: PageData;
</script>

<form method="POST" use:enhance>
  <Error message={form?.message} />
  <table>
    <tr>
      <td>question:</td>
      <td>
        <textarea name="content" value={data.content} />
      </td>
    </tr>
  </table>
  <button>submit</button>
</form>
