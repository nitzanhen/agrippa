import { DeepPartial } from '../utils';
import { GenerateOptions } from './Config';

/**
 * Defines the structure of the default export of `agrippa.config.mjs`.
 */
export interface ConfigDefinition {
  options?: DeepPartial<GenerateOptions>
};

/**
 * `defineConfig` is used in `agrippa.config.mjs` files, 
 * for better typing intellisense.
 */
export function defineConfig(config: ConfigDefinition): ConfigDefinition {
  return config;
}