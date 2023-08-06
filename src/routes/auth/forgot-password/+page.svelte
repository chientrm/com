<script lang="ts">
  import { enhance } from '$app/forms';
  import Result from '$lib/components/Result.svelte';
  import type { ActionData } from './$types';
  export let form: ActionData;
</script>

<h3>forgot password</h3>
{#if form?.result}
  <Result result={form?.result} />
{:else}
  <form method="POST" use:enhance>
    <table>
      <tr>
        <td>email:</td>
        <td>
          <input type="email" name="email" />
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
{/if}
