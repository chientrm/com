<script>
	import { Link, ListItem, OutboundLink, UnorderedList } from 'carbon-components-svelte';
	import { Email, LogoGithub, LogoTwitter } from 'carbon-icons-svelte';
</script>

<h1>Contacts</h1>
<UnorderedList>
	<ListItem>
		Twitter (<LogoTwitter />):
		<OutboundLink href="https://twitter.com/chientrm">@chientrm</OutboundLink>
	</ListItem>
	<ListItem>
		Github (<LogoGithub />):
		<OutboundLink href="https://github.com/chientrm">chientrm</OutboundLink>
	</ListItem>
	<ListItem>
		Email (<Email />): chientrm@gmail.com
		<a href="mailto:chientrm@gmail.com">Send email</a>
	</ListItem>
</UnorderedList>
