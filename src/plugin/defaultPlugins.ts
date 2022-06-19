import { join, resolve } from 'path';
import { CodeComposer, ImportPlugin, PreactPlugin, PropTypesPlugin, ReactNativePlugin, ReactPlugin, SolidPlugin } from '../composer';
import { Logger } from '../logger';
import { Environment, Options } from '../options';
import { AgrippaDir, AgrippaFile } from '../stage';
import { joinLines } from '../utils';
import { CreateDirPlugin } from './CreateDirPlugin';
import { CreateFilePlugin } from './CreateFilePlugin';
import { Plugin } from './Plugin';

const getDirPath = ({ baseDir, destination, name }: Options) => resolve(baseDir ?? process.cwd(), destination, name);

export const getEnvironmentPlugin = (options: Options, logger: Logger) => {
  switch (options.environment) {
    case Environment.REACT: return new ReactPlugin(options);
    case Environment.REACT_NATIVE: return new ReactNativePlugin(options);
    case Environment.SOLIDJS: return new SolidPlugin(options);
    case Environment.PREACT: return new PreactPlugin(options);
    default: {
      logger.warn(
        'No environment flag was received, and Agrippa was unable to detect the environment automatically. Please check your configuration.',
        ''
      );
      return null;
    };
  }
};

export function defaultComponentFile(options: Options, logger: Logger, styleFilePath?: string): AgrippaFile {
  const { name, typescript } = options;

  const dirPath = getDirPath(options);

  const componentFileExtension = typescript ? 'tsx' : 'jsx';
  const componentFileName = `${name}.${componentFileExtension}`;
  const componentFilePath = join(dirPath, componentFileName);

  const composer = new CodeComposer(options);

  const environmentPlugin = getEnvironmentPlugin(options, logger);
  if (environmentPlugin) {
    composer.addPlugin(environmentPlugin);
  }
  if (styleFilePath) {
    composer.addPlugin(new ImportPlugin({
      module: styleFilePath,
      defaultImport: options.styleFileOptions?.module ? 'classes' : undefined
    }));
  }

  if (options.reactOptions?.propTypes) {
    composer.addPlugin(new PropTypesPlugin());
  }

  return new AgrippaFile(componentFilePath, composer.compose());
}

export function defaultIndexFile(options: Options): AgrippaFile {
  const { name, componentOptions: { exportType }, typescript } = options;

  const dirPath = getDirPath(options);

  const fileName = `index.${typescript ? 'ts' : 'js'}`;
  const path = join(dirPath, fileName);

  const code = joinLines(
    `export * from './${name}';`,
    exportType === 'default' && `export { default } from './${name}';`
  );

  return new AgrippaFile(path, code);
}

export function defaultPlugins(options: Options, logger: Logger ): Plugin[] {
  const { name, kebabName, typescript, styling, styleFileOptions, createStylesFile } = options;

  const dirPath = getDirPath(options);

  const stylesFileName = styling === 'styled-components'
    ? `${name}.styles.${typescript ? 'ts' : 'js'}`
    : `${kebabName}${styleFileOptions?.module ? '.module' : ''}.${styling}`;

  const stylesFilePath = join(dirPath, stylesFileName);

  return ([
    new CreateDirPlugin({
      dir: new AgrippaDir(dirPath),
      varKey: 'dirPath'
    }),
    new CreateFilePlugin({
      file: defaultComponentFile(options, logger, createStylesFile ? `./${stylesFileName}` : undefined),
      varKey: 'componentPath'
    }),
    createStylesFile && new CreateFilePlugin({
      file: new AgrippaFile(stylesFilePath, ''),
      varKey: 'stylesPath'
    }),
    new CreateFilePlugin({
      file: defaultIndexFile(options),
      varKey: 'indexPath'
    })
  ] as (Plugin | boolean)[]
  ).filter((p): p is Plugin => !!p);
}