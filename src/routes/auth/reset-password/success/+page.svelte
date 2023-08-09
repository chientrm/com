<script>
  import Result from '$components/Result.svelte';
  import H3 from '$components/typo/H3.svelte';
  import P from '$components/typo/P.svelte';
  import { Button } from '$components/ui/button';
</script>

<H3>Reset password</H3>

<Result result="Password reset successfully." />
<Button href="/auth">Go to login</Button>
