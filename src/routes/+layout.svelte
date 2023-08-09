<script lang="ts">
  import { navigating } from '$app/stores';
  import Referral from '$components/Referral.svelte';
  import { LightSwitch } from '$components/light-switch';
  import { Avatar, AvatarFallback, AvatarImage } from '$components/ui/avatar';
  import Button from '$components/ui/button/Button.svelte';
  import { PUBLIC_OG_URL } from '$env/static/public';
  import logo from '$lib/assets/chientrm.png';
  import Navigating from '$lib/components/Navigating.svelte';
  import { setInitialClassState } from '$lib/components/light-switch/light-switch';
  import { Github, Twitter } from 'lucide-svelte';
  import '../app.postcss';
  import type { LayoutData } from './$types';
  export let data: LayoutData;
</script>

<svelte:head>
  <link rel="icon" href={logo} />
  <title>chientrm.com | You may find something useful here</title>
  <meta name="keywords" content="chientrm, blogs, tools" />
  <meta name="author" content="chientrm" />
  <meta property="og:type" content="website" />
  <meta property="og:url" content={PUBLIC_OG_URL} />
  <meta property="og:image" content={`${PUBLIC_OG_URL}${logo}`} />
  {@html `<\u{73}cript nonce="%sveltekit.nonce%">(${setInitialClassState.toString()})();</script>`}
</svelte:head>

{#if $navigating}
  <Navigating />
{/if}

<header class="flex flex-row p-4 gap-2">
  <Button href="/" variant="link" class="gap-1">
    <Avatar>
      <AvatarImage src={logo} alt="@chientrm" />
      <AvatarFallback>Logo</AvatarFallback>
    </Avatar>
    chientrm
  </Button>
  <Button href="/ask" variant="link">ask ({data.totalCount})</Button>
  <div class="grow" />
  {#if data.user}
    <Button href="/account">
      {data.user.username} ({data.count})
    </Button>
  {:else}
    <Button href="/auth">Login</Button>
  {/if}
  <Referral href="https://twitter.com/chientrm" alt="Twitter">
    <Twitter class="h-5 w-5" />
  </Referral>
  <Referral href="https://github.com/chientrm" alt="Github">
    <Github class="h-5 w-5" />
  </Referral>
  <LightSwitch />
</header>
<div class="p-8">
  <slot />
</div>
