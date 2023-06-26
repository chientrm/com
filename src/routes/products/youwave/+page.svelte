<script>
	import src from '$lib/assets/youwave.svg';
	import {
		Breadcrumb,
		BreadcrumbItem,
		ImageLoader,
		OutboundLink,
		Truncate
	} from 'carbon-components-svelte';
</script>

<Breadcrumb noTrailingSlash>
	<BreadcrumbItem href="/">Home</BreadcrumbItem>
	<BreadcrumbItem>Products</BreadcrumbItem>
	<BreadcrumbItem href="/products/youwave" isCurrentPage>YouWave</BreadcrumbItem>
</Breadcrumb>
<h1>YouWave</h1>
<div>
	<ImageLoader {src} />
</div>
<Truncate>Audio sharing and listening</Truncate>
<OutboundLink href="https://play.google.com/store/apps/details?id=site.chientrm.youwave">
	Google Play
</OutboundLink>

<style>
	div {
		width: 64pt;
	}
</style>
