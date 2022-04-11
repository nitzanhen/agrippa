import merge from 'deepmerge';
import { DeepPartial, kebabCase } from '../utils';
import { Config } from './Config';

export interface InputConfig extends DeepPartial<Config> {
  name: string;
}

export const defaultEnvironment = (packageJson: any): Config['environment'] => {
  const dependencies = packageJson.dependencies as Record<string, string>;

  if ('react-native' in dependencies) {
    return 'react-native';
  }
  else if ('preact' in dependencies) {
    return 'preact';
  }
  else if ('solid-js' in dependencies) {
    return 'solidjs';
  }
  else if ('react' in dependencies) {
    return 'react';
  }

  return 'custom';
};

export function createConfig(input: InputConfig, envFiles: Record<string, any>): Config {
  const { packageJson, tsconfig } = envFiles;
  const { name, styling } = input;

  const environment = defaultEnvironment(packageJson);

  const importReact = tsconfig?.compilerOptions?.jsx
    ? !/^react-jsx/.test(tsconfig.compilerOptions.jsx)
    : true;

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
    typescriptOptions: tsconfig ? {
      propDeclaration: 'interface'
    } : undefined,

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