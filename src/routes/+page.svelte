<script lang="ts">
  import type { PageData } from './$types';
  export let data: PageData;
</script>

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
