<script lang="ts">
	import image from '$lib/assets/chientrm128.png';
	import youwave from '$lib/assets/youwave.svg';
	import {
		Column,
		Content,
		Grid,
		ImageLoader,
		Link,
		Row,
		Truncate
	} from 'carbon-components-svelte';
</script>

<Content>
	<Grid>
		<Row>
			<Column>
				<h1>chientrm.com</h1>
				<div class="avatar">
					<ImageLoader src={image} />
				</div>
				<h2>Products</h2>
				<Link href="/products/youwave">
					<div class="youwave">
						<ImageLoader src={youwave} />
					</div>
					<Truncate>YouWave</Truncate>
				</Link>
			</Column>
		</Row>
	</Grid>
</Content>

<style>
	.avatar {
		width: 48pt;
	}
	.youwave {
		width: 64pt;
	}
</style>
