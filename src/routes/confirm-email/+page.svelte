<script lang="ts">
  import Error from '$lib/components/Error.svelte';
  import Result from '$lib/components/Result.svelte';
  import type { PageServerData } from './$types';

  export let data: PageServerData;
</script>

<h3>confirm email</h3>
<Error message={data.error} />
<Result result={data.result} />
