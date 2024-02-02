<script>
  import { PUBLIC_OG_URL } from '$env/static/public';
  import logo from '$lib/assets/chientrm.png';
  import ModeToggle from '$lib/components/ModeToggle.svelte';
  import Referral from '$lib/components/Referral.svelte';
  import { Button } from '$lib/components/ui/button';
  import { ModeWatcher } from 'mode-watcher';
  import MdiGithub from '~icons/mdi/github';
  import MingcuteSocialXLine from '~icons/mingcute/social-x-line';
  import '../app.pcss';

  export let data;
</script>

<svelte:head>
  <link rel="icon" href={logo} />
  <meta name="keywords" content="chientrm, blogs, tools" />
  <meta name="author" content="chientrm" />
  <meta property="og:type" content="website" />
  <meta property="og:url" content={PUBLIC_OG_URL} />
  <meta property="og:image" content={`${PUBLIC_OG_URL}${logo}`} />
</svelte:head>

<ModeWatcher />

<header class="flex flex-row gap-2 p-4">
  <Button href="/" variant="link" class="gap-1">chientrm</Button>
  <Button href="/thread" variant="link">Thread</Button>
  <div class="grow"></div>
  {#if data.user}
    <Button href="/account">
      {data.user.username} ({data.count})
    </Button>
  {:else}
    <Button href="/auth">Login</Button>
  {/if}
  <Referral href="https://twitter.com/realchientrm" alt="Twitter">
    <MingcuteSocialXLine class="h-5 w-5" />
  </Referral>
  <Referral href="https://github.com/chientrm/com" alt="Github">
    <MdiGithub class="h-5 w-5" />
  </Referral>
  <ModeToggle />
</header>
<div class="p-8">
  <slot />
</div>
