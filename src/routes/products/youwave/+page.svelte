<script>
	import {
		Breadcrumb,
		BreadcrumbItem,
		Column,
		Content,
		Grid,
		Truncate
	} from 'carbon-components-svelte';
</script>

<Content>
	<Grid>
		<Column>
			<Breadcrumb noTrailingSlash>
				<BreadcrumbItem href="/">Home</BreadcrumbItem>
				<BreadcrumbItem>Products</BreadcrumbItem>
				<BreadcrumbItem href="/products/youwave" isCurrentPage>YouWave</BreadcrumbItem>
			</Breadcrumb>
			<h1>YouWave</h1>
			<Truncate>Halu</Truncate>
		</Column>
	</Grid>
</Content>
