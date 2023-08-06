<script lang="ts">
  import Error from '$lib/components/Error.svelte';
  import type { PageServerData } from './$types';

  export let data: PageServerData;
</script>

<h3>confirm email</h3>
<span>email: {data.email}</span>
<Error message={data.error} />
