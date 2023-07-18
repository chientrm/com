const UNIQUE = 'UNIQUE constraint failed';

export const unique = (e: any) => {
  if (
    e instanceof Error &&
    (e.message.includes(UNIQUE) ||
      // @ts-ignore
      e.cause?.message.includes(UNIQUE))
  ) {
    return true;
  }
  return false;
};
