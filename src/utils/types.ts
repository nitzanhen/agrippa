/** Options common to all commands. */
export interface CommonConfig { 
  debug: boolean; 
}

export type ValueOf<O> = O[keyof O];