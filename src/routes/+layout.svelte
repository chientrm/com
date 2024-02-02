<script>
  import { page } from '$app/stores';
  import { PUBLIC_HOST } from '$env/static/public';
  import logo from '$lib/assets/chientrm.png';
  import ModeToggle from '$lib/components/ModeToggle.svelte';
  import * as Accordion from '$lib/components/ui/accordion';
  import { Button } from '$lib/components/ui/button';
  import * as PageHeader from '$lib/components/ui/page-header';
  import { footerConfig, siteConfig } from '$lib/config';
  import { anonymousUsername } from '$lib/constants/string';
  import { ModeWatcher } from 'mode-watcher';
  import MdiGithub from '~icons/mdi/github';
  import MingcuteSocialXLine from '~icons/mingcute/social-x-line';
  import NotoFrog from '~icons/noto/frog';
  import '../app.pcss';
  export let data;

  $: title = $page.data?.title
    ? $page.data.title
    : `${siteConfig.name} - ${siteConfig.title}`;
  $: description = $page.data?.description ?? siteConfig.description;
</script>

<svelte:head>
  <title>{title}</title>
  <meta name="description" content={description} />
  <meta name="keywords" content={siteConfig.keywords} />
  <meta name="author" content="realchientrm" />
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:site" content={PUBLIC_HOST} />
  <meta name="twitter:title" content={title} />
  <meta name="twitter:description" content={description} />
  <meta name="twitter:image" content="{PUBLIC_HOST}${logo}" />
  <meta name="twitter:image:alt" content={siteConfig.name} />
  <meta name="twitter:creator" content="realchientrm" />
  <meta property="og:title" content={title} />
  <meta property="og:type" content="article" />
  <meta property="og:url" content={PUBLIC_HOST + $page.url.pathname} />
  <meta property="og:image" content="{PUBLIC_HOST}${logo}" />
  <meta property="og:image:alt" content={siteConfig.name} />
  <meta property="og:image:width" content="1200" />
  <meta property="og:image:height" content="630" />
  <meta property="og:description" content={description} />
  <meta property="og:site_name" content={siteConfig.name} />
  <meta property="og:locale" content="EN_US" />
  <link rel="shortcut icon" href="/favicon-16x16.png" />
  <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
</svelte:head>

<ModeWatcher />

<div class="relative flex min-h-screen flex-col" id="page">
  <header
    class="sticky top-0 z-50 w-full border-b bg-background/95 shadow-sm backdrop-blur supports-[backdrop-filter]:bg-background/60"
  >
    <div class="container flex h-14 items-center">
      <div
        class="flex flex-1 items-center justify-between space-x-2 sm:space-x-4"
      >
        <Button href="/" variant="link">
          <NotoFrog class="mr-2 h-6 w-6" />
          {siteConfig.name}
        </Button>
        <Button href="/blog" variant="link" class="max-sm:hidden">blog</Button>
        <Button href="/thread" variant="link" class="max-sm:hidden">
          thread
        </Button>
        <div class="grow"></div>
        {#if data.user.username === anonymousUsername}
          <Button href="/auth">sign up</Button>
        {:else}
          <Button href="/account">
            {data.user.username} ({data.count})
          </Button>
        {/if}
        <nav class="flex items-center">
          <Button
            href={siteConfig.twitter}
            target="_blank"
            class="w-9 px-0 max-sm:hidden"
            variant="ghost"
          >
            <MingcuteSocialXLine class="h-4 w-4" />
            <span class="sr-only">X</span>
          </Button>
          <Button
            href={siteConfig.github}
            target="_blank"
            class="w-9 px-0 max-sm:hidden"
            variant="ghost"
          >
            <MdiGithub class="h-4 w-4" />
            <span class="sr-only">Github</span>
          </Button>
          <ModeToggle />
        </nav>
      </div>
    </div>
  </header>
  <div class="flex-1">
    <div class="container relative">
      <PageHeader.Root class="pb-8">
        <PageHeader.Heading>{$page.data.title}</PageHeader.Heading>
        <PageHeader.Description>
          {$page.data.description}
        </PageHeader.Description>
        <slot />
      </PageHeader.Root>
    </div>
  </div>
  <footer class="border-t px-4 py-10">
    <div class="mx-auto max-w-6xl">
      <div
        class="flex flex-col items-start justify-between space-y-8 md:flex-row md:space-y-0"
      >
        <div>
          <a href="/" class="flex flex-row items-center gap-2">
            <NotoFrog class="h-16 w-16" />
            <span class="text-[15px] font-bold sm:inline-block lg:text-base">
              {siteConfig.name}
            </span>
          </a>
          <div class="mt-6 flex space-x-4 text-muted-foreground">
            <a
              href={siteConfig.twitter}
              target="_blank"
              rel="noreferrer noopener"
            >
              <svg class="h-4 w-4" viewBox="0 0 1200 1227" fill="currentColor">
                <path
                  d="M714.163 519.284L1160.89 0H1055.03L667.137 450.887L357.328 0H0L468.492 681.821L0 1226.37H105.866L515.491 750.218L842.672 1226.37H1200L714.137 519.284H714.163ZM569.165 687.828L521.697 619.934L144.011 79.6944H306.615L611.412 515.685L658.88 583.579L1055.08 1150.3H892.476L569.165 687.854V687.828Z"
                />
              </svg>
            </a>
          </div>
        </div>
        {#each footerConfig as { name, items }}
          <div class="max-md:hidden">
            <div class="text-sm font-semibold tracking-wide">
              {name}
            </div>
            <div class="mt-6 flex flex-col items-start space-y-3 font-medium">
              {#each items as { name, href, target }}
                <Button {href} variant="link" {target} class="pl-0">
                  {name}
                </Button>
              {/each}
            </div>
          </div>
        {/each}
        <Accordion.Root class="w-full md:hidden">
          {#each footerConfig as { name, items }, i}
            <Accordion.Item value="faq-{i}">
              <Accordion.Trigger>{name}</Accordion.Trigger>
              <Accordion.Content>
                {#each items as { name, href, target }}
                  <a
                    {href}
                    class="block font-semibold text-muted-foreground"
                    {target}>{name}</a
                  >
                {/each}
              </Accordion.Content>
            </Accordion.Item>
          {/each}
        </Accordion.Root>
      </div>
      <div
        class="mt-12 flex flex-col space-x-0 space-y-4 text-sm font-medium sm:flex-row sm:space-x-6 sm:space-y-0"
      >
        <span>copyright &copy; 2024</span>
        <a href="/terms" class="text-muted-foreground">terms of Service</a>
        <a href="/privacy" class="text-muted-foreground">privacy Policy</a>
        <a href="/cookies" class="text-muted-foreground">cookies</a>
      </div>
    </div>
  </footer>
</div>
