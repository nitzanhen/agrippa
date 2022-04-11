import { DeepPartial, kebabCase } from '../utils';
import { Config } from './Config';
import merge from 'deepmerge';

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
    createStylesFile,
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