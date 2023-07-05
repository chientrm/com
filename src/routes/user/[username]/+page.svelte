<script lang="ts">
  import type { PageData } from './$types';
  export let data: PageData;
</script>

<form method="POST" action="?/update">
  <table>
    <tr>
      <td>username:</td>
      <td>{data.username}</td>
    </tr>
    <tr>
      <td>created at:</td>
      <td>{data.createdAt}</td>
    </tr>
    {#if data.user?.username === data.username}
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
    {/if}
  </table>
  {#if data.user?.username === data.username}
    <button>update</button>
  {/if}
</form>
