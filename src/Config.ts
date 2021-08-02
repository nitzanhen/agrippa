export interface Config {
  /** The component's name */
  name: string;

  /** How to generate prop data; 
   * `ts` is available only in Typescript, and is the default.
   * `jsdoc`, `prop-types` are available in both (though there's no real point to adding them in TS).
   * `none` is also available in both.
   * @todo what should be the default for JS?
   */
  props: 'ts' | 'jsdoc' | 'prop-types' | 'none';

  /** Whether the component is meant to have children (FC) or not (VFC). Defaults to false. */
  children: boolean;
  typescript: boolean;
  /** Whether to apply in current dir (true) or create a new dir (false). Defaults to false. */
  flat: boolean;
  
  /** Which styling to generate. Defaults to `none`. @todo make this configurable. */
  styling: 'none' | 'css' | 'scss' | 'jss' | 'mui';
  /** Relevant for `css` or `scss` styling. Generates a scoped `module` stylesheet. Defaults to `true` (if relevant). */
  stylingModule: boolean;

  /** @todo */
  // memo: boolean;
  // forwardRef: boolean;

  /** Whether to import React. Defaults to `true` @todo check versions. */
  importReact: boolean;

  debug: boolean;
  overwrite: boolean;
}