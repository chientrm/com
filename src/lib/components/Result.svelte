<script lang="ts">
  export let result: string | null | undefined;
</script>

<span>
  {result ?? '‎'}
</span>

<style>
  span {
    color: green;
  }
</style>
