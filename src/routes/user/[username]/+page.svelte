<script lang="ts">
  import type { PageData } from './$types';

  export let data: PageData;
</script>

<table>
  <tr>
    <td>Username</td>
    <td>{data.user?.username}</td>
  </tr>
  <tr>
    <td>Created at</td>
    <td>{data.user?.createdAt}</td>
  </tr>
</table>
