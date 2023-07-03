<script>
  import favicon from '$lib/assets/favicon.png';
  import 'modern-normalize/modern-normalize.css';
  import '$lib/app.css';
</script>

<svelte:head>
  <link rel="icon" href={favicon} />
</svelte:head>

<header>
  <h2>chientrm.com</h2>
</header>

<slot />
