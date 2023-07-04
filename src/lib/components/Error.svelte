<script lang="ts">
  export let message: string | null;
</script>

<span>
  {message ?? '‎'}
</span>

<style>
  span {
    color: red;
  }
</style>
