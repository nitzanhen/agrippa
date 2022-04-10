import merge from 'deepmerge';
import { DeepPartial, kebabCase } from './utils';

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

  environment: 'react' | 'solidjs' | 'preact' | 'react-native' | 'custom';
  reactOptions?: {
    importReact: boolean;
  },
  solidjsOptions?: {},
  preactOptions?: {},
  reactNativeOptions?: {
    importReact: boolean;
  },

  typescript: boolean;
  typescriptOptions?: {};

  styling?: string;
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

export interface InputConfig extends DeepPartial<Config> {
  name: string;
}

export function createConfig(input: InputConfig, envFiles: Record<string, any>): Config {
  const { packageJson, tsconfig } = envFiles;
  const { name } = input;

  const environment = 'custom' as Config['environment']; // todo

  const importReact = tsconfig?.compilerOptions?.jsx
    ? !/^react-jsx/.test(tsconfig.compilerOptions.jsx)
    : true;

  const styling = undefined as string | undefined; // todo

  const createStylesFile = (['css', 'scss', 'styled-components'] as any[]).includes(styling);
  const stylesFileExtension = (() => {
    switch (styling) {
      case 'css': return 'css';
      case 'scss': return 'scss';
      case 'styled-components': return 'ts';
      default: return '';
    }
  })();

  const defaults: Config = {
    name,
    kebabName: kebabCase(name),
    componentOptions: {
      exportType: 'named',
      declaration: 'const'
    },

    environment,
    reactOptions: environment === 'react' ? {
      importReact
    } : undefined,
    solidjsOptions: environment === 'solidjs' ? {} : undefined,
    preactOptions: environment === 'preact' ? {} : undefined,
    reactNativeOptions: environment === 'react-native' ? {
      /** @todo */
      importReact: false
    } : undefined,

    typescript: !!tsconfig,
    typescriptOptions: tsconfig ? {} : undefined,

    styling,
    styleFileOptions: createStylesFile ? {
      extension: stylesFileExtension,
      module: true,
    } : undefined,

    baseDir: process.cwd(),
    destination: '.',
    allowOutsideBase: false,

    overwrite: false,
    pure: false
  };

  return merge(defaults, input as Config);
}