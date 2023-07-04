<script lang="ts">
  import type { PageData } from './$types';
  export let data: PageData;
</script>

<div>
  <p>{data.content}</p>
  <span>
    by <a href={`/user/${data.username}`}>{data.username}</a> at {data.createdAt}
  </span>
</div>

<style>
  span {
    font-style: italic;
  }
</style>
