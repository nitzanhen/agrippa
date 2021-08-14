/**
 * @see {@link ./index.ts} for a description of option descriptions, aliases, defaults, etc.
 */
export interface Config {
  name: string;
  props: 'ts' | 'jsdoc' | 'prop-types' | 'none';
  children: boolean;
  typescript: boolean;
  flat: boolean;
  styling: 'none' | 'css' | 'scss' | 'jss' | 'mui';
  stylingModule: boolean;
  /** @todo */
  // memo: boolean;
  // forwardRef: boolean;
  importReact: boolean;
  debug: boolean;
  overwrite: boolean;
}