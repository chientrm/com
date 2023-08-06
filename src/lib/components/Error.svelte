<script lang="ts">
  export let error: string | null | undefined;
</script>

<span>
  {error ?? '‎'}
</span>

<style>
  span {
    color: red;
  }
</style>
