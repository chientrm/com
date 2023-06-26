<script lang="ts">
	import { Theme } from 'carbon-components-svelte';
	import 'carbon-components-svelte/css/all.css';
</script>

<div>
	<Theme
		render="toggle"
		toggle={{
			themes: ['g10', 'g80'],
			labelA: 'Dark mode',
			labelB: 'Dark mode',
			hideLabel: true
		}}
		persist
		persistKey="__carbon-theme"
	/>
	<slot />
</div>

<style>
	div {
		display: flex;
		flex-direction: column;
		align-items: center;
	}
</style>
