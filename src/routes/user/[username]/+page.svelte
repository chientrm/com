<script lang="ts">
  import type { PageData } from './$types';
  export let data: PageData;
</script>

<table>
  <tr>
    <td>username:</td>
    <td>{data.username}</td>
  </tr>
  <tr>
    <td>created at:</td>
    <td>{data.createdAt}</td>
  </tr>
</table>
