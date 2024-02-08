<script>
  import { Button } from '$lib/components/ui/button';
  import { siteConfig } from '$lib/config';
  import CarbonLaunch from '~icons/carbon/launch';
</script>

<h3 class="scroll-m-20 text-2xl font-semibold tracking-tight">Apps</h3>
<ul>
  <li>
    <Button href="/deep" variant="link">
      {siteConfig.deep.title} - {siteConfig.deep.description}
    </Button>
  </li>
  <li>
    <Button href="/globe" variant="link">
      {siteConfig.globe.title} - {siteConfig.globe.description}
    </Button>
  </li>
  <li>
    <Button href="/globe" variant="link">
      {siteConfig.globe.title} - {siteConfig.globe.description}
    </Button>
  </li>
</ul>

<h3 class="scroll-m-20 text-2xl font-semibold tracking-tight">Backlinks</h3>
<ul>
  <li>
    <Button href="https://torrentchill.com" target="_blank" variant="link">
      TorrentChill
      <CarbonLaunch class="ml-2 h-4 w-4" />
    </Button>
  </li>
  <li>
    <Button href="https://pewxpew.com" target="_blank" variant="link">
      PewXPew
      <CarbonLaunch class="ml-2 h-4 w-4" />
    </Button>
  </li>
  <li>
    <Button href="https://shitpostai.com" target="_blank" variant="link">
      ShitpostAI
      <CarbonLaunch class="ml-2 h-4 w-4" />
    </Button>
  </li>
  <li>
    <Button
      href="https://rocketmouse.chientrm.com"
      target="_blank"
      variant="link"
    >
      Rocketmouse
      <CarbonLaunch class="ml-2 h-4 w-4" />
    </Button>
  </li>
</ul>
<h3 class="scroll-m-20 text-2xl font-semibold tracking-tight">Discover</h3>
<ul>
  <li>
    <Button href="/blog" variant="link">blog</Button>
  </li>
  <li>
    <Button href="/changelogs" variant="link">changelogs</Button>
  </li>
</ul>
