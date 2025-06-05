/* eslint-disable @typescript-eslint/no-explicit-any */
type QueryKeyFactory<T extends Record<string, (...args: any[]) => any>> = {
  all: () => string[];
} & {
  [K in keyof T]: (...args: Parameters<T[K]>) => ReturnType<T[K]>;
};

export function createQueryKeys<
  T extends Record<string, (...args: any[]) => any>
>(prefix: string, keys: T): QueryKeyFactory<T> {
  return {
    all: () => [prefix],
    ...Object.fromEntries(
      Object.entries(keys).map(([key, fn]) => [
        key,
        (...args: any[]) => [prefix, key, ...fn(...args)],
      ])
    ),
  } as QueryKeyFactory<T>;
}