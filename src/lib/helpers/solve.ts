import type { ActionFailure, Redirect } from '@sveltejs/kit';

type ActionFailureType = Record<string, unknown> | undefined;

type Function<T extends ActionFailureType> = () => Promise<
  Redirect | ActionFailure<T> | void
> | void;

export const solve = async <T extends ActionFailureType>(f: Function<T>) => {
  const result = await f();
  // @ts-ignore
  const name = result.constructor.name;
  if (name === 'Redirect') {
    throw result;
  } else if (name === 'ActionFailure') {
    return result;
  }
};
