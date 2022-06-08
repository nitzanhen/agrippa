import { Options, Environment, Styling } from '../options';
import { capitalize } from './strings';

const environmentTags: Record<string, string> = {
  [Environment.REACT]: 'React',
  [Environment.REACT_NATIVE]: 'React Native',
  [Environment.SOLIDJS]: 'SolidJS',
  [Environment.PREACT]: 'Preact'
};

const stylingTags: Record<string, string> = {
  [Styling.CSS]: 'CSS',
  [Styling.SCSS]: 'SCSS',
  [Styling.JSS]: 'JSS',
  [Styling.STYLED_COMPONENTS]: 'styled-components'
};

/**
 * Determines a list of tags describing the project's stack.
 * These tags describe the stack's main components - environment, TS, styling, etc.
 * 
 * @todo find a way to make this configurable from outside/plugins.
 */
export function getStackTags(options: Options): string[] {
  const { environment, styling, typescript } = options;
  const envTag = environmentTags[environment] ?? capitalize(environment);
  const typescriptTag = typescript ? 'TypeScript' : undefined;
  const stylingTag = styling && stylingTags[styling];

  const stackTags = [
    envTag,
    typescriptTag,
    stylingTag,
  ].filter((tag): tag is string => !!tag);

  return stackTags;
} 