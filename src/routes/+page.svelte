<script lang="ts">
  import type { PageData } from './$types';
  export let data: PageData;
</script>

<svelte:head>
  <meta name="description" content="just a bunch of random stuffs" />
  <meta property="og:title" content="chientrm.com" />
  <meta property="og:description" content="just a bunch of random stuffs" />
</svelte:head>

<p>you may find something useful here</p>

<ol>
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
    <a href="https://rocketmouse.chientrm.com">rocketmouse</a>
  </li>
  <li>
    <a
      href="https://discord.gg/official-r-singularity-discord-server-1057701239426646026"
    >
      singularity
    </a>
  </li>
  <li>
    <a href="/llama-v2">llama v2</a>
  </li>
</ol>

<h2>change logs</h2>

{#each data.logs as { fromNow, changes }}
  <h3>{fromNow}</h3>
  <ul>
    {#each changes as change}
      <li>{change}</li>
    {/each}
  </ul>
{/each}
