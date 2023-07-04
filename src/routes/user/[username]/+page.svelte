<script lang="ts">
  import type { PageData } from './$types';
  export let data: PageData;
</script>

<form method="POST" action="?/update">
  <table>
    <tr>
      <td>username:</td>
      <td>{data.user?.username}</td>
    </tr>
    <tr>
      <td>created at:</td>
      <td>{data.user?.createdAt}</td>
    </tr>
    <tr>
      <td>color theme:</td>
      <td>
        <select name="colorMode" value={data.colorMode}>
          <option value="os">os default</option>
          <option value="dark">dark</option>
          <option value="white">white</option>
        </select>
      </td>
    </tr>
  </table>
  <button>update</button>
</form>
