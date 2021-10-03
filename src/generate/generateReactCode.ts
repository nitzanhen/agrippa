import { ComponentComposer } from './ComponentComposer';
import { Config } from './Config';

/**
 * Generates the contents of a React component.
 */
export function generateReactCode(config: Config): string {
  return new ComponentComposer(config).compose();
}