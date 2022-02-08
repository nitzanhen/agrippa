
export type Falsey = undefined | null | false;

export type MaybePromise<P> = Promise<P> | P;

export type SemiPartial<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;
