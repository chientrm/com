<script lang="ts">
  import { Button } from '$lib/components/ui/button';
  import * as Card from '$lib/components/ui/card';
  import * as Command from '$lib/components/ui/command';
  import { Input } from '$lib/components/ui/input';
  import { Label } from '$lib/components/ui/label';
  import * as Popover from '$lib/components/ui/popover';
  import { cn } from '$lib/utils';
  import { fabric } from 'fabric';
  import { onMount, tick } from 'svelte';
  import MaterialSymbolsCheckSmall from '~icons/material-symbols/check-small';
  import PhCaretUpDown from '~icons/ph/caret-up-down';

  const width = 600;
  const height = 675;

  const fonts = [
    'Arial',
    'Verdana',
    'Tahoma',
    'Trebuchet MS',
    'Times New Roman',
    'Georgia',
    'Garamond',
    'Courier New',
    'Brush Script MT'
  ];
  let open = false;
  let fontValue = fonts[0];
  $: selectedFont = fonts.find((f) => f === fontValue);
  function closeAndFocusTrigger(triggerId: string) {
    open = false;
    tick().then(() => {
      document.getElementById(triggerId)?.focus();
    });
  }

  let canvasEl: HTMLCanvasElement;
  let canvas: fabric.Canvas;

  onMount(() => {
    canvas = new fabric.Canvas(canvasEl, { width, height });
    canvas.add(
      new fabric.Rect({
        left: 0,
        top: 0,
        fill: 'white',
        width,
        height,
        selectable: false
      })
    );
    canvas.add(
      new fabric.IText('Replace this text...', {
        left: width / 2 - 150,
        top: height / 2 - 50,
        width,
        height,
        fill: 'black',
        fontSize: 32,
        fontFamily: 'Arial'
      })
    );
    return () => {
      canvas.dispose();
    };
  });

  function changeTextColor(e: Event) {
    const value = (e.target! as HTMLInputElement).value;
    canvas.getObjects()[1].set('fill', value);
    canvas.renderAll();
  }
  function changeBackgroundColor(e: Event) {
    const value = (e.target! as HTMLInputElement).value;
    canvas.getObjects()[0].set('fill', value);
    canvas.renderAll();
  }
  function changeFontFamily(value: string) {
    (canvas.getObjects()[1] as fabric.IText).set('fontFamily', value);
    canvas.renderAll();
  }
  function changeFontSize(e: Event) {
    const value = (e.target! as HTMLInputElement).value;
    (canvas.getObjects()[1] as fabric.IText).set('fontSize', parseInt(value));
    canvas.renderAll();
  }
  function save() {
    const link = document.createElement('a');
    link.href = canvas.toDataURL({ format: 'png', multiplier: 2 });
    link.download = 'canvas.png';
    link.click();
  }
</script>

<Card.Root>
  <Card.CardHeader>
    <Card.CardTitle>deep</Card.CardTitle>
    <Card.CardDescription>
      optimal width = {width} and height = {height}.
    </Card.CardDescription>
  </Card.CardHeader>
  <Card.CardContent class="space-y-2">
    <div class="flex flex-row gap-2">
      <Label for="text_color" class="sr-only">text color</Label>
      <Input
        id="text_color"
        name="text_color"
        type="color"
        class="h-10 w-10"
        value="#000"
        on:change={changeTextColor}
      />
      <Label for="background_color" class="sr-only">background color</Label>
      <Input
        id="background_color"
        name="background_color"
        type="color"
        class="h-10 w-10"
        value="#ffffff"
        on:change={changeBackgroundColor}
      />
      <Popover.Root bind:open let:ids>
        <Popover.Trigger asChild let:builder>
          <Button
            builders={[builder]}
            variant="outline"
            role="combobox"
            aria-expanded={open}
            class="w-[200px] justify-between"
          >
            {selectedFont}
            <PhCaretUpDown class="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </Popover.Trigger>
        <Popover.Content class="w-[200px] p-0">
          <Command.Root>
            <Command.Input placeholder="search font..." class="h-9" />
            <Command.Empty>no font found.</Command.Empty>
            <Command.Group>
              {#each fonts as font}
                <Command.Item
                  value={font}
                  onSelect={(currentValue) => {
                    fontValue = currentValue;
                    changeFontFamily(currentValue);
                    closeAndFocusTrigger(ids.trigger);
                  }}
                >
                  <MaterialSymbolsCheckSmall
                    class={cn(
                      'mr-2 h-4 w-4',
                      fontValue !== font && 'text-transparent'
                    )}
                  />
                  {font}
                </Command.Item>
              {/each}
            </Command.Group>
          </Command.Root>
        </Popover.Content>
      </Popover.Root>
      <Label for="fontSize" class="sr-only">font size</Label>
      <Input
        id="fontSize"
        name="fontSize"
        type="number"
        class="h-10 w-16"
        value={32}
        on:change={changeFontSize}
      />
      <div class="grow" />
      <Button on:click={save}>save</Button>
    </div>
    <canvas bind:this={canvasEl} />
  </Card.CardContent>
</Card.Root>
