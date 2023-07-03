export interface I18n<T extends Record<string, string>> {
  US: T;
  VN: T;
}

export const i18n = (locals: App.Locals, names: string[]) => {};
