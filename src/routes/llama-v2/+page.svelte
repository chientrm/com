<script lang="ts">
  import { enhance } from '$app/forms';
  import Error from '$lib/components/Error.svelte';
  import { autoSubmit } from '$lib/helpers/form';
  import type { ActionData, PageData } from './$types';
  export let data: PageData;
  export let form: ActionData;
  let f: HTMLFormElement;
  const text = 'llama v2';
</script>

<svelte:head>
  <title>{text}</title>
  <meta name="description" content={text} />
  <meta property="og:title" content={text} />
  <meta property="og:description" content={text} />
</svelte:head>

<h3>{text}</h3>
<form method="POST" use:enhance bind:this={f}>
  <Error message={form?.message} />
  <table>
    <tr>
      <td>prompt:</td>
      <td>
        <textarea
          name="prompt"
          value={data.prompt}
          maxlength="5000"
          on:keydown={(e) => autoSubmit(f, e)}
        />
      </td>
    </tr>
    <tr>
      <td>answer:</td>
      <td>
        {form?.answer ?? ''}
      </td>
    </tr>
  </table>
  <button>submit</button>
</form>
