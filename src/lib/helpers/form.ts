export const autoSubmit = (form: HTMLFormElement, e: KeyboardEvent) => {
  if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) {
    form.requestSubmit();
  }
};
