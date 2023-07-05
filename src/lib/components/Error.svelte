<script lang="ts">
  export let message: string | null | undefined;
</script>

<span>
  {message ?? '‎'}
</span>

<style>
  span {
    color: red;
  }
</style>
