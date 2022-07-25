import { Framework } from './Framework';
import { Styling } from './Styling';

/** 
 * Agrippa generation options. 
 */
export interface Options {
  /** Component's name, *in pascal case* */
  name: string,
  /** Component's name in kebab case */
  kebabName: string  

  componentOptions: {
    exportType: 'named' | 'default';
    declaration: 'const' | 'function';
  }

  framework: Framework | string;
  reactOptions?: {
    importReact: boolean;
    propTypes: boolean;
  },
  solidjsOptions?: {},
  preactOptions?: {},
  reactNativeOptions?: {},

  typescript: boolean;
  typescriptOptions?: {
    propDeclaration: 'interface' | 'type' | null
  };

  styling?: Styling | string;
  createStylesFile: boolean,
  styleFileOptions?: {
    extension: string;
    module: boolean;
  }

  baseDir: string;
  destination: string;
  allowOutsideBase: boolean;

  overwrite: boolean;
  pure: boolean;
  reportTelemetry: boolean;
  lookForUpdates: boolean;
  debug: boolean;
}