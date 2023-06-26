<script lang="ts">
	import {
		Column,
		Content,
		Grid,
		Header,
		HeaderAction,
		HeaderGlobalAction,
		HeaderPanelDivider,
		HeaderPanelLink,
		HeaderPanelLinks,
		HeaderUtilities,
		Row,
		SideNav,
		SideNavItems,
		SideNavLink,
		SideNavMenu,
		SideNavMenuItem,
		SkipToContent
	} from 'carbon-components-svelte';
	import 'carbon-components-svelte/css/all.css';
	import { SettingsAdjust, UserAvatarFilledAlt } from 'carbon-icons-svelte';

	let isSideNavOpen = false;
	let isOpen1 = false;
	let isOpen2 = false;
</script>

<Header platformName="chientrm.com" bind:isSideNavOpen>
	<svelte:fragment slot="skip-to-content">
		<SkipToContent />
	</svelte:fragment>
	<HeaderUtilities>
		<HeaderGlobalAction aria-label="Settings" icon={SettingsAdjust} />
		<HeaderAction bind:isOpen={isOpen1} icon={UserAvatarFilledAlt} closeIcon={UserAvatarFilledAlt}>
			<HeaderPanelLinks>
				<HeaderPanelDivider>Switcher subject 1</HeaderPanelDivider>
				<HeaderPanelLink>Switcher item 1</HeaderPanelLink>
				<HeaderPanelLink>Switcher item 2</HeaderPanelLink>
				<HeaderPanelLink>Switcher item 3</HeaderPanelLink>
				<HeaderPanelLink>Switcher item 4</HeaderPanelLink>
				<HeaderPanelDivider>Switcher subject 2</HeaderPanelDivider>
				<HeaderPanelLink>Switcher item 1</HeaderPanelLink>
				<HeaderPanelLink>Switcher item 2</HeaderPanelLink>
				<HeaderPanelDivider>Switcher subject 3</HeaderPanelDivider>
				<HeaderPanelLink>Switcher item 1</HeaderPanelLink>
			</HeaderPanelLinks>
		</HeaderAction>
		<HeaderAction bind:isOpen={isOpen2}>
			<HeaderPanelLinks>
				<HeaderPanelDivider>Switcher subject 1</HeaderPanelDivider>
				<HeaderPanelLink>Switcher item 1</HeaderPanelLink>
				<HeaderPanelDivider>Switcher subject 2</HeaderPanelDivider>
				<HeaderPanelLink>Switcher item 1</HeaderPanelLink>
				<HeaderPanelLink>Switcher item 2</HeaderPanelLink>
				<HeaderPanelLink>Switcher item 3</HeaderPanelLink>
				<HeaderPanelLink>Switcher item 4</HeaderPanelLink>
				<HeaderPanelLink>Switcher item 5</HeaderPanelLink>
			</HeaderPanelLinks>
		</HeaderAction>
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
