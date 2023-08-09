<script lang="ts">
  import H3 from '$components/typo/H3.svelte';
  import Error from '$lib/components/Error.svelte';
  import Result from '$lib/components/Result.svelte';
  import type { PageServerData } from './$types';

  export let data: PageServerData;
</script>

<H3>Confirm email</H3>
<Error error={data.error} />
<Result result={data.result} />
