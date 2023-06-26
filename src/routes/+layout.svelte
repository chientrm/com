<script lang="ts">
	import {
		Content,
		Header,
		HeaderUtilities,
		SideNav,
		SideNavItems,
		SideNavLink,
		SideNavMenu,
		SideNavMenuItem,
		SkipToContent,
		Theme
	} from 'carbon-components-svelte';
	import 'carbon-components-svelte/css/all.css';

	let isSideNavOpen = false;
</script>

<Header platformName="chientrm.com" bind:isSideNavOpen>
	<svelte:fragment slot="skip-to-content">
		<SkipToContent />
	</svelte:fragment>
	<HeaderUtilities>
		<Theme
			render="toggle"
			toggle={{
				themes: ['white', 'g100'],
				labelA: 'Dark mode',
				labelB: 'Dark mode',
				hideLabel: true
			}}
			persist
		/>
	</HeaderUtilities>
</Header>

<SideNav bind:isOpen={isSideNavOpen}>
	<SideNavItems>
		<SideNavLink href="/" text="Home" />
		<SideNavMenu text="Products">
			<SideNavMenuItem href="/products/youwave" text="YouWave" />
			<SideNavMenuItem href="/products/spacexdata" text="SpaceX data" />
		</SideNavMenu>
		<SideNavLink href="/contacts" text="Contacts" />
	</SideNavItems>
</SideNav>

<Content>
	<slot />
</Content>
