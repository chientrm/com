<script lang="ts">
  export let error: string | null | undefined;
</script>

<span class="text-red-400">
  {error ?? '‎'}
</span>
