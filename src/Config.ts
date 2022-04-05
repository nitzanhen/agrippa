
export interface Config {
  environment: 'react' | 'solidjs' | 'preact' | 'react-native' | 'custom',
  typescript: boolean,
  styling: ''

  reactOptions?: {},
  solidjsOptions?: {},
  preactOptions?: {},
  reactNativeOptions?: {},
  typescriptOptions?: {}

  pure: boolean;
}