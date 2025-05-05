<script>
	import '../app.css';

	let { children } = $props();
</script>

<svelte:head>
	<title>chientrm.com</title>
	<meta
		name="description"
		content="Welcome to chientrm.com, your destination for innovative products and solutions."
	/>
	<meta name="viewport" content="width=device-width, initial-scale=1.0" />
</svelte:head>

<div class="flex flex-col min-h-screen">
	<nav class="bg-gray-100 p-4 shadow-md flex justify-between items-center">
		<a href="/" class="flex items-center gap-2 text-blue-600 text-xl font-bold hover:underline">
			<img src="https://avatars.githubusercontent.com/u/70304839" class="w-10 h-10 rounded-full" />
			chientrm.com
		</a>
		<a href="/about" class="text-blue-600 text-xl hover:underline">about</a>
	</nav>

	<main class="flex-grow p-4">
		{@render children()}
	</main>

	<footer class="bg-gray-100 p-4 text-center text-gray-600">
		<p>&copy; {new Date().getFullYear()} chientrm.com. All rights reserved.</p>
	</footer>
</div>
