
export interface Config {
  name: string;
  props: 'ts' | 'jsdoc' | 'prop-types' | 'none';
  children: boolean;
  typescript: boolean;
  flat: boolean;
  styling: 'none' | 'css' | 'scss' | 'jss' | 'mui' | 'react-native' | 'styled-components';
  stylingModule: boolean;
  memo: boolean;
  importReact: boolean;
  debug: boolean;
  overwrite: boolean;
  baseDir: string | undefined;
  destination: string;
  postCommand: string | undefined;
  allowOutsideBase: boolean;
  exportType: 'named' | 'default'
  declaration: 'const' | 'function';
  tsPropsDeclaration: 'interface' | 'type' | undefined;
  separateIndex: boolean;
  reactNative: boolean;
  pure: boolean;
}