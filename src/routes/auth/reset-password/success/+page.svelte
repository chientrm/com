<script>
  import Result from '$lib/components/Result.svelte';
  import H3 from '$lib/components/typo/H3.svelte';
  import { Button } from '$lib/components/ui/button';
</script>

<H3>Reset password</H3>

<Result result="Password reset successfully." />
<Button href="/auth">Go to login</Button>
