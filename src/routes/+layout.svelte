<script>
	import { onMount } from 'svelte';
	import '../app.css';

	let { children } = $props();

	onMount(() => {
		if (document.getElementById('giscus') && !document.getElementById('giscus').hasChildNodes()) {
			const script = document.createElement('script');
			script.src = 'https://giscus.app/client.js';
			script.setAttribute('data-repo', 'chientrm/com');
			script.setAttribute('data-repo-id', 'R_kgDOJzQmtA');
			script.setAttribute('data-category', 'General');
			script.setAttribute('data-category-id', 'DIC_kwDOJzQmtM4CslE1');
			script.setAttribute('data-mapping', 'pathname');
			script.setAttribute('data-strict', '0');
			script.setAttribute('data-reactions-enabled', '1');
			script.setAttribute('data-emit-metadata', '0');
			script.setAttribute('data-input-position', 'bottom');
			script.setAttribute('data-theme', 'light');
			script.setAttribute('data-lang', 'en');
			script.crossOrigin = 'anonymous';
			script.async = true;
			document.getElementById('giscus').appendChild(script);
		}
	});
</script>

<svelte:head>
	<title>chientrm.com</title>
	<meta
		name="description"
		content="Personal website of chientrm (Chien) - thoughts, ideas, and musings."
	/>
	<meta name="viewport" content="width=device-width, initial-scale=1.0" />
</svelte:head>

<div class="flex flex-col min-h-screen">
	<nav class="bg-gray-100 p-4 shadow-md flex justify-between items-center">
		<a href="/" class="flex items-center gap-2 text-blue-600 text-xl font-bold hover:underline">
			<img
				src="https://avatars.githubusercontent.com/u/70304839"
				alt="chientrm avatar"
				class="w-10 h-10 rounded-full"
			/>
			chientrm.com
		</a>
		<a href="/about" class="text-blue-600 text-xl hover:underline">about</a>
	</nav>

	<main class="flex-grow p-4">
		{@render children()}
		<div id="giscus"></div>
	</main>

	<footer class="bg-gray-100 p-4 text-center text-gray-600">
		<p>&copy; {new Date().getFullYear()} chientrm.com. All rights reserved.</p>
	</footer>
</div>
