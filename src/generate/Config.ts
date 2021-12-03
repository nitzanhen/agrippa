/**
 * @see {@link ./index.ts} for a description of option descriptions, aliases, defaults, etc.
 */
export interface Config {
  name: string;
  props: 'ts' | 'jsdoc' | 'prop-types' | 'none';
  children: boolean;
  typescript: boolean;
  flat: boolean;
  styling: 'none' | 'css' | 'scss' | 'jss' | 'mui' | 'react-native';
  stylingModule: boolean;
  memo: boolean;
  importReact: boolean;
  debug: boolean;
  overwrite: boolean;
  baseDir?: string;
  destination: string;
  postCommand?: string;
  allowOutsideBase: boolean;
  exportType: 'named' | 'default'
  declaration: 'const' | 'function';
  tsPropsDeclaration?: 'interface' | 'type';
  separateIndex: boolean;
  reactNative: boolean;
}