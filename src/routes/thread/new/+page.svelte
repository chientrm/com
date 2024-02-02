<script lang="ts">
  import { enhance } from '$app/forms';
  import { Button } from '$lib/components/ui/button';
  import { Label } from '$lib/components/ui/label';
  import { Textarea } from '$lib/components/ui/textarea';
  import { autoSubmit } from '$lib/helpers/form';

  export let data;
  let formEl: HTMLFormElement;
</script>

<form method="POST" use:enhance bind:this={formEl}>
  <div class="space-y-1">
    <Label for="content">content</Label>
    <Textarea
      name="content"
      value={data.content}
      maxlength={5000}
      on:keydown={(e) => autoSubmit(formEl, e)}
    />
  </div>
  <Button type="submit">submit</Button>
</form>
