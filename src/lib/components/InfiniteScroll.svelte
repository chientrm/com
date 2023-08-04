<script lang="ts">
  import { createEventDispatcher, onDestroy } from 'svelte';

  export let threshold = 0;
  export let hasMore = true;

  const dispatch = createEventDispatcher();
  let isLoadMore = false;
  let component: HTMLDivElement;

  $: {
    if (component) {
      const element = component.parentNode!;

      element.addEventListener('scroll', onScroll);
      element.addEventListener('resize', onScroll);
    }
  }

  const onScroll = (e: Event) => {
    const element = e.target! as HTMLElement,
      offset = element.scrollHeight - element.clientHeight - element.scrollTop;

    if (offset <= threshold) {
      if (!isLoadMore && hasMore) {
        dispatch('loadMore');
      }
      isLoadMore = true;
    } else {
      isLoadMore = false;
    }
  };

  onDestroy(() => {
    if (component) {
      const element = component.parentNode!;

      element.removeEventListener('scroll', null);
      element.removeEventListener('resize', null);
    }
  });
</script>

<div bind:this={component} style="width:0px" />
