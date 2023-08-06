<script lang="ts">
  import { enhance } from '$app/forms';
  import Error from '$lib/components/Error.svelte';
  import Result from '$lib/components/Result.svelte';
  import type { ActionData } from './$types';
  export let form: ActionData;
</script>

<h3>change email</h3>
{#if form?.result}
  <Result result={form?.result} />
{:else}
  <form method="POST" use:enhance>
    <Error error={form?.message} />
    <table>
      <tr>
        <td>email</td>
        <td>
          <input type="email" name="email" />
        </td>
      </tr>
      <tr>
        <td />
        <td>
          <button>verify</button>
        </td>
      </tr>
    </table>
  </form>
{/if}
