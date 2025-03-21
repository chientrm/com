<script>
  let username = '';
  let password = '';

  function handleLogin() {
    // Handle login logic here
    console.log('Logging in with', { username, password });
  }
</script>

<h1>Login</h1>
<form on:submit|preventDefault={handleLogin}>
  <label>
    Username:
    <input type="text" bind:value={username} required />
  </label>
  <label>
    Password:
    <input type="password" bind:value={password} required />
  </label>
  <button type="submit">Login</button>
</form>
