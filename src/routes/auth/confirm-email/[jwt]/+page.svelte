<script lang="ts">
  import Error from '$lib/components/Error.svelte';
  import Result from '$lib/components/Result.svelte';
  import H3 from '$lib/components/typo/H3.svelte';
  import type { PageServerData } from './$types';

  export let data: PageServerData;
</script>

<H3>Confirm email</H3>
<Error error={data.error} />
<Result result={data.result} />
