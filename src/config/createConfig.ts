import { DeepPartial, kebabCase, pascalCase } from '../utils';
import { assignDefaults } from '../utils/object';
import { Config } from './Config';
import { ConfigDefinition } from './defineConfig';
import { Environment } from './Environment';
import { Styling } from './Styling';

export interface InputConfig extends DeepPartial<Config> {
  name: string;
}


export const defaultEnvironment = (packageJson: any): Config['environment'] => {
  const dependencies: Record<string, string> = packageJson?.dependencies ?? {};

  if ('react-native' in dependencies) {
    return Environment.REACT_NATIVE;
  }
  else if ('preact' in dependencies) {
    return Environment.PREACT;
  }
  else if ('solid-js' in dependencies) {
    return Environment.SOLIDJS;
  }
  else if ('react' in dependencies) {
    return Environment.REACT;
  }

  return '';
};

export function createConfig(input: InputConfig, envFiles: Record<string, any>): Config {
  const { packageJson, tsconfig } = envFiles;
  const agrippaConfig = envFiles.agrippaConfig as ConfigDefinition | null;

  /** Merge the given input with the resolve config options */
  input = assignDefaults(agrippaConfig?.options ?? {}, input);

  const { styling } = input;

  const name = pascalCase(input.name);
  input.name = name;

  const environment = input.environment ?? defaultEnvironment(packageJson);

  const importReact = tsconfig?.compilerOptions?.jsx
    ? !/^react-jsx/.test(tsconfig.compilerOptions.jsx)
    : true;

  const createStylesFile = ([Styling.CSS, Styling.SCSS, Styling.STYLED_COMPONENTS] as any[]).includes(styling);
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
    reactOptions: environment === Environment.REACT || environment === Environment.REACT_NATIVE ? {
      importReact,
      propTypes: false
    } : undefined,
    solidjsOptions: environment === Environment.SOLIDJS ? {} : undefined,
    preactOptions: environment === Environment.PREACT ? {} : undefined,
    reactNativeOptions: environment === Environment.REACT_NATIVE ? {} : undefined,

    typescript: !!tsconfig,
    typescriptOptions: (!!tsconfig || input.typescript) ? {
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
    pure: false,
    reportTelemetry: true,
    lookForUpdates: true,
    debug: false
  };

  return assignDefaults(defaults, input as Config);
}