<script lang="ts">
  import { enhance } from '$app/forms';
  import Error from '$lib/components/Error.svelte';
  import { autoSubmit } from '$lib/helpers/form';
  import type { ActionData, PageData } from './$types';
  export let form: ActionData;
  export let data: PageData;
  let f: HTMLFormElement;
</script>

<form method="POST" use:enhance bind:this={f}>
  <Error message={form?.message} />
  <table>
    <tr>
      <td>question:</td>
      <td>
        <textarea
          name="content"
          value={data.content}
          maxlength="5000"
          on:keydown={(e) => autoSubmit(f, e)}
        />
      </td>
    </tr>
  </table>
  <button>submit</button>
</form>
