<script>
  import favicon from '$lib/assets/favicon.png';
  import 'modern-normalize/modern-normalize.css';
  import '$lib/app.css';
</script>

<svelte:head>
  <link rel="icon" href={favicon} />
</svelte:head>

<div>
  <h2>
    <a href="/">chientrm.com</a>
  </h2>
  <slot />
</div>

<style>
  div {
    display: flex;
    flex-direction: column;
    gap: 8pt;
  }
  h2 {
    padding: 0 8pt;
  }
</style>
