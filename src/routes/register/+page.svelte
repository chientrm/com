<script>
  let username = '';
  let password = '';

  function handleRegister() {
    // Handle registration logic here
    console.log('Registering with', { username, password });
  }
</script>

<h1>Register</h1>
<form on:submit|preventDefault={handleRegister}>
  <label>
    Username:
    <input type="text" bind:value={username} required />
  </label>
  <label>
    Password:
    <input type="password" bind:value={password} required />
  </label>
  <button type="submit">Register</button>
</form>
