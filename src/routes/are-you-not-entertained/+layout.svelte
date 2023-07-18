<script>
  const title = 'Are you not entertained?',
    description = 'Highly entertainted tweets';
</script>

<svelte:head>
  <script
    async
    src="https://platform.twitter.com/widgets.js"
    charset="utf-8"
  ></script>
  <title>chientrm.com | {title}</title>
  <meta name="description" content={description} />
  <meta property="og:title" content={title} />
  <meta property="og:description" content={description} />
</svelte:head>

<h3>Are you not entertained?</h3>

<slot />
