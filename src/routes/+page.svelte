<script lang="ts">
	import image from '$lib/assets/chientrm128.png';
	import youwave from '$lib/assets/youwave.svg';
	import spacexdata from '$lib/assets/spacexdata.png';
	import { ImageLoader, Link, Truncate } from 'carbon-components-svelte';
</script>

<div class="avatar">
	<ImageLoader src={image} />
</div>

<h2>Products</h2>

<a href="/products/youwave">
	<div>
		<ImageLoader src={youwave} />
	</div>
	<Truncate>YouWave</Truncate>
</a>

<a href="/products/spacexdata">
	<div>
		<ImageLoader src={spacexdata} />
	</div>
	<Truncate>SpaceX data</Truncate>
</a>

<style>
	div {
		width: 64pt;
	}
	a {
		display: flex;
		flex-direction: row;
		gap: 12pt;
		align-items: center;
		text-decoration: none;
	}
	a div {
		height: 64pt;
		width: 64pt;
	}
</style>
