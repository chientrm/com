<script lang="ts">
  import { cn } from '$lib/utils';
  import { buttonVariants } from './ui/button';
  export let href: string;
  export let alt: string;
</script>

<a
  {href}
  target="_blank"
  class={cn(
    buttonVariants({
      size: 'sm',
      variant: 'ghost'
    }),
    'w-9 px-0'
  )}
>
  <slot />
  <span class="sr-only">{alt}</span>
</a>
