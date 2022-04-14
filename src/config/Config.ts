import { Environment } from './Environment';
import { Styling } from './Styling';


/** @todo descriptions */
export interface Config {
  /** Component's name, *in pascal case* */
  name: string,
  /** Component's name in kebab case */
  kebabName: string

  componentOptions: {
    exportType: 'named' | 'default';
    declaration: 'const' | 'function';
  }

  environment: Environment | string;
  reactOptions?: {
    importReact: boolean;
  },
  solidjsOptions?: {},
  preactOptions?: {},
  reactNativeOptions?: {
    importReact: boolean;
  },

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
}