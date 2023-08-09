<script lang="ts">
  import H1 from '$components/typo/H1.svelte';
  import H2 from '$components/typo/H2.svelte';
  import H3 from '$components/typo/H3.svelte';
  import Lead from '$components/typo/Lead.svelte';
  import { Button } from '$components/ui/button';
  import { ExternalLink } from 'lucide-svelte';
  import type { PageData } from './$types';
  export let data: PageData;
  const title = 'chientrm.com | You may find something useful here',
    description =
      'Build products nobody use to spread the boredomness over the world.';
</script>

<svelte:head>
  <title>{title}</title>
  <meta name="description" content={description} />
  <meta property="og:title" content={title} />
  <meta property="og:description" content={description} />
</svelte:head>

<H1>chientrm.com</H1>

<Lead>{description}</Lead>

{#if data.user && !data.user.email}
  <Button href="/auth/change-email">Add email to reset password later</Button>
{/if}

<H2>Dicovers</H2>

<ul class="my-6 ml-6 list-disc [&>li]:mt-2">
  <li>
    <Button href="/thread" variant="link">Thread</Button>
  </li>
  <li>
    <Button href="/counter" variant="link">Counter</Button>
  </li>
  <li>
    <Button href="/are-you-not-entertained" variant="link">
      Are you not entertained?
    </Button>
  </li>
  <li>
    <Button href="/globe" variant="link">Globe</Button>
  </li>
  <li>
    <Button
      href="https://rocketmouse.chientrm.com"
      target="_blank"
      variant="link"
    >
      Rocketmouse
      <ExternalLink class="ml-2 h-4 w-4" />
    </Button>
  </li>
  <li>
    <Button
      href="https://discord.gg/official-r-singularity-discord-server-1057701239426646026"
      target="_blank"
      variant="link"
    >
      Singularity
      <ExternalLink class="ml-2 h-4 w-4" />
    </Button>
  </li>
</ul>

<H2>change logs</H2>

{#each data.logs as { fromNow, changes }}
  <H3>{fromNow}</H3>
  <ul class="my-6 ml-6 list-disc [&>li]:mt-2">
    {#each changes as change}
      <li>{change}</li>
    {/each}
  </ul>
{/each}
