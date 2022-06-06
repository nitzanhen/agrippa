import { Environment } from './Environment';
import { Styling } from './Styling';

/** @todo descriptions */
export interface GenerateOptions {
  componentOptions: {
    exportType: 'named' | 'default';
    declaration: 'const' | 'function';
  }

  environment: Environment | string;
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
  reportUsageStatistics: boolean;
  lookForUpdates: boolean;
  debug: boolean;
}

export interface Config extends GenerateOptions {
  /** Component's name, *in pascal case* */
  name: string,
  /** Component's name in kebab case */
  kebabName: string  
}