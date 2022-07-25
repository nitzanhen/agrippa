import { DeepPartial, kebabCase, pascalCase } from '../utils';
import { assignDefaults } from '../utils/object';
import { Options } from './Options';
import { Framework } from './Framework';
import { Styling } from './Styling';

export interface InputOptions extends DeepPartial<Options> {
  name: string;
}


export const defaultFramework = (packageJson: any): Options['framework'] => {
  const dependencies: Record<string, string> = packageJson?.dependencies ?? {};

  if ('react-native' in dependencies) {
    return Framework.REACT_NATIVE;
  }
  else if ('preact' in dependencies) {
    return Framework.PREACT;
  }
  else if ('solid-js' in dependencies) {
    return Framework.SOLIDJS;
  }
  else if ('react' in dependencies) {
    return Framework.REACT;
  }

  return '';
};

export function createOptions(input: InputOptions, envFiles: Record<string, any>): Options {
  const { packageJson, tsconfig } = envFiles;

  const { styling } = input;

  const name = pascalCase(input.name);
  input.name = name;

  const framework = input.framework ?? defaultFramework(packageJson);

  const createStylesFile = ([Styling.CSS, Styling.SCSS, Styling.STYLED_COMPONENTS] as any[]).includes(styling);
  const stylesFileExtension = (() => {
    switch (styling) {
      case 'css': return 'css';
      case 'scss': return 'scss';
      case 'styled-components': return 'ts';
      default: return '';
    }
  })();

  const defaults: Options = {
    name,
    kebabName: kebabCase(name),
    componentOptions: {
      exportType: 'named',
      declaration: 'const'
    },

    framework: framework,
    reactOptions: framework === Framework.REACT || framework === Framework.REACT_NATIVE ? {
      importReact: false,
      propTypes: false
    } : undefined,
    solidjsOptions: framework === Framework.SOLIDJS ? {} : undefined,
    preactOptions: framework === Framework.PREACT ? {} : undefined,
    reactNativeOptions: framework === Framework.REACT_NATIVE ? {} : undefined,

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

  return assignDefaults(defaults, input as Options);
}