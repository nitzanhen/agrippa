
export type Falsy = undefined | null | false | 0 | '';

/** Makes only the keys K of T optional */
export type SemiPartial<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;

export type DeepPartial<T> = {
  [K in keyof T]?: T[K] extends object ? DeepPartial<T[K]> : T[K]
}