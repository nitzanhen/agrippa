import { ValueOf } from './types';

export const pick = <O extends object, K extends keyof O>(obj: O, keys: K[]): Pick<O, K> =>
  (Object.entries(obj) as [keyof O, ValueOf<O>][])
    .filter(([k]) => keys.includes(k as K))
    .reduce(
      (acc, [k, v]) => ({ ...acc, [k]: v }),
      {} as Pick<O, K>
    );

export const reduce = <O extends object, A>(obj: O, reducer: (acc: A, v: ValueOf<O>, k: keyof O) => A, initialValue: A): A =>
  (Object.entries(obj) as [keyof O, ValueOf<O>][])
    .reduce(
      (acc, [k, v]) => reducer(acc, v, k),
      initialValue
    );