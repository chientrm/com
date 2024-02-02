<script lang="ts">
  import { cn } from '$lib/utils';

  let className: string | undefined | null = undefined;
  export { className as class };
</script>

<p
  class={cn(
    'max-w-[750px] text-lg text-muted-foreground sm:text-xl',
    className
  )}
  {...$$restProps}
>
  <slot />
</p>
