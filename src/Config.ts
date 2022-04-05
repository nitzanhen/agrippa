
/** @todo descriptions */
export interface Config {
  /** Component's name, *in pascal case* */
  name: string,
  /** Component's name in kebab case */
  kebabName: string

  environment: 'react' | 'solidjs' | 'preact' | 'react-native' | 'custom';
  reactOptions?: {},
  solidjsOptions?: {},
  preactOptions?: {},
  reactNativeOptions?: {},

  typescript: boolean;
  typescriptOptions?: {};

  styling: string;
  cssOptions?: {
    modules: boolean
  }

  baseDir: string;
  destination: string;
  allowOutsideBase: boolean;
  flat: boolean;







  pure: boolean;
}