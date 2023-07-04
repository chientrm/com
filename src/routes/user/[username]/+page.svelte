<script lang="ts">
  import type { PageData } from './$types';
  export let data: PageData;
</script>

<form method="POST" action="?/update">
  <table>
    <tr>
      <td>Username</td>
      <td>{data.user?.username}</td>
    </tr>
    <tr>
      <td>Created at</td>
      <td>{data.user?.createdAt}</td>
    </tr>
    <tr>
      <td>Color theme</td>
      <td>
        <select name="colorMode" value={data.colorMode}>
          <option value="os">OS default</option>
          <option value="dark">Dark</option>
          <option value="white">White</option>
        </select>
      </td>
    </tr>
  </table>
  <button>Update</button>
</form>
