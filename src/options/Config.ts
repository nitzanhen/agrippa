import { CustomFileQueries } from '../files';
import { DeepPartial } from '../utils';
import { Options } from './Options';

/**
 * Defines the structure of the default export of `agrippa.config.mjs`.
 */
export interface Config {
  options?: DeepPartial<Options>;
  files?: CustomFileQueries
};

/**
 * `defineConfig` is used in `agrippa.config.mjs` files, 
 * for better typing intellisense.
 */
export function defineConfig(config: Config): Config {
  return config;
}