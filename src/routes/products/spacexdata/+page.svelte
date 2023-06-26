<script>
	import { Breadcrumb, BreadcrumbItem, OutboundLink, Truncate } from 'carbon-components-svelte';
</script>

<Breadcrumb noTrailingSlash>
	<BreadcrumbItem href="/">Home</BreadcrumbItem>
	<BreadcrumbItem>Products</BreadcrumbItem>
	<BreadcrumbItem href="/products/spacexdata" isCurrentPage>SpaceX data</BreadcrumbItem>
</Breadcrumb>
<h1>SpaceX data</h1>
<Truncate>Audio sharing and listening</Truncate>
<OutboundLink href="https://spacexdata.pages.dev">SpaceX data</OutboundLink>
