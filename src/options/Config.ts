import { CustomFileQueries } from '../files';
import { Plugin } from '../plugin';
import { DeepPartial } from '../utils';
import { Options } from './Options';

type ConfigOptions = DeepPartial<Omit<Options, 'name'>>;

/**
 * Defines the structure of the default export of `agrippa.config.mjs`.
 */
export interface Config {
  options?: ConfigOptions;
  plugins?: Plugin[];
  files?: CustomFileQueries;
};

/**
 * `defineConfig` is used in `agrippa.config.mjs` files, 
 * for better typing intellisense.
 */
export function defineConfig(config: Config): Config {
  return config;
}