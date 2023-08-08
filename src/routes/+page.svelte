<script lang="ts">
  import MdOpenInNew from 'svelte-icons/md/MdOpenInNew.svelte';
  import type { PageData } from './$types';
  export let data: PageData;
</script>

<svelte:head>
  <meta name="description" content="just a bunch of random stuffs" />
  <meta property="og:title" content="chientrm.com" />
  <meta property="og:description" content="just a bunch of random stuffs" />
</svelte:head>

<blockquote class="mt-6 border-l-2 pl-6 italic">
  "you may find something useful here."
</blockquote>

<ul class="my-6 ml-6 list-disc [&>li]:mt-2">
  <li>
    <a href="/ask">wanna ask?</a>
  </li>
  <li>
    <a href="/counter">counter</a>
  </li>
  <li>
    <a href="/are-you-not-entertained">are you not entertained?</a>
  </li>
  <li>
    <a href="/globe">globe</a>
  </li>
  <li>
    <a href="https://rocketmouse.chientrm.com" target="_blank">
      rocketmouse
      <div class="icon">
        <MdOpenInNew />
      </div>
    </a>
  </li>
  <li>
    <a
      href="https://discord.gg/official-r-singularity-discord-server-1057701239426646026"
      target="_blank"
    >
      singularity
      <div class="icon">
        <MdOpenInNew />
      </div>
    </a>
  </li>
</ul>

<h2
  class="mt-10 scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight transition-colors first:mt-0"
>
  change logs
</h2>

{#each data.logs as { fromNow, changes }}
  <h3 class="scroll-m-20 text-2xl font-semibold tracking-tight">{fromNow}</h3>
  <ul class="my-6 ml-6 list-disc [&>li]:mt-2">
    {#each changes as change}
      <li>{change}</li>
    {/each}
  </ul>
{/each}
