<script>
  export let data;
  $: text = `User ${data.username} | chientrm.com`;
</script>

<svelte:head>
  <title>{text}</title>
  <meta name="description" content={text} />
  <meta property="og:title" content={text} />
  <meta property="og:description" content={text} />
</svelte:head>

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
