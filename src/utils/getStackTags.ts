import { Options, Framework, Styling } from '../options';
import { capitalize } from './strings';

const frameworkTags: Record<string, string> = {
  [Framework.REACT]: 'React',
  [Framework.REACT_NATIVE]: 'React Native',
  [Framework.SOLIDJS]: 'SolidJS',
  [Framework.PREACT]: 'Preact'
};

const stylingTags: Record<string, string> = {
  [Styling.CSS]: 'CSS',
  [Styling.SCSS]: 'SCSS',
  [Styling.JSS]: 'JSS',
  [Styling.STYLED_COMPONENTS]: 'styled-components'
};

/**
 * Determines a list of tags describing the project's stack.
 * These tags describe the stack's main components - framework, TS, styling, etc.
 * 
 * @todo find a way to make this configurable from outside/plugins.
 */
export function getStackTags(options: Options): string[] {
  const { framework, styling, typescript } = options;
  const fwTag = frameworkTags[framework] ?? capitalize(framework);
  const typescriptTag = typescript ? 'TypeScript' : undefined;
  const stylingTag = styling && stylingTags[styling];

  const stackTags = [
    fwTag,
    typescriptTag,
    stylingTag,
  ].filter((tag): tag is string => !!tag);

  return stackTags;
} 